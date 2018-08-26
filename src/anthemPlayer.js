function Anthem() {
	
	let dom = document.createElement("audio");
	dom.loop = true;
	
	// starts playing the current country's anthem, given file name
	this.start = function(file) {
		dom.src = file;
		dom.currentTime = 0.0;
		// Restart-on-play from data not working (code is from old version):
		// anthem.currentTime = (data.current.time / 1000.0) % anthem.duration
    	dom.play();
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