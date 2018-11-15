var game;
function Game() {

	this.clock = new Clock();
	this.clock.tick = 100;
	this.clock.start();
	this.clock.logEventIn(1,'tick');
	this.clock.logEventIn(100,'windChange');
	
	this.maps = [];
	this.maps.push(new SectionMap(0,0,this));
	this.maps.push(new SectionMap(-1,0,this));
	this.maps.push(new SectionMap(0.5,-1,this));
	this.maps.push(new SectionMap(0.5,1,this));
	this.maps.push(new SectionMap(-0.5,-1,this));
	this.maps.push(new SectionMap(1,0,this));
	this.maps.push(new SectionMap(-0.5,1,this));
	view.initMap(this.maps);
	
	this.p1ship = new Ship('p1');
	this.maps[0].ships.push(this.p1ship);
	this.p1ship.rudder = 1.2;
	this.p1ship.velocity.speed = 1;
	view.addShip(this.p1ship);
	view.initUI(this.p1ship);
	
	for (var map of this.maps) {
		view.updatePlayerMap(map);
	};
	
	this.mapsInPlay = function() {
		var focalMap = game.p1ship.currentMap();
		var mapsInPlay = [focalMap];
		for (var map of game.maps) {
			if (focalMap.neighbors.indexOf(map.id) !== -1) {
				mapsInPlay.push(map);
			};
		};
		return mapsInPlay;
	};
	
	this.tick = function() {
		var mapsInPlay = this.mapsInPlay();
		for (map of mapsInPlay) {
			for (var ship of map.ships) {
				ship.tick();
			};
		};
		view.recenterMap();
	};
	
	this.windChange = function() {
		console.log('the wind changes');
		var speedChange = Math.random() - 0.5;
		var directionChange = (Math.random() - 0.5) * Math.PI / 2;
		var mapsInPlay = this.mapsInPlay();
		for (var map of mapsInPlay) {
			map.wind.speed += speedChange;
			map.wind.direction += directionChange;
			if (map.wind.direction > Math.PI * 2) {
				map.wind.direction -= Math.PI * 2;
			} else if (map.wind.direction < 0) {
				map.wind.direction += Math.PI * 2;
			};
		};
		
	};
}

function SectionMap(x,y,game) {
	
	this.id = 'sectionMap_'+x+'_'+y;
	this.hexGridX = x;
	this.hexGridY = y;
	
	this.x = x * 350;
	this.y = y * 300;
	
	this.neighbors = [];
	this.neighbors.push('sectionMap_'+(x-1)+'_'+(y));
	this.neighbors.push('sectionMap_'+(x+1)+'_'+(y));
	this.neighbors.push('sectionMap_'+(x-0.5)+'_'+(y-1));
	this.neighbors.push('sectionMap_'+(x+0.5)+'_'+(y-1));
	this.neighbors.push('sectionMap_'+(x-0.5)+'_'+(y+1));
	this.neighbors.push('sectionMap_'+(x+0.5)+'_'+(y+1));
	
	var definedNeighbors = [];
	for (var mapID of this.neighbors) {
		for (var map of game.maps) {
			if (map.id == mapID) {
				definedNeighbors.push(map);
			};
		};
	};
	
	var biomes = ['green','saddlebrown','gold','gainsboro'];
	if (x !== 0 && y!== 0) {
		biomes.push('blue');
	};
	for (var neighbor of definedNeighbors) {
		biomes.push(neighbor.backgroundColor);
		biomes.push(neighbor.backgroundColor);
		biomes.push(neighbor.backgroundColor);
	};
	this.backgroundColor = biomes[Math.random() * biomes.length << 0];
	
	this.wind = {
		direction: Math.random() * Math.PI * 2,
		speed: Math.random(),
	};

	this.landmarks = [];
	var glyphs = ['weeds','hill'];
	if (this.backgroundColor == 'blue') {
		glyphs = ['nolandmark','sandbar'];
	};
	for (var i=0;i<50;i++) {
		var angle = Math.random() * Math.PI * 2;
		var dist = Math.random() * 198;
		var newLandmark = {
			x:this.x + Math.cos(angle) * dist,
			y:this.y + Math.sin(angle) * dist,
			rotation: 0,
			glyph: glyphs[Math.random() * glyphs.length << 0],
			fill: ['yellow','green','saddlebrown','gold'][Math.random() * 4 << 0]
		};
		this.landmarks.push(newLandmark);
	};
	
	this.ships = [];
	
	this.populateClouds = function() {
		if (this.ships.length < 20) {
			for (var i = 0;i<5;i++) {
				var angle = Math.random() * Math.PI * 2;
				var dist = Math.random() * 198;
				for (var n = 0;i<3;i++) {
					var cloud = new Ship('cloud');
					cloud.x = this.x + Math.cos(angle) * dist + 3 * (Math.random() - 0.5),
					cloud.y = this.y + Math.sin(angle) * dist + 3 * (Math.random() - 0.5),
					this.ships.push(cloud);
					view.addShip(cloud);
				};
			};
		};
	};
}

function Ship(id,tier) {
	if (id == 'cloud') {
		id = 'cloud_'+Math.random().toString(36).slice(2);
		this.sprite = 'cloud';
		this.dissipates = true;
		this.opacity = 0.5;
	} else if (id == undefined) {
		id = Math.random().toString(36).slice(2);
	};
	if (tier == undefined) {tier = 1};
	
	this.id = id;
	
	this.x = 0;
	this.y = 0;
	this.heading = Math.random() * 2 * Math.PI;
	this.eot = 0;
	this.rudder = 0;
	this.velocity = {
		direction: this.heading,
		speed: 0,
	};
	
	if (id.indexOf('cloud') == -1) {
	
		this.sprite = 'defaultShip';
	
		this.crew = [];
		for (var i=0;i<3;i++) {
			this.crew.push(new Crewmate());
		};
	
		this.components = {};
		this.components.engine = new Component('engine',tier);
		this.components.propeller = new Component('propeller',tier);
		this.components.armor = new Component('armor',tier);
		this.components.cargo = new Component('cargoBay',tier);
		
	};
	
	this.getThrust = function() {return this.getStat('thrust')};
	this.getTurn = function() {return this.getStat('turn')};
	this.getTopSpeed = function() {return 5};
	
	this.getStat = function(statName) {
		return 1;
	};
	
	this.throttle = function(direction) {
		var eot = this.eot * 30;
		if (direction == 'forward') {
			eot++;
		} else if (direction == 'reverse') {
			eot--;
		};
		eot = Math.floor(Math.min(Math.max(eot,-30),40))/30;
		this.eot = eot;
		view.updateEOT();
	};
	
	this.steer = function(direction) {
		var rudder = this.rudder * 30;
		if (direction == 'left') {
			rudder -= 1;
		} else if (direction == 'right') {
			rudder += 1;
		};
		rudder = Math.round(rudder)/30;
		rudder = Math.min(Math.max(rudder,-1.2),1.2);
		this.rudder = rudder;
		view.updateWheel();
	};
	
	this.stressDamage = function() {
	};
	
	this.destroy = function() {
		var currentMap = this.currentMap();
		var index = currentMap.ships.indexOf(this);
		if (index !== -1) {
			currentMap.ships.splice(index,1);
		};
	};
	
	this.tick = function() {
		this.heading += this.getTurn() * this.rudder * 0.2;
		if (this.heading >= Math.PI * 2) {
			this.heading -= Math.PI * 2;
		} else if (this.heading < 0) {
			this.heading = Math.PI * 2 - this.heading;
		};
		var oldX = this.x, oldY = this.y;
		this.x += Math.sin(this.heading) * this.getThrust() * this.eot * 0.1;
		this.y -= Math.cos(this.heading) * this.getThrust() * this.eot * 0.1;
		this.x += Math.sin(this.velocity.direction) * this.velocity.speed;
		this.y -= Math.cos(this.velocity.direction) * this.velocity.speed;
		this.velocity.speed = Math.pow(Math.pow(this.x - oldX,2)+Math.pow(this.y - oldY,2),0.5);
		this.velocity.direction = Math.atan2( (this.x-oldX) , (oldY-this.y) );
		this.velocity.speed *= 0.99;
		if (this.velocity.speed < 0.001) {this.velocity.speed = 0};
		
		var currentMap = this.currentMap();
		this.x += Math.sin(currentMap.wind.direction) * currentMap.wind.speed;
		this.y -= Math.cos(currentMap.wind.direction) * currentMap.wind.speed;
		
		if (this.lastMap == undefined) {
			this.lastMap = currentMap;
		} else if (currentMap !== this.lastMap) {
			currentMap.ships.push(this);
			if (this.lastMap.ships.indexOf(this) !== -1) {
				this.lastMap.ships.splice(this.lastMap.ships.indexOf(this),1);
			};
			this.lastMap = currentMap;
		};
		
		if (this.dissipates) {
			this.opacity -= 0.001 * Math.random();
			if (this.opacity < 0) {
				this.destroy();
			};
			this.x += Math.sin(currentMap.wind.direction) * currentMap.wind.speed * ( Math.random() - 0.5 );
			this.y -= Math.cos(currentMap.wind.direction) * currentMap.wind.speed * ( Math.random() - 0.5 );
			this.rudder += ( Math.random() - 0.5 );
			this.rudder = Math.min(Math.max(this.rudder,0.1),-0.1);
		};
		
		view.updateShip(this);
		if (game.p1ship == this) {
			view.updateHeadingAndSpeed();
			if (this.eot > 1 || this.eot < -0.75 || this.velocity.speed > this.getTopSpeed() ) {
				this.stressDamage();
				view.rumble();
			};
			this.checkMapUpdate();
		};
	};
	
	this.checkMapUpdate = function() {
		var currentMap = this.currentMap();
		var mapArray = [currentMap.id];
		mapArray.push('sectionMap_'+(currentMap.hexGridX-1)+'_'+(currentMap.hexGridY));
		mapArray.push('sectionMap_'+(currentMap.hexGridX+1)+'_'+(currentMap.hexGridY));
		mapArray.push('sectionMap_'+(currentMap.hexGridX-0.5)+'_'+(currentMap.hexGridY-1));
		mapArray.push('sectionMap_'+(currentMap.hexGridX+0.5)+'_'+(currentMap.hexGridY-1));
		mapArray.push('sectionMap_'+(currentMap.hexGridX-0.5)+'_'+(currentMap.hexGridY+1));
		mapArray.push('sectionMap_'+(currentMap.hexGridX+0.5)+'_'+(currentMap.hexGridY+1));
		
		for (var sectionMap of document.getElementById('landscapeGroup').children) {
			if (mapArray.indexOf(sectionMap.id) == -1) {
				sectionMap.remove();
			};
		};
		for (var mapID of mapArray) {
			if (document.getElementById(mapID) == null) {
				var loadingMap;
				for (var archiveMap of game.maps) {
					if (archiveMap.id == mapID) {
						loadingMap = archiveMap;
					};
				};
				if (loadingMap == undefined) {
					loadingMap = new SectionMap(parseFloat(mapID.split('_')[1]),parseFloat(mapID.split('_')[2]),game);
					game.maps.push(loadingMap);
				};
				loadingMap.populateClouds();
				view.addMap(loadingMap);
			};
		};
	};
	
	this.currentMap = function() {
		var shortestDist = Infinity, closestMap = undefined, dist;
		for (var map of game.maps) {
			dist = Math.pow(Math.pow(this.x - map.x,2)+Math.pow(this.y - map.y,2),0.5);
			if (dist < shortestDist) {
				shortestDist = dist;
				closestMap = map
			};
		};
		return closestMap;
	};
}

function Crewmate() {
	this.name = "Jo Placeholder";
	
	this.stats = {};
	for (var statName of ['piloting','engineering','gunnery','quartermaster']) {
		this.stats[statName] = Math.random();
	};
	var total = 0;
	for (statName in this.stats) {
		total += this.stats[statName]
	};
	for (statName in this.stats) {
		this.stats[statName] *= 10 / total;
	};
}

function Component(type,tier) {
	if (type == undefined) {type = 'engine'};
	if (tier == undefined) {tier = 1};
	this.condition = 1;
	
	var stats = [];
	this.stats = {};
	if (type == 'engine') {
		stats.push('speed','fuelConsumption');
	} else if (type == 'propeller') {
		stats.push('thrust','lift','drag','turn');
	} else if (type == 'sail') {
		stats.push('thrust','drag');
	} else if (type == 'balloon') {
		stats.push('drag','lift');
	} else if (type == 'wing') {
		stats.push('drag','lift');
	} else if (type == 'armor') {
		stats.push('drag','durability');
	} else if (type == 'cargoBay') {
		stats.push('spaceEfficiency','loadTime');
	} else if (type == 'cargoCrane') {
		stats.push('loadTime');
	};
	for (var statName of stats) {
		this.stats[statName] = Math.random() * tier;
	};
}

var gamenEventPointers = {
	tick: function() {
		game.clock.logEventIn(1,'tick');
		game.tick();
	},
	
	windChange: function() {
		game.clock.logEventIn(Math.random() * 100000 + 100000,'windChange');
		game.windChange();
	},
}