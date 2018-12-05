var handlers = {

	keyMap: {},
	
	mouseMap: {},
	
	stutterStamps: {},

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
		var timedEvent = setTimeout(handlers.keyInput.bind(handlers),100);
		
		if (this.keyMap[39] || this.keyMap[68]) {game.p1ship.steer('right')};
		if (this.keyMap[37] || this.keyMap[65]) {game.p1ship.steer('left')};
		if (this.keyMap[87] || this.keyMap[38]) {game.p1ship.throttle('forward')};
		if (this.keyMap[83] || this.keyMap[40]) {game.p1ship.throttle('reverse')};
		if (this.keyMap[76] || this.keyMap[88]) {game.p1ship.moor();};
		if (this.keyMap[77]) {handlers.toggleMapPane();};
		if (this.keyMap[67]) {view.toggleCrewPane();};
		if (this.keyMap[32]) {handlers.pauseUnpause();};
		
		if (this.mouseMap.down !== undefined) {
			if (this.mouseMap.wheel !== undefined) {game.p1ship.steer(this.mouseMap.wheel)};
			if (this.mouseMap.eot !== undefined) {
				var direction;
				if (this.mouseMap.eot > game.p1ship.eot) {
					direction = 'forward';
				} else if (this.mouseMap.eot < game.p1ship.eot) {
					direction = 'reverse';
				};
				game.p1ship.throttle(direction);
			};
		};
	},
	
	toggleMapPane: function() {
		if (handlers.stutterStamps.mapPane == undefined || new Date() - handlers.stutterStamps.mapPane > 1000 ) {
			handlers.stutterStamps.mapPane = new Date();
			view.toggleMapPane();
		};
	},
	
	setCourse: function(town) {
		view.panes.course = town;
		view.displayAlert('Course laid in for '+town.name+", Cap'n!",'cyan');
		view.toggleMapPane();
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
		if (handlers.stutterStamps.pause == undefined || new Date() - handlers.stutterStamps.pause > 1000 ) {
			handlers.stutterStamps.pause = new Date();
			if (game !== undefined && game.clock !== undefined) {
				game.pauseUnpauseGame();
			};
		};
	},
	
	mouseDown: function() {
		handlers.mouseMap.down = new Date();
	},
	
	mouseUp: function() {
		handlers.mouseMap.down = undefined;
	},
	
	eotEnter: function(index) {
		var input = (4 - index) / 3 ;
		handlers.mouseMap.eot = input;
	},
	
	eotLeave: function() {
		handlers.mouseMap.eot = undefined;
	},
	
	wheelEnter: function(direction) {
		handlers.mouseMap.wheel = direction;
	},
	
	wheelLeave: function() {
		handlers.mouseMap.wheel = undefined;
	},
	
	firstRound: function() {
		if (view.panes.rumorsRevealed == false) {
			view.revealRumors();
			game.p1ship.coin -= 10;
			view.updatePurse(game);
		};
		for (var crewmate of game.p1ship.crew) {
			crewmate.drink();
		};
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
		game.p1ship.repair(view.panes.selectedComponent);
	},
	
	moveComponent: function() {
		var component = view.panes.selectedComponent;
		view.filterShipyardTargets(component.slotType);
		view.panes.moving = true;
	},
	
	paintComponent: function(color) {
		if (view.panes.selectedComponent.paintCost <= game.p1ship.coin) {
			view.filterShipyardTargets();
			game.p1ship.paintComponent(view.panes.selectedComponent,color);
			view.refreshShipyardUI();
		};
	},
	
	sellComponent: function() {
		view.filterShipyardTargets();
		var component = view.panes.selectedComponent;
		game.p1ship.sellComponent(component);
		view.panes.moving = false;
		view.panes.selectedComponent = undefined;
	},
	
	buyComponent: function(component) {
		var selectedComponentInstalled = false;
		for (var slot in game.p1ship.components) {
			if (view.panes.selectedComponent !== undefined && game.p1ship.components[slot] == view.panes.selectedComponent) {
				selectedComponentInstalled = true;
			};
		};
		if (selectedComponentInstalled == true || view.panes.selectedComponent == undefined) {
			var shipyardStock = game.p1ship.currentMap().town.amenities[2].stock
			shipyardStock.splice(shipyardStock.indexOf(component),1);
			view.refreshShipyardUI();
			view.selectComponent(component);
			view.panes.moving = true;
			view.filterShipyardTargets(component.slotType);
			game.p1ship.coin -= Math.floor(component.cost*game.p1ship.discount('shipyard'));
			view.updatePurse(game);
		} else {
			view.displayAlert('You must sell or install the '+view.panes.selectedComponent.name+' first.');
		};

	},
	
	changePosting: function(crewmate,posting) {
		game.p1ship.postCrewmate(crewmate,posting);
		view.populateCrewList();
		view.displayCrewmate(crewmate);
	},
	
	doEvent: function(event) {
		events[event.eventKey].execute(event);
	},

}


// keybindings
document.addEventListener('keydown',function(event) {
	handlers.keyMap[event.keyCode] = true;
});

document.addEventListener('keyup',function(event) {
	handlers.keyMap[event.keyCode] = false;
});
