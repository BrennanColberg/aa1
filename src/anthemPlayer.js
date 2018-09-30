// This JavaScript file serves to manage the game's audio (playing national
// anthems) in a modular object-oriented fashion. It is declared as an object
// in index.js, where it is used; the code is simply separated off here.

function AnthemPlayer() {

	// currently playing anthem
	let current = undefined;
	// audio object
	window.addEventListener("load", function () {
		let audioDOM = document.getElementById("anthemPlayer");
	});

	// sets the anthem player to use a new file, which changes the anthem being
	// played!
	this.setFile = function (file) {
		current = file;
	}

	// starts playing the current country's anthem, given file name
	// additionally, there's an optional argument to specify at what point
	// in the song it should start playing
	this.start = function (file = current, time = 0.0) {
		let sourceDOM = document.getElementById("anthemSource");
		console.log(sourceDOM);
		let audioDOM = document.getElementById("anthemPlayer");
		if (file !== sourceDOM.src) {
			sourceDOM.src = file;
			//audioDOM.currentTime = (time / 1000.0) % sourceDOM.duration;
			audioDOM.load();
			audioDOM.play();
		}

	}

	// resumes the music
	this.play = function () {
		audioDOM.play();
	}

	// pauses the music
	this.pause = function () {
		audioDOM.pause();
	}

}
