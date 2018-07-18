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
//	let elapsedTime = [];
	let currentTime = undefined;
	
	window.addEventListener("load", function() {
		hide($("title"));
		hide($("timer"));
		hide($("flag"));
		hide($("back"));
		$("next").textContent = "Start";
		$("next").onclick = start;
		$("back").onclick = back;
		document.addEventListener("keydown", key);
	});
	
	function start() {
		show($("title"));
		show($("timer"));
		show($("flag"));
		show($("back"));
		refresh();
		this.textContent = "Next";
		this.onclick = next;
		setInterval(updateTime, MEASURED_TIME_INTERVAL);
	}
	
	function refresh() {
		$("title").textContent = country_name[index];
		$("flag").src = country_flag[index];
		if (anthem != undefined) anthem.pause();
		anthem = document.getElementsByTagName("audio")[index];
		anthem.currentTime = 0;
		anthem.play();
		resetTime();
	}
	
	function next() {
		index++;
		if (index >= count) {
			index = 0;
		}
		refresh();
 	}
	
	function back() {
		index--;
		if (index < 0) {
			index = count - 1;
		}
		refresh();
 	}
	
	function key(event) {
		if (event.keyCode == 32) next();
		else if (event.keyCode == 13) back();
	}
	
	function resetTime() {
		currentTime = 0;
	}
	
	function updateTime() {
		currentTime += MEASURED_TIME_INTERVAL;
		$("timer").textContent = timeString(currentTime);
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