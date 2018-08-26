function Timer() {
	
	// currently running time
	this.time = 0;
	
	this.reset = function() {
		this.time = 0;
	}
	
	this.update = function(interval) {
		this.time += interval;
	}
	
	// takes in DOM objects and puts the current and total time into them
	this.display = function(current, total) {
		current.textContent = this.toString(this.time);
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