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
	let sidebar = [];
	
	// ultimate starting loading function
	window.addEventListener("load", function() {
		
		$("next").onclick = next;
		
		// AJAX setup
		if (cookieExists("timer")) { timer.load(loadCookie("timer")); }
		else { ajaxGET("save/timer.json", timer.load); }
		if (cookieExists("bank")) { bank.load(loadCookie("bank")); }
		else { ajaxGET("save/bank.json", bank.load); }
		ajaxGET("resources/order.json", loadOrder);
		if (cookieExists("current")) { loadCurrent(JSON.stringify(loadCookie("current"))); }
		else { ajaxGET("save/current.json", loadCurrent); }
		ajaxGET("resources/index.json", loadResources);
		
		// adds more event listeners (for saving, keys, etc)
		window.addEventListener("keydown", pressKey);
		window.addEventListener("beforeunload", save);
		window.addEventListener("blur", save);
	});
	
	// loads the gameplay order, succession of countries
	function loadOrder(json) {
		order = JSON.parse(json);
		if (current && resources) generateStructure();
	}
	// loads default game state behavior (which may be overwritten by save)
	function loadCurrent(json) {
		current = JSON.parse(json);
		if (order && resources) generateStructure();
	}
	// loads paths and values of various static graphic resources
	function loadResources(json) {
		resources = JSON.parse(json);
		if (order && current) generateStructure();
	}
	// saves game state, in various JSON files, into the cookies
	function save() {
		saveCookie("current", current);
		saveCookie("bank", bank.save());
		saveCookie("timer", timer.save());
	}
	
	// generates HTML structure! code is hella ugly tho
	function generateStructure() {
		let table = $("sidebar").contentDocument.querySelector("table");
		for (let i = 0; i < order.length; i++) {
			let country = order[i];
				let row = ce("tr");
				row.id = country;
				row.onclick = select;
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
			sidebar[country] = row;
		}
		// starts game as first country in line
		table.children[0].click();
		start();
	}
	
	// update info due to a new country being selected
	function select() {
		this.className = "selected";
		let id = this.id;
		let body = qs("body");
		body.style.setProperty("--current-color", resources.color[id]);
		for (let i = 0; i < this.parentElement.childElementCount; i++) {
			let node = this.parentElement.children[i];
			if (node !== this) {
				node.classList.remove("selected");
			}
		}
		current = id;
		start();
	}
	// starts/resumes/"play"s the game (starts timer, starts music)
	function play() {
		anthemPlayer.play();
		timer.play();
	}
	// pauses the game (stops timer, stops music, etc)
	function pause() {
		anthemPlayer.pause();
		timer.pause();
	}
	
	// loads the current country's name, flag, and anthem
	function start() {
		
		anthemPlayer.setFile(resources.anthem[current]);
		anthemPlayer.start();
		timer.setCountry(current);
		timer.reset();
		
		updateBank();
		//updateTimer();
		
		//if (timerDisplay) clearInterval(timerDisplay);
		//timerDisplay = setInterval(updateTimer, 1000);
		
	}
	// displays the current time to the screen
	function updateTimer() {
		$("currentTime").textContent = timer.displayString(timer.current());
		$("overallTime").textContent = timer.displayString(timer.overall());
	}
	// displays the current balances to the screen
	function updateBank() {
		let sidebar = $("sidebar").contentDocument;
		for (let i = 0; i < order.length; i++) {
			let country = order[i];
			let balanceDOM = sidebar.querySelector("#" + country + " .balance");
			let incomeDOM = sidebar.querySelector("#" + country + " .income");
			balanceDOM.textContent = bank.balance(country);
			incomeDOM.textContent = bank.income(country);
		}
		$("balance").textContent = bank.balance(current);
		$("income").textContent = bank.income(current);
	}
	
	// goes to the next country's turn
	function next() {
		current = order[wrap(order.indexOf(current) + 1, 0, order.length - 1)];
		sidebar[current].click();
 	}
	// goes to the last country's turn
	function last() {
		current = order[wrap(order.indexOf(current) - 1, 0, order.length - 1)];
		sidebar[current].click();
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
		if (key === 32) { // spacebar -> next country
			$("next").click();
		}
	}
	
})();