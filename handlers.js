var handlers = {

	keyMap: {},

	newGame: function() {
	
		// Load Body Contents
		var pageContents = view.gameDivContents();
// 		document.body.innerHTML = '';
		document.getElementById('gameDiv').innerHTML = '';
		for (var element of pageContents) {
			document.getElementById('gameDiv').appendChild(element);
		};
		
		// Clear Old Game's Ticks
		if (game !== undefined) {
			for (var i in game.ticks) {
				clearTimeout(game.ticks[i]);
			};
		};
		
		// New Game
		game = new Game();
		game.tick();
		handlers.keyInput();
	},
	
	keyInput: function() {
		if (this.keyMap[39] || this.keyMap[68]) {game.p1ship.steer('right')};
		if (this.keyMap[37] || this.keyMap[65]) {game.p1ship.steer('left')};
		if (this.keyMap[87] || this.keyMap[38]) {game.p1ship.throttle('forward')};
		if (this.keyMap[83] || this.keyMap[40]) {game.p1ship.throttle('reverse')};
		var timedEvent = setTimeout(handlers.keyInput.bind(handlers),100);
	},

}


// keybindings
document.addEventListener('keydown',function(event) {
	handlers.keyMap[event.keyCode] = true;
});

document.addEventListener('keyup',function(event) {
	handlers.keyMap[event.keyCode] = false;
});
