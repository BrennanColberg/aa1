function AnthemPlayer() {
	
	let current = undefined;
	let dom = document.createElement("audio");
	dom.loop = true;
	
	this.setFile = function(file) {
		current = file;
	}
	
	// starts playing the current country's anthem, given file name
	this.start = function(file = current, time = 0.0) {
		if (file !== dom.src) {
			dom.src = file;
			dom.onloadedmetadata = function() {
				console.log(dom.duration);
				dom.currentTime = (time / 1000.0) % dom.duration;
				dom.play();
			}
		}
	}
	
	// resumes the music
	this.play = function() {
		dom.play();
	}
	
	// pauses the music
	this.pause = function() {
		dom.pause();
	}
	
}