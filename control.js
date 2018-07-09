"use strict";
(function() {
	
	const country_name = [
		"U.S.S.R.",
		"Germany",
		"Britain",
		"Japan",
		"U.S.A."
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
	
	const country_anthem = [
		"anthems/ussr.mp3",
		"anthems/germany.mp3",
		"anthems/britain.mp3",
		"anthems/japan.mp3",
		"anthems/usa.mp3"
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
		
		nextButton.onclick = loadNext;
		
		load();
	});
	
	function load() {
		title.innerHTML = country_name[index];
		flag.src = country_flag[index];
		if (anthem != undefined) anthem.pause();
		anthem = new Audio(country_anthem[index]);
		anthem.loop = true;
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