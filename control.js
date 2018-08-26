"use strict";
(function() {
	
	// simple function abbreviations that shorten my code nicely
	function $(id) { return document.getElementById(id); }
	function hide(dom) { dom.classList.add("hidden"); }
	function show(dom) { dom.classList.remove("hidden"); }
	
	// declaring module-global variables
	let current = undefined;
	let order = undefined;
	let defaultState = undefined;
	let resources = undefined;
	let anthemPlayer = new AnthemPlayer();
	let timer = new Timer();
	let timerDisplay = undefined;
	
	// ultimate starting loading function
	window.addEventListener("load", function() {
		// AJAX setup
		ajaxGET("save/timer.json", timer.load);
		ajaxGET("resources/order.json", loadOrder);
		ajaxGET("default.json", loadDefault);
		ajaxGET("resources/index.json", loadResources);
		// loads JS to buttons
		$("control").onclick = startGame;
		$("resume").onclick = function() { 
			if (cookieExists("timer")) { timer.load(loadCookie("timer")); }
			if (cookieExists("current")) { current = loadCookie("current"); }
			startGame();
		}
		$("next").onclick = next;
		$("back").onclick = back;
		// shows "resume" button if there's a save
		if (cookieExists("current")) show($("resume"));
		// adds more event listeners (for saving, keys, etc)
		document.addEventListener("keydown", pressKey);
		window.addEventListener("beforeunload", saveData);
		window.addEventListener("blur", saveData);
	});
	
	function loadOrder(json) {
		order = JSON.parse(json);
	}
	function loadDefault(json) {
		defaultState = JSON.parse(json);
		current = defaultState.current;
	}
	function loadResources(json) {
		resources = JSON.parse(json);
	}
	
	// starts the game
	function startGame() {
		hide($("resume")); // no need to "resume" anymore
		updateCountry();
		// TODO fix this sloppiness; pass DOM
		// I do this weirdly because play references "this"
		// and so it needs to be called by a click not a direct
		// method invocation
		$("control").onclick = play;
		$("control").click();
		
	}
	
	// saves game state, in various JSON files, into the cookies
	function saveData() {
		saveCookie("current", current);
		saveCookie("timer", timer.save());
	}
	
	// pauses the game (stops timer, stops music, etc)
	function pause() {
		anthemPlayer.pause();
		timer.pause();
		hide($("next"));
		hide($("back"));
		// toggling "pause" button to "play" button
		this.textContent = "Play";
		this.onclick = play;
	}

	// starts/resumes/"play"s the game (starts timer, starts music)
	function play() {
		anthemPlayer.play();
		timer.play();
		show($("info"));
		show($("next"));
		show($("back"));
		// toggling "play" button to "pause" button
		this.textContent = "Pause";
		this.onclick = pause;
	}
	
	// tracks key presses and lets them do things
	function pressKey(event) {
		let key = event.keyCode;
		if (key === 32) 
			$("control").click();	// space = pause/play
		else if (key === 39 && !$("next").classList.contains("hidden"))
			$("next").click();		// right arrow = next
		else if (key === 37 && !$("back").classList.contains("hidden"))
			$("back").click();		// left arrow = back
//		else console.log("key " + key + " pressed");

	}
	
	// loads the current country's name and flag
	function updateCountry() {
		
		$("title").textContent = resources.name[current];
		$("flag").src = resources.flag[current];
		startAnthem();
		
		timer.setCountry(current);
		timer.reset();
		printTime();
		if (timerDisplay) clearInterval(timerDisplay);
		timerDisplay = setInterval(printTime, 1000);
		
	}
	
	// starts playing the current country's anthem
	function startAnthem() {
		anthemPlayer.start(resources.anthem[current]);
	}
	
	// goes to the next country's turn
	function next() {
		current = order[wrap(order.indexOf(current) + 1, 0, order.length - 1)];
		updateCountry();
 	}
	
	// goes to the last country's turn
	function back() {
		current = order[wrap(order.indexOf(current) - 1, 0, order.length - 1)];
		updateCountry();
	}
	
	// standard method for wrapping numbers (confines to boundaries
	// but then adds excess in a periodic fashion)
	function wrap(num, min, max) {
		let r = max - min + 1;
		while(num > max) num -= r;
		while(num < min) num += r;
		return num;
	}
	
	// prints the time to the screen
	function printTime() {
		timer.display($("currentTime"), $("totalTime"));
	}
	
})();