"use strict";
(function() {
	
	// simple function abbreviations that shorten my code nicely
	function $(id) { return document.getElementById(id); }
	function hide(dom) { dom.classList.add("hidden"); }
	function show(dom) { dom.classList.remove("hidden"); }
	
	// declaring module-global variables
	let data = undefined;
	let anthem = undefined;
	let timer = undefined;
	
	// ultimate starting loading function
	window.addEventListener("load", function() {
		// loads JS to buttons
		$("control").onclick = function() { ajaxGET("default.json", loadGame); };
		$("resume").onclick = function() { loadGame(loadCookie("data")); }
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
		updateDisplay();
		startAnthem();
		hide($("resume")); // no need to "resume" anymore
		// I do this weirdly because play references "this"
		// and so it needs to be called by a click not a direct
		// method invocation
		$("control").onclick = play;
		$("control").click();
	}
	
	// saves game state to a JSON-format cookie (which is notably
	// not a good way to store data, but I'm hosting on GitHub
	// Pages to cheap out on server space so it's fine I guess)
	function saveData() {
		// logic check to avoid saving blank data and screwing
		// everything up
		if (data) {
			saveCookie("data", JSON.stringify(data));
		}
	}
	
	// pauses the game (stops timer, stops music, etc)
	function pause() {
		anthem.pause();
		hide($("next"));
		hide($("back"));
		clearInterval(timer);
		// toggling "pause" button to "play" button
		this.textContent = "Play";
		this.onclick = play;
	}

	// starts/resumes/"play"s the game (starts timer, starts music)
	function play() {
		anthem.play()
		show($("info"));
		show($("next"));
		show($("back"));
		timer = setInterval(updateTime, data.MEASURED_TIME_INTERVAL);
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
		$("title").textContent = data.countries[data.current.index].name;
		$("flag").src = data.countries[data.current.index].flag;
		printTime();
	}
	
	// starts playing the current country's anthem
	function startAnthem() {
		// stops currently playing anthem if it exists
		if (anthem) anthem.pause();
		anthem = new Audio(data.countries[data.current.index].anthem);
		anthem.loop = true;
		// resumes correct time loading from a save?
		anthem.addEventListener('loadedmetadata', function() {
    		this.currentTime = (data.current.time / 1000.0) % this.duration;
    		this.play(); 
		});
	}
	
	// goes to the next country's turn
	function next() {
		data.current.index = wrap(data.current.index + 1, 0, data.countries.length - 1);
		updateDisplay();
		resetTime();
		startAnthem();
 	}
	
	// goes to the last country's turn
	function back() {
		data.current.index = wrap(data.current.index - 1, 0, data.countries.length - 1);
		updateDisplay();
		resetTime();
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
	
	// resets the current time
	function resetTime() {
		data.current.time = 0;
		printTime();
	}
	
	// updates the timer
	function updateTime() {
		data.current.time += data.MEASURED_TIME_INTERVAL;
		data.countries[data.current.index].elapsed_time += data.MEASURED_TIME_INTERVAL;
		printTime();
	}
	
	// prints the time to the screen
	function printTime() {
		$("currentTime").textContent = timeString(data.current.time);
		$("totalTime").textContent = timeString(data.countries[data.current.index].elapsed_time);
	}
	
	// turns an int millisecond measurement into a 00:00:00 clock
	function timeString(time) {
		let result = "";
		time = Math.floor(time);
		let seconds = 	Math.floor(time / 1000) % 60;
		let minutes = 	Math.floor(time / 1000 / 60) % 60;
		let hours = 	Math.floor(time / 1000 / 60 / 60);
		if (hours) result += hours + ":";
		result += (minutes < 10 ? "0" : "") + minutes + ":";
		result += (seconds < 10 ? "0" : "") + seconds;
		return result;
	}
	
})();