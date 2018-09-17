// This JavaScript file functions to keep track of the balances of each nation,
// allowing additions and deposits and giving information about balances, etc
// (if it has to do with money, it's here)

function Bank() {
	
	let balanceData = {};
	let incomeData = {};
	
	// loads bank data from a JSON data object
	this.load = function(json) {
		let data = JSON.parse(json);
		balanceData = data["balance"];
		incomeData = data["income"];
	}
	
	// loads current data into a JSON data object
	this.save = function() {
		return JSON.stringify({
			"balance": balanceData,
			"income": incomeData
		});
	}
	
	// gets or sets the given country's balance
	this.balance = function(country, amount) {
		if (amount !== undefined) {
			balanceData[country] = amount < 0 ? 0 : amount;
		} else {
			return balanceData[country];
		}
	}
	
	// gets or sets the given country's income
	this.income = function(country, amount) {
		if (amount !== undefined) {
			incomeData[country] = amount < 0 ? 0 : amount;
		} else {
			return incomeData[country];
		}
	}
	
	// adds money to the given country's balance
	this.deposit = function(country, amount) {
		this.balance(country, this.balance(country) + Number(amount));
	}
	
	// subtracts money from the given country's balance
	this.withdraw = function(country, amount) {
		this.balance(country, this.balance(country) - Number(amount));
	}
	
	this.collectIncome = function(country) {
		this.deposit(country, this.income(country));
	}
	
}