// This JavaScript file serves to manage the game's audio (playing national
// anthems) in a modular object-oriented fashion. It is declared as an object
// in index.js, where it is used; the code is simply separated off here.

function AnthemPlayer() {
	
	// currently playing anthem
	let current = undefined;
	// audio object
	let dom = document.createElement("audio");
		dom.loop = true;
	
	// sets the anthem player to use a new file, which changes the anthem being
	// played!
	this.setFile = function(file) {
		current = file;
	}
	
	// starts playing the current country's anthem, given file name
	// additionally, there's an optional argument to specify at what point
	// in the song it should start playing
	this.start = function(file = current, time = 0.0) {
		if (file !== dom.src) {
			dom.src = file;
			dom.onloadedmetadata = function() {
				console.log(dom.duration);
				dom.currentTime = (time / 1000.0) % dom.duration;
				dom.play(); // gets blocked by Safari as an auto-player
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