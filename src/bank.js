function Bank() {
	
	let balance = {};
	let income = {};
	let current = undefined;
	
	this.load = function(json) {
		let data = JSON.parse(json);
		balance = data["balance"];
		income = data["income"];
	}
	this.save = function() {
		return JSON.stringify({
			"balance": balance,
			"income": income
		});
	}
	
	this.setCountry = function(country) {
		current = country;
	}
	
	this.clear = function(country = current) {
		balance[country] = 0;
	}
	this.balance = function(country = current) {
		return balance[country];
	}
	this.deposit = function(amount, country = current) {
		if (!balance[country]) this.clear(country);
		balance[country] += amount;
	}
	this.withdraw = function(amount, country = current) {
		if (!balance[country]) this.clear(country);
		balance[country] -= amount;
	}
	
	this.display = function(balanceDOM, incomeDOM, country = current) {
		balanceDOM.textContent = balance[country];
		incomeDOM.textContent = income[country];
	}
	
}