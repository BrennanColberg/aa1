"use strict";
(function() {
	
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
	
	window.addEventListener("load", function() {
		title = document.getElementById("title");
		timer = document.getElementById("timer");
		flag = document.getElementsByTagName("img")[0];
		let nextButton = document.getElementById("next");
		
		title.style.display = "none";
//		timer.style.display = "none";
		flag.style.display = "none";
		nextButton.textContent = "Start";
		nextButton.onclick = loadFirst;
	});
	
	function loadFirst() {
		load();
		title.style.display = "";
//		timer.style.display = "";
		flag.style.display = "";
		this.textContent = "Next";
		this.onclick = loadNext;
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
	
})();