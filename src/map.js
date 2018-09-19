
function Map() {
	
	let owner = {};
	let start = {};
	let map = undefined;
	
	this.load = function(territoryJSON, mapSource, update) {
		let countryToOwned = JSON.parse(territoryJSON);
		let countries = Object.keys(countryToOwned);
		for (let c = 0; c < countries.length; c++) {
			let country = countries[c];
			let territories = countryToOwned[country];
			for (let i = 0; i < territories.length; i++) {
				let territory = territories[i];
				owner[territory] = start[territory] = country;
				
			}
		}
		ajaxGET(mapSource, function(json) {
			map = JSON.parse(json);
			update();
		});
	};
	
	// get a list of all territories a country can take over
	this.conquerable = function(country) {
		if (map) {
			let result = [];
			let territoryNames = Object.keys(owner);
			for (let i = 0; i < territoryNames.length; i++) {
				let territory = territoryNames[i];
				if (map.alliances[owner[territory]] !==
						map.alliances[country]) {
					result.push(territory);
				}
			}
			result.sort();
			return result;
		}
	};
	
	this.conquer = function(country, territory, bank) {
		let otherCountry = owner[territory];
		// liberation (if from same alliance)
		if (map.alliances[start[territory]] === map.alliances[country]) {
			country = start[territory];
		}
		// capital takeover (if from different alliance and capital)
		else if (map.territories[territory].capital) {
			bank.adjustBalance(country, bank.balance(otherCountry));
			bank.balance(otherCountry, 0);
		}
		// ownership transfer
		owner[territory] = country;
		// income adjustment
		let territoryValue = map.territories[territory].value;
		bank.adjustIncome(otherCountry, -territoryValue);
		bank.adjustIncome(country, territoryValue);
	}
	
	this.hasCapital = function(country) {
		let territoryNames = Object.keys(map.territories);
		for (let i = 0; i < territoryNames.length; i++) {
			let name = territoryNames[i];
			if (map.territories[name].capital)
				if (start[name] === country)
					return owner[name] === country;
		}
	}
	
}