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
	let resources = undefined;
	let anthemPlayer = new AnthemPlayer();
	let timer = new Timer();
	let bank = new Bank();
	let map = new Map();
	let timerDisplay = undefined;
	let sidebar = [];
	let unitCart = [];
	let unitCartPrice = 0;
	
	// ultimate starting loading function
	window.addEventListener("load", function() {
		
		qs("#balance button").onclick = adjustBalance;
		qs("#income button").onclick = adjustIncome;
		qs("#conquer button").onclick = conquer;
		$("checkout").onclick = checkout;
		$("next").onclick = next;
		$("reset").onclick = reset;
		
		// AJAX setup
		// timer
		if (cookieExists("timer")) { timer.load(loadCookie("timer")); }
		else { ajaxGET("save/timer.json", timer.load); }
		// bank
		if (cookieExists("bank")) { bank.load(loadCookie("bank")); }
		else { ajaxGET("save/bank.json", bank.load); }
		// territory
		if (cookieExists("territory")) { map.load(loadCookie("territory")); }
		else { ajaxGET("map/1942/territory.json", function(json) { map.load(json, "map/1942/map.json", updateTerritory); }); }
		// current
		if (cookieExists("current")) { loadCurrent(JSON.stringify(loadCookie("current"))); }
		else { ajaxGET("save/current.json", loadCurrent); }
		
		ajaxGET("resources/order.json", loadOrder);
		ajaxGET("resources/index.json", loadResources);
		ajaxGET("map/1942/units.json", loadUnits);
		
		// adds more event listeners (for saving, keys, etc)
		window.addEventListener("keydown", pressKey);
		window.addEventListener("beforeunload", save);
		window.addEventListener("blur", save);
		
	});
	
	
	/***** FILE I/O (LOADING, SAVING) *****/
	
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
	// loads units to the selling place
	function loadUnits(json) {
		let data = JSON.parse(json);
		let unitTypes = Object.keys(data);
		for (let c = 0; c < unitTypes.length; c++) {
			let id = unitTypes[c];
			let dom = ce("section");
			dom.id = id;
			$("units").appendChild(dom);
			for (let i = 0; i < data[id].length; i++) {
				let item = data[id][i];
				let p = ce("p");
				p.onclick = takeUnit;
				p.cost = item.cost;
				p.name = p.textContent = item.name;
				dom.appendChild(p);
			}
		}
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
	
	
	/***** GRAPHICAL CHANGES & UPDATING *****/
	
	// displays the current timer info to the screen
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
		qs("#balance .display").textContent = bank.balance(current);
		qs("#income .display").textContent = bank.income(current);
	}
	
	function updateTerritory() {
		fillSelect(qs("#conquer select"), map.unowned(current));
		fillSelect(qs("#lose select"), map.owned(current));
		function fillSelect(dom, array) {
			for (let i = 0; i < array.length; i++) {
				let option = ce("option");
				option.innerText = option.value = array[i];
				dom.appendChild(option);
			}
		}
	}
	
	// displays the current cart to the screen (contents and price)
	function updateCart() {
		let cart = $("cartContents");
		while (cart.firstChild) cart.removeChild(cart.firstChild);
		let price = 0;
		for (let i = 0; i < unitCart.length; i++) {
			$("cartContents").appendChild(unitCart[i]);
			price += unitCart[i].cost;
		}
		$("cartPrice").textContent = unitCartPrice = price;
	}
	
	/***** GAME FLOW (COUNTRY PROGRESSION) *****/
	
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
	// loads the current country's name, flag, and anthem
	function start() {
		// anthem
		anthemPlayer.setFile(resources.anthem[current]);
		anthemPlayer.start();
		// timer
		timer.setCountry(current);
		timer.reset();
		updateTimer();
		if (timerDisplay) clearInterval(timerDisplay);
		timerDisplay = setInterval(updateTimer, 1000);
		// bank
		updateBank();
		// territory
		updateTerritory();
		// units
		unitCart = [];
		updateCart();
	}


  /***** BUTTON I/O (BANKING, ETC) ****/
	
	// called by the "adjust" button in bank > balance ... tweaks the current
	// country's balance by the amount in the input, then clears it
	// (or, if called in code, just adjusts balance by argument)
	function adjustBalance(amount) {
		if (typeof amount !== "number") {
			let input =  this.parentElement.querySelector("input");
			amount = input.value;
			input.value = "";
		}
		bank.adjustBalance(current, amount);
		updateBank();
	}
	
	// called by the "adjust" button in bank > income ... tweaks the current
	// country's income by the amount in the input, then clears it
	// (or, if called in code, just adjusts income by argument)
	function adjustIncome(amount) {
		if (typeof amount !== "number") {
			let input =  this.parentElement.querySelector("input");
			amount = input.value;
			input.value = "";
		}
		bank.adjustIncome(current, amount);
		updateBank();
	}
	
	function conquer() {
		console.log(map.unowned(current));
	}
	
	// called by a unit in the selection menu when clicked; adds a copy of it
	// to the cart
	function takeUnit() {
		if (this.cost + unitCartPrice <= bank.balance(current)) {
			let unit = this.cloneNode(true);
			unit.onclick = returnUnit;
			unit.cost = this.cost;
			unit.name = this.name;
			unitCart.push(unit);
			updateCart();
		}
	}
	
	// called by a unit in the cart when clicked; removes it from the cart
	function returnUnit() {
		unitCart.splice(unitCart.indexOf(this), 1);
		updateCart();
	}
	
	// purchases every unit currently in the cart
	function checkout() {
		for (let i = unitCart.length - 1; i >= 0; i--) {
			let unit = unitCart[i];
			if (unit.cost <= bank.balance(current)) {
				adjustBalance(-unit.cost);
				unitCart.splice(i, 1);
			}
		}
		updateCart();
	}
	
	// goes to the next country's turn
	function next() {
		// standard method for wrapping numbers (confines to boundaries
		// but then adds excess in a periodic fashion)
		function wrap(num, min, max) {
			let r = max - min + 1;
			while(num > max) num -= r;
			while(num < min) num += r;
			return num;
		}
		bank.collectIncome(current);
		current = order[wrap(order.indexOf(current) + 1, 0, order.length - 1)];
		sidebar[current].click();
 	}
	
	// resets all data to the default state
	function reset() {
		if (window.confirm("Are you sure? This will delete the current game.")) {
			current = order[0];
			$("sidebar").contentDocument.getElementById(current).click();
			ajaxGET("save/timer.json", function(json) {
				timer.load(json);
				updateTimer();
			});
			ajaxGET("save/bank.json", function(json) {
				bank.load(json);
				updateBank();
			});
		}
	}
	
	
	/***** KEYBOARD SHORTCUTS *****/
	
	// tracks key presses and lets them do things
	function pressKey(event) {
		let key = event.keyCode;
		if (key === 32) { // spacebar -> next country
			$("next").click();
		}
	}
	
})();