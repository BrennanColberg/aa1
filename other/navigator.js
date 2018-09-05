!function() {
	
	let spaces = {};
	let selected = undefined;
	
	window.addEventListener("load", function() {
		
		ajaxGET("../map/1942/layout.json", loadLayout);
		
	});
	
	function loadLayout(json) {
		let data = JSON.parse(json);
		
		for (let i = 1; i <= data.sea_zones; i++) {
			let name = "" + i;
			spaces[name] = new Space(name);
			console.log("loaded " + name);
		}
		
		let territories = data.territories;
		for (let i = 0; i < territories.length; i++) {
			let name = territories[i].name;
			spaces[name] = new Space(name);
			console.log("loaded " + name);
		}
		
		let borders = data.borders.open;
		for (let i = 0; i < borders.length; i++) {
			let border = borders[i];
			spaces[border[0]].neighbors.push(spaces[border[1]]);
			spaces[border[1]].neighbors.push(spaces[border[0]]);
			console.log("loaded the border between " + border[0] + " and " + border[1]);
		}
		
		let keys = Object.keys(spaces);
		selected = spaces[keys[keys.length * Math.floor(Math.random())]];
		loadSelected();
		
	}
	
	function loadSelected() {
		$("output").textContent = selected.name;
		let neighbors = selected.neighbors;
		let input = $("input");
		while (input.firstChild) { input.removeChild(input.firstChild); }
		for (let i = 0; i < neighbors.length; i++) {
			let btn = ce("button");
			btn.textContent = neighbors[i].name;
			btn.value = neighbors[i].name;
			btn.onclick = select;
			input.appendChild(btn);
		}
	}
	
	function select() {
		selected = spaces[this.value];
		loadSelected();
	}
	
	function Space(name) {
		this.name = name;
		this.neighbors = []; // other space objects
	}
	
}();