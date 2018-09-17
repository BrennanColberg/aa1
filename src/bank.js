// This JavaScript file functions to keep track of the balances of each nation,
// allowing additions and deposits and giving information about balances, etc
// (if it has to do with money, it's here)

function Bank() {
	
	let balance = {};
	let income = {};
	let current = undefined;
	
	// loads bank data from a JSON data object
	this.load = function(json) {
		let data = JSON.parse(json);
		balance = data["balance"];
		income = data["income"];
	}
	// loads current data into a JSON data object
	this.save = function() {
		return JSON.stringify({
			"balance": balance,
			"income": income
		});
	}
	
	// sets the current country's turn
	this.setCountry = function(country) {
		current = country;
	}
	
	// clears the [current / given] country's balance
	this.clear = function(country = current) {
		balance[country] = 0;
	}
	// returns the [current / given] country's balance
	this.balance = function(country = current) {
		return balance[country];
	}
	// returns the [current / given] country's income
	this.income = function(country = current) {
		return income[country];
	}
	// adds money to the [current / given] country's balance
	this.deposit = function(amount, country = current) {
		if (!balance[country]) this.clear(country);
		balance[country] += Number(amount);
		if (balance[country] < 0) balance[country] = 0;
	}
	// subtracts money from the [current / given] country's balance
	this.withdraw = function(amount, country = current) {
		if (!balance[country]) this.clear(country);
		balance[country] -= Number(amount);
		if (balance[country] < 0) balance[country] = 0;
	}
	
}