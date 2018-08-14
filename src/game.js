!function() {
	
	let width = undefined;
	let height = undefined;
	let context = undefined;
	let x = 0, y = 0;
	
	let map = undefined;
	
	window.addEventListener("resize", resize);
	window.addEventListener("load", function() {
		ajaxGET("../map/1942/layout.json", loadMap);
		resize();
		setInterval(tick, 1);
	});
	
	function loadMap(json) {
		map = JSON.parse(json);
	}
	
	function resize() {
		let canvas = qs("canvas");
		width = canvas.width = window.innerWidth;
		height = canvas.height = window.innerHeight;
		context = canvas.getContext("2d");
	}
	
	function tick() {
		// making copies of x and y so that changes during draw do not screw up menu positioning
		let frameX = x, frameY = y;
		
		context.clearRect(0, 0, width, height); // clear frame
		
		context.translate(frameX, frameY); // drawing moving graphics
		drawRelativeGraphics();
		
		context.translate(-frameX, -frameY); // drawing menus etc
		drawFixedGraphics();
	}
	
	function drawRelativeGraphics() {
		
	}
	
	function drawFixedGraphics() {
		
	}
	
}();