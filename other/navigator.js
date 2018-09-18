// This JavaScript file is used by navigator.html to provide a simple interface
// with which to test a layout.json file's border connections and try to find
// holes. It cycles through various spaces on an Axis & Allies board, showing
// the bordering spaces of each selected space and allowing the user to
// navigate between each space as they see fit, thereby moving around the board!

"use strict";
!function() {
	
	let spaces = {};
	let selected = undefined;
	
	window.addEventListener("load", function() {
		ajaxGET("../map/1942/layout.json", loadLayout);
	});
	
	// loads the entire layout JSON file into an associative array of custom
	// "Space" objects, for easy reference throughout the program
	function loadLayout(json) {
		let data = JSON.parse(json);
		// loads all sea zones (by number!)
		for (let i = 1; i <= data.sea_zones; i++) {
			let name = "" + i;
			spaces[name] = new Space(name);
			console.log("loaded " + name);
		}
		// loads all territories by given name
		let territories = data.territories;
		for (let i = 0; i < territories.length; i++) {
			let name = territories[i].name;
			spaces[name] = new Space(name);
			console.log("loaded " + name);
		}
		// loads all borders, connecting each of the connection's ends to the
		// other by placing their corresponding objects within each other's
		// "neighbors" attribute
		let borders = data.borders.open;
		for (let i = 0; i < borders.length; i++) {
			let border = borders[i];
			spaces[border[0]].neighbors.push(spaces[border[1]]);
			spaces[border[1]].neighbors.push(spaces[border[0]]);
			console.log("loaded the border between " + border[0] + " and " + border[1]);
		}
		// selects a random space to start
		let keys = Object.keys(spaces);
		selected = spaces[keys[keys.length * Math.floor(Math.random())]];
		loadSelected();
		
	}
	
	// loads the object currently defining "selected" by loading its data into
	// the shown HTML (for manipulation)
	function loadSelected() {
		$("output").textContent = selected.name;
		let neighbors = selected.neighbors;
		let input = $("input");
		// clears navigation options DOM
		while (input.firstChild) { input.removeChild(input.firstChild); }
		// places new navigation options based on borders
		for (let i = 0; i < neighbors.length; i++) {
			let btn = ce("button");
			btn.textContent = neighbors[i].name;
			btn.value = neighbors[i].name;
			btn.onclick = select;
			input.appendChild(btn);
		}
	}
	
	// function called by a clicked navigation button to load the new space
	// into the HTML and effectively start over
	function select() {
		selected = spaces[this.value];
		loadSelected();
	}
	
	// definition of a "Space" object pattern
	function Space(name) {
		this.name = name;
		this.neighbors = []; // other space objects
	}
	
}();