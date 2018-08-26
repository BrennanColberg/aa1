const MEASURED_TIME_INTERVAL = 1000;

function Timer() {
	
	let overall = undefined;
	let current = 0;
	let country = undefined;
	let ticker = undefined;
	let cDOM = undefined, oDOM = undefined;
	
	// saving/loading data
	this.load = function(json) {
		overall = JSON.parse(json);
	}
	this.save = function() {
		return JSON.stringify(overall);
	}
	
	// moving to new country
	this.setCountry = function(currentCountry) {
		country = currentCountry;
	}
	// resetting timer (generally, when moving to new country)
	this.reset = function() {
		current = 0;
		// toggles so that there's a full interval before next count
		this.play();
	}
	
	// timer counting & controls to manage toggling
	this.play = function() {
		if (ticker) this.pause();
		ticker = setInterval(this.update, MEASURED_TIME_INTERVAL);
	}
	this.pause = function() {
		clearInterval(ticker);
	}
	this.update = function() {
		current += MEASURED_TIME_INTERVAL;
		overall[country] += MEASURED_TIME_INTERVAL;
	}
	
	// takes in DOM objects and puts the current and total time into them
	this.display = function(currentDOM, overallDOM) {
		currentDOM.textContent = this.toString(current);
		overallDOM.textContent = this.toString(overall[country]);
	}
	// turns an int millisecond measurement into a 00:00:00 clock string
	this.toString = function(time) {
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
	
}