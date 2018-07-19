"use strict";
(function() {
	
	function $(id) { return document.getElementById(id); }
	function qs(key) { return document.querySelector(key); }
	function qsa(key) { return document.querySelector(key); }
	function tag(tag) { return document.getElementsByTagName(tag); }
	function hide(dom) { dom.classList.add("hidden"); }
	function show(dom) { dom.classList.remove("hidden"); }
	
	let data = undefined;
	let anthem = undefined;
	let timer = undefined;
	
	window.addEventListener("load", function() {
		$("control").onclick = function() { ajaxGET("default.json", loadData); };
		$("resume").onclick = function() { ajaxGET("save.json", loadData); }
		$("next").onclick = next;
		$("back").onclick = back;
		document.addEventListener("keydown", pressKey);
	});
	
	function loadData(json) {
		data = JSON.parse(json);
		refresh();
		hide($("resume"));
		$("control").onclick = play;
		$("control").click();
	}
	
	function saveData() {
		ajaxPOST("file.php",null,"url","save.json","data",JSON.stringify(data));
	}
	
	function pause() {
		saveData();
		hide($("info"));
		hide($("next"));
		hide($("back"));
		clearInterval(timer);
		this.textContent = "Play";
		this.onclick = play;
	}
	
	function play() {
		show($("info"));
		show($("next"));
		show($("back"));
		timer = setInterval(updateTime, data.MEASURED_TIME_INTERVAL);
		this.textContent = "Pause";
		this.onclick = pause;
	}
	
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
	
	function refresh() {
		saveData();
		$("title").textContent = data.countries[data.current.index].name;
		$("flag").src = data.countries[data.current.index].flag;
		if (anthem) anthem.pause();
		anthem = new Audio(data.countries[data.current.index].anthem);
		anthem.loop = true;
		anthem.play();
		printTime();
	}
	
	function next() {
		data.current.index = wrap(data.current.index + 1, 0, data.countries.length - 1);
		refresh();
		resetTime();
 	}
	
	function back() {
		data.current.index = wrap(data.current.index - 1, 0, data.countries.length - 1);
		refresh();
		resetTime();
	}
	
	function resetTime() {
		data.current.time = 0;
		printTime();
		
	}
	
	function updateTime() {
		data.current.time += data.MEASURED_TIME_INTERVAL;
		data.countries[data.current.index].elapsed_time += data.MEASURED_TIME_INTERVAL;
		printTime();
	}
	
	function printTime() {
		$("currentTime").textContent = timeString(data.current.time);
		$("totalTime").textContent = timeString(data.countries[data.current.index].elapsed_time);
	}
	
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