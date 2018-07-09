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
		"/flags/ussr.png",
		"/flags/germany.png",
		"/flags/britain.png",
		"/flags/japan.png",
		"/flags/usa.png"
	];
	
	const country_anthem = [
		new Audio("/anthems/"),
		new Audio("/anthems/"),
		new Audio("/anthems/"),
		new Audio("/anthems/"),
		new Audio("/anthems/")
	];
	
	let title = undefined;
	let timer = undefined;
	let flag = undefined;
	let index = 0;
	let count = 5;
	
	window.addEventListener("load", function() {
		title = document.getElementById("title");
		timer = document.getElementById("timer");
		flag = document.getElementsByTagName("img")[0];
		let nextButton = document.getElementById("next");
		
		nextButton.onclick = loadNext;
		
		for (let i = 0; i < country_anthem.length; i++) {
			country_anthem[i].loop = true;
		}
		load();
	});
	
	function load() {
		title.innerHTML = country_name[index];
		flag.src = country_flag[index];
		for (let i = 0; i < country_anthem.length; i++) {
			country_anthem[i].stop();
		}
		country_anthem[index].play();
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