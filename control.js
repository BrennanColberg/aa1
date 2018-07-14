"use strict";
(function() {
	
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
	
	let title = undefined;
	let timer = undefined;
	let flag = undefined;
	let index = 0;
	let count = 5;
	let anthem = undefined;
	let elapsedTime = [];
	
	window.addEventListener("load", function() {
		title = document.getElementById("title");
		timer = document.getElementById("timer");
		flag = document.getElementsByTagName("img")[0];
		let nextButton = document.getElementById("next");
		
		title.style.display = "none";
		timer.style.display = "none";
		flag.style.display = "none";
		nextButton.textContent = "Start";
		nextButton.onclick = loadFirst;
	});
	
	function loadFirst() {
		load();
		title.style.display = "";
		timer.style.display = "";
		flag.style.display = "";
		this.textContent = "Next";
		this.onclick = loadNext;
		setInterval(calcTime, MEASURED_TIME_INTERVAL);
	}
	
	function load() {
		title.textContent = country_name[index];
		flag.src = country_flag[index];
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
	
	function calcTime() {
		if (!elapsedTime[index]) elapsedTime[index] = 0;
		elapsedTime[index] += MEASURED_TIME_INTERVAL;
		timer.textContent = timeString(elapsedTime[index]);
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