const MEASURED_TIME_INTERVAL = 1000;

function Timer() {
	
	// current: [double]
	// overall: { country: [double], ... }
	let time = undefined;
	let country = undefined;
	let ticker = undefined;
	
	// saving/loading data
	this.load = function(json) {
		time = JSON.parse(json);
	}
	this.save = function() {
		return JSON.stringify(time);
	}
	
	// moving to new country
	this.setCountry = function(currentCountry) {
		country = currentCountry;
		console.log(country);
	}
	// resetting timer (generally, when moving to new country)
	this.reset = function() {
		time.current = 0;
		// toggles so that there's a full interval before next count
		this.pause();
		this.play();
	}
	
	// timer counting & controls to manage toggling
	this.play = function() {
		ticker = setInterval(this.update, MEASURED_TIME_INTERVAL);
	}
	this.pause = function() {
		clearInterval(ticker);
	}
	this.update = function() {
		time.current += MEASURED_TIME_INTERVAL;
		time.overall[country] += MEASURED_TIME_INTERVAL;
	}
	
	// takes in DOM objects and puts the current and total time into them
	this.display = function(current, overall) {
		current.textContent = this.toString(time.current);
		overall.textContent = this.toString(time.overall[country]);
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