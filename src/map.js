
function Map() {
	
	let territoryOwner = {};
	let map = undefined;
	
	this.load = function(territoryJSON, mapSource, update) {
		let countryToOwned = JSON.parse(territoryJSON);
		let countries = Object.keys(countryToOwned);
		for (let c = 0; c < countries.length; c++) {
			let country = countries[c];
			let territories = countryToOwned[country];
			for (let i = 0; i < territories.length; i++) {
				let territory = territories[i];
				territoryOwner[territory] = country;
			}
		}
		ajaxGET(mapSource, function(json) {
			map = JSON.parse(json);
			console.log(map);
			update();
		});
	};
	
	// get a list of all territories a country can take over
	this.conquerable = function(country) {
		if (map) {
			let result = [];
			let territoryNames = Object.keys(territoryOwner);
			for (let i = 0; i < territoryNames.length; i++) {
				let territory = territoryNames[i];
				if (map.alliances[territoryOwner[territory]] !==
						map.alliances[country]) {
					result.push(territory);
				}
			}
			result.sort();
			return result;
		}
	};
	
	this.conquer = function(country, territory, bank) {
		// ownership
		let otherCountry = territoryOwner[territory];
		territoryOwner[territory] = country;
		// income
		let territoryValue = map.territories[territory].value;
		bank.adjustIncome(otherCountry, -territoryValue);
		bank.adjustIncome(country, territoryValue);
	}
	
}