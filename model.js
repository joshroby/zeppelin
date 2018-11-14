var game;
function Game() {

	this.clock = new Clock();
	this.clock.tick = 100;
	this.clock.start();
	this.clock.logEventIn(1,'tick');
	
	this.map = new SectionMap(this);
	view.initMap(this.map);
	view.initUI();
	
	this.p1ship = new Ship('p1');
	this.map.ships.push(this.p1ship);
	view.addShip(this.p1ship);
	console.log(this.p1ship);
	
	this.tick = function() {
		for (var ship of this.map.ships) {
			ship.tick();
		};
		view.recenterMap();
	};
}

function SectionMap() {

	this.landmarks = [];
	for (var i=0;i<1000;i++) {
		var newLandmark = {
			x:Math.random() * 1000 - 500,
			y:Math.random() * 1000 - 500,
			rotation: 0,
			glyph: 'resourceGem',
			fill: ['red','green','purple','gold'][Math.random() * 4 << 0]
		};
		this.landmarks.push(newLandmark);
	};
	
	this.ships = [];
}

function Ship(id,tier) {
	if (id == undefined) {id = Math.random().toString(36).slice(2)};
	if (tier == undefined) {tier = 1};
	
	this.id = id;
	
	this.x = Math.random() * 20 - 10;
	this.y = Math.random() * 20 - 10;
	this.heading = Math.random() * 2 * Math.PI;
	this.eot = 0;
	this.rudder = 0;
	this.velocity = {
		direction: this.heading,
		speed: Math.random() * 0.2,
	};
	
	this.crew = [];
	for (var i=0;i<3;i++) {
		this.crew.push(new Crewmate());
	};
	
	this.components = {};
	this.components.engine = new Component('engine',tier);
	this.components.propeller = new Component('propeller',tier);
	this.components.armor = new Component('armor',tier);
	this.components.cargo = new Component('cargoBay',tier);
	
	this.getThrust = function() {return this.getStat('thrust')};
	this.getTurn = function() {return this.getStat('turn')};
	this.getTopSpeed = function() {return 5};
	
	this.getStat = function(statName) {
		return 1;
	};
	
	this.throttle = function(direction) {
		var eot = this.eot * 3;
		if (direction == 'forward') {
			eot++;
		} else if (direction == 'reverse') {
			eot--;
		};
		eot = Math.floor(Math.min(Math.max(eot,-3),4))/3;
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
		view.updateShip(this);
		if (game.p1ship == this) {
			view.updateHeadingAndSpeed();
			if (this.eot > 1 || this.eot < -0.75 || this.velocity.speed > this.getTopSpeed() ) {
				this.stressDamage();
				view.rumble();
			};
		};
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
	}
}