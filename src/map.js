
function Map() {
	
	let control = undefined;
	let map = undefined;
	
	this.load = function(territoryJSON, mapSource, update) {
		control = JSON.parse(territoryJSON);
		ajaxGET(mapSource, function(json) {
			map = JSON.parse(json);
			update();
		});
	};
	
	// get a list of all territories a country owns
	this.owned = function(country) {
		return control[country].sort();
	};
	
	// get a list of all territories a country owns
	this.unowned = function(country) {
		let owned = this.owned(country);
		let unowned = [];
		let territoryNames = Object.keys(map.territories);
		for (let i = 0; i < territoryNames.length; i++) {
			let territory = map.territories[territoryNames[i]];
			if (owned.indexOf(territory) === -1 && !territory.neutral) {
				unowned.push(territoryNames[i]);
			}
		}
		return unowned.sort();
	};
	
}