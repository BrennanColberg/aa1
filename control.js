"use strict";
(function() {
	
	// simple function abbreviations that shorten my code nicely
	function $(id) { return document.getElementById(id); }
	function qs(s) { return document.querySelector(s); }
	function ce(tag) { return document.createElement(tag); }
	function hide(dom) { dom.classList.add("hidden"); }
	function show(dom) { dom.classList.remove("hidden"); }
	
	// declaring module-global variables
	let current = undefined;
	let order = undefined;
	let defaultState = undefined;
	let resources = undefined;
	let anthemPlayer = new AnthemPlayer();
	let timer = new Timer();
	let bank = new Bank();
	let timerDisplay = undefined;
	
	// ultimate starting loading function
	window.addEventListener("load", function() {
		
		// AJAX setup
		ajaxGET("save/timer.json", timer.load);
		ajaxGET("save/bank.json", bank.load);
		ajaxGET("resources/order.json", loadOrder);
		ajaxGET("default.json", loadDefault);
		ajaxGET("resources/index.json", loadResources);
		
		// loads JS to buttons
		$("control").onclick = start;
		$("resume").onclick = function() { 
			if (cookieExists("timer")) { timer.load(loadCookie("timer")); }
			if (cookieExists("current")) { current = loadCookie("current"); }
			start();
		}
		$("next").onclick = next;
		$("back").onclick = back;
		
		// adds more event listeners (for saving, keys, etc)
		document.addEventListener("keydown", pressKey);
		window.addEventListener("beforeunload", save);
		window.addEventListener("blur", save);
		
	});
	
	// loads the gameplay order, succession of countries
	function loadOrder(json) {
		order = JSON.parse(json);
		if (resources) generateStructure();
	}
	// loads default game state behavior (which may be overwritten by save)
	function loadDefault(json) {
		defaultState = JSON.parse(json);
		current = defaultState.current;
	}
	// loads paths and values of various static graphic resources
	function loadResources(json) {
		resources = JSON.parse(json);
		if (order) generateStructure();
	}
	// saves game state, in various JSON files, into the cookies
	function save() {
		saveCookie("current", current);
		saveCookie("timer", timer.save());
	}
	
	// generates HTML structure!
	function generateStructure() {
		let table = qs("table");
		for (let i = 0; i < order.length; i++) {
			let country = order[i];
				let row = ce("tr");
				row.id = country;
				let left = ce("td");
					left.className = "left";
					left.style.backgroundColor = resources.color[country];
					let flag = ce("img");
						flag.style.borderColor = resources.color[country];
						flag.src = resources.flag[country];
						flag.alt = country;
						flag.className = "flag";
					left.appendChild(flag);
					let title = ce("h1");
						title.textContent = resources.name[country];
						title.className = "title";
					left.appendChild(title);
				row.appendChild(left);
				let right = ce("td");
					right.style.borderColor = resources.color[country];
					right.style.color = resources.color[country];
					right.className = "right";
					let balance = ce("h2");
						balance.textContent = "Balance: ";
						let balanceSpan = ce("span");
							balanceSpan.className = "balance";
						balance.appendChild(balanceSpan);
					right.appendChild(balance);
					let income = ce("h2");
						income.textContent = "Income: ";
						let incomeSpan = ce("span");
							incomeSpan.className = "income";
						income.appendChild(incomeSpan);
					right.appendChild(income);
				row.appendChild(right);
			table.appendChild(row);
		}
		updateBank();
	}
	
	// starts the game
	function start() {
		hide($("resume")); // no need to "resume" anymore
		updateCountry();
		// TODO fix this sloppiness; pass DOM
		// I do this weirdly because play references "this"
		// and so it needs to be called by a click not a direct
		// method invocation
		$("control").onclick = play;
		$("control").click();
		
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
	
	// loads the current country's name, flag, and anthem
	function updateCountry() {
		
		$("title").textContent = resources.name[current];
		$("flag").src = resources.flag[current];
		
		anthemPlayer.setFile(resources.anthem[current]);
		anthemPlayer.start();
		timer.setCountry(current);
		timer.reset();
		
		updateTimer();
		if (timerDisplay) clearInterval(timerDisplay);
		timerDisplay = setInterval(updateTimer, 1000);
		
	}
	// displays the current time to the screen
	function updateTimer() {
		timer.display($("currentTime"), $("totalTime"));
	}
	// displays the current balances to the screen
	function updateBank() {
		for (let i = 0; i < order.length; i++) {
			let country = order[i];
			let balanceDOM = qs("#" + country + " .balance");
			let incomeDOM = qs("#" + country + " .income");
			bank.display(balanceDOM, incomeDOM, country);
		}
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
	
})();