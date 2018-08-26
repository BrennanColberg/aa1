"use strict";
(function() {
	
	// simple function abbreviations that shorten my code nicely
	function $(id) { return document.getElementById(id); }
	function hide(dom) { dom.classList.add("hidden"); }
	function show(dom) { dom.classList.remove("hidden"); }
	
	// declaring module-global variables
	let data = undefined;
	let anthemPlayer = new AnthemPlayer();
	let timer = new Timer();
	
	// ultimate starting loading function
	window.addEventListener("load", function() {
		// AJAX setup
		ajaxGET("save/timer.json", timer.load);
		// loads JS to buttons
		$("control").onclick = function() { ajaxGET("default.json", loadGame); };
		$("resume").onclick = function() { 
			if (cookieExists("timer")) { timer.load(loadCookie("timer")); }
			if (cookieExists("data")) { loadGame(loadCookie("data")); }
		}
		$("next").onclick = next;
		$("back").onclick = back;
		// shows "resume" button if there's a save
		if (cookieExists("data")) show($("resume"));
		// adds more event listeners (for saving, keys, etc)
		document.addEventListener("keydown", pressKey);
		window.addEventListener("beforeunload", saveData);
		window.addEventListener("blur", saveData);
	});
	
	// loads the given JSON as the game state (default or save)
	function loadGame(json) {
		data = JSON.parse(json);
		console.log(data);
		updateDisplay();
		startAnthem();
		hide($("resume")); // no need to "resume" anymore
		timer.setCountry(data.current);
		setInterval(printTime, 10);
		// I do this weirdly because play references "this"
		// and so it needs to be called by a click not a direct
		// method invocation
		$("control").onclick = play;
		$("control").click();
		
	}
	
	// saves game state, in various JSON files, into the cookies
	function saveData() {
		if (data) {
			saveCookie("data", JSON.stringify(data));
		}
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
	function updateDisplay() {
		$("title").textContent = data.countries[data.current].name;
		$("flag").src = data.countries[data.current].flag;
		printTime();
	}
	
	// starts playing the current country's anthem
	function startAnthem() {
		anthemPlayer.start(data.countries[data.current].anthem);
	}
	
	// goes to the next country's turn
	function next() {
		data.current = 
			data.order[
				wrap(data.order.indexOf(data.current) + 1, 0, data.countries.length - 1)
			];
		timer.setCountry(data.current);
		updateDisplay();
		timer.reset();
		startAnthem();
 	}
	
	// goes to the last country's turn
	function back() {
		data.current = 
			data.order[
				wrap(data.order.indexOf(data.current) - 1, 0, data.countries.length - 1)
			];
		timer.setCountry(data.current);
		updateDisplay();
		timer.reset();
		startAnthem();
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