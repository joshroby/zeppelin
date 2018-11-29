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
		
		document.getElementById('newGameButton').blur();
	},
	
	keyInput: function() {
		if (this.keyMap[39] || this.keyMap[68]) {game.p1ship.steer('right')};
		if (this.keyMap[37] || this.keyMap[65]) {game.p1ship.steer('left')};
		if (this.keyMap[87] || this.keyMap[38]) {game.p1ship.throttle('forward')};
		if (this.keyMap[83] || this.keyMap[40]) {game.p1ship.throttle('reverse')};
		if (this.keyMap[73]) {view.toggleInventoryPane();};
		if (this.keyMap[76]) {game.p1ship.moor();};
		if (this.keyMap[77]) {view.toggleMapPane();};
		if (this.keyMap[79]) {view.toggleOutfittingPane();};
		if (this.keyMap[80]) {view.togglePersonnelPane();};
		if (this.keyMap[32]) {handlers.pauseUnpause();};
		var timedEvent = setTimeout(handlers.keyInput.bind(handlers),100);
	},

	soundtrackPlayPause: function() {
		if (game.soundtrack.paused) {
			game.soundtrack.play();
		} else {
			game.soundtrack.pause();
		};
		view.toggleSoundPlayPause();
	},
	
	soundtrackSkip: function() {
		if (game.soundtrack.paused) {
			game.soundtrack.play();
			view.toggleSoundPlayPause();
		};
		game.soundtrack.skip();
	},
	
	soundtrackVolumeUp: function() {
		game.soundtrack.setVolume(game.soundtrack.volume + 0.1);
	},
	
	soundtrackVolumeDown: function() {
		game.soundtrack.setVolume(game.soundtrack.volume - 0.1);
	},
	
	soundtrackMute: function() {
		game.soundtrack.setVolume(0);
	},
	
	pauseUnpause: function() {
		if (game !== undefined && game.clock !== undefined) {
			game.pauseUnpauseGame();
		};
	},
	
	firstRound: function() {
		document.getElementById('rumorCoverRollup').beginElement()
		game.p1ship.coin -= 10;
		view.updatePurse(game);
	},
	
	recruitBuyDrink: function() {
	},
	
	recruit: function() {
	},
	
	buyCommodity: function(commodityKey) {
		game.p1ship.buyCommodity(commodityKey);
	},
	
	sellCommodity: function(commodityKey) {
		game.p1ship.sellCommodity(commodityKey);
	},
	
	reprovision: function() {
		game.p1ship.reprovision();
	},
	
	refuel: function(cost) {
		game.p1ship.refuel();
	},
	
	recharge: function(cost) {
		game.p1ship.recharge();
	},
	
	slotHover: function(slotKey) {
		if (game.p1ship.components[slotKey] && game.p1ship.components[slotKey] !== view.panes.selectedComponent) {
			view.displayComponent(game.p1ship.components[slotKey],67,-30);
		};
	},
	
	slotClick: function(slotKey) {
		var newSelected, retarget;
		if (view.panes.moving) {
			var component = view.panes.selectedComponent;
			if (game.p1ship.components[slotKey]) {
				newSelected = game.p1ship.components[slotKey];
			} else {
				view.panes.moving = false;
				view.panes.selectedComponent = undefined;
				view.filterShipyardTargets();
				view.selectComponent();
				view.coverShipyardButtons();
			};
			game.p1ship.install(component,slotKey);
			view.buildShipDef(game.p1ship);
			retarget = true;
		} else if (game.p1ship.components[slotKey]) {
			newSelected = game.p1ship.components[slotKey];
		};
		view.clearComponentDisplay();
		view.selectComponent(newSelected);
		if (retarget && newSelected !== undefined) {
			view.filterShipyardTargets(newSelected.slotType);
		};
	},
	
	repairComponent: function() {
		view.filterShipyardTargets();
		view.displayAlert("This component is already at 100% condition.");
	},
	
	moveComponent: function() {
		var component = view.panes.selectedComponent;
		view.filterShipyardTargets(component.slotType);
		view.panes.moving = true;
	},
	
	paintComponent: function() {
		view.filterShipyardTargets();
		view.displayAlert("Coming soon to a browser game near you!.");
	},
	
	sellComponent: function() {
		view.filterShipyardTargets();
		var component = view.panes.selectedComponent;
		game.p1ship.sellComponent(component);
		view.panes.moving = false;
	},
	
	buyComponent: function(component) {
		var selectedComponentInstalled = false;
		for (var slot in game.p1ship.components) {
			if (view.panes.selectedComponent !== undefined && game.p1ship.components[slot] == view.panes.selectedComponent) {
				selectedComponentInstalled = true;
				console.log(slot);
			};
		};
		if (selectedComponentInstalled == true || view.panes.selectedComponent == undefined) {
			var shipyardStock = game.p1ship.currentMap().town.amenities[2].stock
			shipyardStock.splice(shipyardStock.indexOf(component),1);
			view.refreshShipyardUI();
			view.selectComponent(component);
			view.panes.moving = true;
			view.filterShipyardTargets(component.slotType);
			game.p1ship.coin -= component.cost;
			view.updatePurse(game);
		} else {
			view.displayAlert('You must sell or install the '+view.panes.selectedComponent.name+' first.');
		};

	},

}


// keybindings
document.addEventListener('keydown',function(event) {
	handlers.keyMap[event.keyCode] = true;
});

document.addEventListener('keyup',function(event) {
	handlers.keyMap[event.keyCode] = false;
});
