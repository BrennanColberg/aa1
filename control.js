"use strict";
(function() {
	
	function $(id) { return document.getElementById(id); }
	function qs(key) { return document.querySelector(key); }
	function qsa(key) { return document.querySelector(key); }
	function tag(tag) { return document.getElementsByTagName(tag); }
	function hide(dom) { dom.classList.add("hidden"); }
	function show(dom) { dom.classList.remove("hidden"); }
	
	const MEASURED_TIME_INTERVAL = 100;

	const country_name = [
		"USSR",
		"Germany",
		"Britain",
		"Japan",
		"USA"
	];
	
	const country_color = [
		"#590816",
		"#000000",
		"#d3d098",
		"#e29e0b",
		"#1a7705"
	];
	
	const country_flag = [
		"flags/ussr.png",
		"flags/germany.png",
		"flags/britain.png",
		"flags/japan.png",
		"flags/usa.png"
	];
	
	let index = 0;
	let count = 5;
	let anthem = undefined;
	let elapsedTime = [];
	
	window.addEventListener("load", function() {
		hide($("title"));
		hide($("timer"));
		hide($("flag"));
		hide($("back"));
		$("next").textContent = "Start";
		$("next").onclick = loadFirst;
		$("back").onclick = loadLast;
		document.addEventListener("keydown", key);
	});
	
	function loadFirst() {
		show($("title"));
		show($("timer"));
		show($("flag"));
		show($("back"));
		load();
		this.textContent = "Next";
		this.onclick = loadNext;
		setInterval(calcTime, MEASURED_TIME_INTERVAL);
	}
	
	function load() {
		$("title").textContent = country_name[index];
		$("flag").src = country_flag[index];
		if (anthem != undefined) anthem.pause();
		anthem = document.getElementsByTagName("audio")[index];
		anthem.currentTime = 0;
		anthem.play();
	}
	
	function loadNext() {
		index++;
		if (index >= count) {
			index = 0;
		}
		load();
 	}
	
	function loadLast() {
		index--;
		if (index < 0) {
			index = count - 1;
		}
		load();
 	}
	
	function key(event) {
		if (event.keyCode == 32) loadNext();
		else if (event.keyCode == 13) loadLast();
	}
	
	function calcTime() {
		if (!elapsedTime[index]) elapsedTime[index] = 0;
		elapsedTime[index] += MEASURED_TIME_INTERVAL;
		$("timer").textContent = timeString(elapsedTime[index]);
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