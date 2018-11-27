var game;
function Game() {

	// functions
	
	this.addVectors = function(vectorArray) {
		var point = {x:0,y:0};
		for (var vector of vectorArray) {
			point.x += Math.sin(vector.direction) * vector.speed;
			point.y -= Math.cos(vector.direction) * vector.speed;
		};
		var result = {};
		result.direction = Math.atan2(point.x,point.y);
		result.speed = Math.pow(Math.pow(point.x,2)+Math.pow(point.y,2),0.5);
		return result;
	};
	
	this.mapsInPlay = function() {
		var focalMap = game.p1ship.currentMap();
		var mapsInPlay = [focalMap];
		for (var border in focalMap.neighbors) {
			for (var map of game.maps) {
				if (focalMap.neighbors[border] == map.id) {
					mapsInPlay.push(map);
				};
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
		this.soundtrack.tick();
	};
	
	this.windChange = function() {
		var speedChange = Math.random() * Math.random();
		var directionChange = (Math.random() - 0.5) * Math.PI / 2;
		var mapsInPlay = this.mapsInPlay();
		for (var map of mapsInPlay) {
			map.wind = game.addVectors([map.wind,{direction:directionChange,speed:speedChange}]);
			map.wind.speed = Math.min(2,map.wind.speed);
		};
		var angle = Math.random() * Math.PI * 2;
		var dist = Math.random() * 20 + 10;
		var p1ship = game.p1ship;
		p1ship.currentMap().spawnCloud(p1ship.x+Math.sin(angle)*dist,p1ship.y-Math.cos(angle)*dist);
	};
	
	this.pauseUnpauseGame = function() {
		this.clock.pauseUnpause();
	};
	
	this.localPrice = function(commodityKey) {
		return Math.floor(this.commodities[commodityKey].cost * this.p1ship.currentMap().town.amenities[1].localWares[commodityKey].demand);
	};
	
	// construction
	
	this.commodities = {};
	var commodity;
	var commodityNames = ['food','cotton','fuel','aluminum','rum','rubber','copper','silk','magnesium','manganese'];
	for (var i=0;i<commodityNames.length;i++) {
		commodity = {
			key: commodityNames[i],
			displayName: view.capitalize(commodityNames[i]),
			weight: (i+1) * 10,
			cost: 10 + Math.pow(2,i),
		};
		this.commodities[commodity.key] = commodity;
	};

	this.clock = new Clock();
	this.clock.tick = 100;
	this.clock.tick = 50;
	this.clock.start();
	this.clock.logEventIn(1,'tick');
	this.clock.logEventIn(100,'windChange');
	
	this.townList =[];
	this.ships = [];
	
	this.maps = [];
	this.maps.push(new SectionMap(0,0,this));
	this.maps.push(new SectionMap(-1,0,this));
	this.maps.push(new SectionMap(0.5,-1,this));
	this.maps.push(new SectionMap(0.5,1,this));
	this.maps.push(new SectionMap(-0.5,-1,this));
	this.maps.push(new SectionMap(1,0,this));
	this.maps.push(new SectionMap(-0.5,1,this));
	view.initMap(this.maps);
	
	this.p1ship = new Ship('p1',1);
	this.maps[0].ships.push(this.p1ship);
// 	this.p1ship.rudder = 1.2;
// 	this.p1ship.airspeed.speed = 1;
	view.addShip(this.p1ship);
	view.initUI(this.p1ship);
	view.updatePurse(this);
	
	for (var map of this.maps) {
		view.updatePlayerMap(map);
	};
	
	this.soundtrack = new GamenSoundtrack();
	this.soundtrack.playlist = [
		{path:'bensound-birthofahero.mp3',name:'Birth of a Hero',credit:'Bensound',creditLink:'http://bensound.com/royalty-free-music/track/birth-of-a-hero'},
// 		{path:'bensound-littleplanet.mp3',name:'Little Planet',credit:'Bensound',creditLink:'http://bensound.com/royalty-free-music/track/little-planet'},
		{path:'bensound-newdawn.mp3',name:'New Dawn',credit:'Bensound',creditLink:'http://bensound.com/royalty-free-music/track/new-dawn'},
		{path:'bensound-relaxing.mp3',name:'Relaxing',credit:'Bensound',creditLink:'http://bensound.com/royalty-free-music/track/relaxing'},
		{path:'Purple Planet Music - Atmospheric - The Big Sky.mp3',name:'The Big Sky',credit:'Purple Planet',creditLink:'http://www.purple-planet.com'},
		{path:'Purple Planet Music - Cinematic - Sierra Nevada.mp3',name:'Sierra Nevada',credit:'Purple Planet',creditLink:'http://www.purple-planet.com'},
		{path:'Purple Planet Music - Cinematic - The Fellowship.mp3',name:'The Fellowship',credit:'Purple Planet',creditLink:'http://www.purple-planet.com'},
		{path:'Purple Planet Music - Cinematic - The New Dawn.mp3',name:'The New Dawn',credit:'Purple Planet',creditLink:'http://www.purple-planet.com'},
		{path:'Purple Planet Music - Dreamy - Biosphere.mp3',name:'Biosphere',credit:'Purple Planet',creditLink:'http://www.purple-planet.com'},
		{path:'Purple Planet Music - Dreamy - Shifting Sands.mp3',name:'Shifting Sands',credit:'Purple Planet',creditLink:'http://www.purple-planet.com'},
	];
	this.soundtrack.play();
	
	this.constants = {
		topMooringSpeed: 3,
		mooringTowerRange: 10,
	};
}

function SectionMap(x,y,game) {
	
	this.id = 'sectionMap_'+x+'_'+y;
	this.hexGridX = x;
	this.hexGridY = y;
	
	this.x = x * 350;
	this.y = y * 300;
	this.borders = {};
	for (var border of ['ne','e','se','sw','w','nw']) {
		this.borders[border] = {};
	};
	this.borders.ne.v1 = {x: this.x + 0*2, y: this.y - 100*2 };
	this.borders.e.v1 = {x: this.x + 87.5*2, y: this.y - 50*2 };
	this.borders.se.v1 = {x: this.x + 87.5*2, y: this.y + 50*2 };
	this.borders.sw.v1 = {x: this.x + 0*2, y: this.y + 100*2 };
	this.borders.w.v1 = {x: this.x - 87.5*2, y: this.y + 50*2 };
	this.borders.nw.v1 = {x: this.x - 87.5*2, y: this.y - 50*2 };
	
	this.borders.ne.v2 = this.borders.e.v1;
	this.borders.e.v2 = this.borders.se.v1;
	this.borders.se.v2 = this.borders.sw.v1;
	this.borders.sw.v2 = this.borders.w.v1;
	this.borders.w.v2 = this.borders.nw.v1;
	this.borders.nw.v2 = this.borders.ne.v1;
	
	this.neighbors = {};
	this.neighbors.w ='sectionMap_'+(x-1)+'_'+(y);
	this.neighbors.e ='sectionMap_'+(x+1)+'_'+(y);
	this.neighbors.nw = 'sectionMap_'+(x-0.5)+'_'+(y-1);
	this.neighbors.ne = 'sectionMap_'+(x+0.5)+'_'+(y-1);
	this.neighbors.sw = 'sectionMap_'+(x-0.5)+'_'+(y+1);
	this.neighbors.se = 'sectionMap_'+(x+0.5)+'_'+(y+1);
	
	
	// Match hex vertices ridge/valley values
	var borderingMap, complement;
	for (var border of ['ne','e','se','sw','w','nw']) {
		borderingMap = undefined;
		for (var map of game.maps) {
			if (map.id == this.neighbors[border]) {
				borderingMap = map;
			};
		};
		if (borderingMap !== undefined) {
			if (border == 'ne') {complement = 'sw'}
			else if (border == 'e') {complement = 'w'}
			else if (border == 'se') {complement = 'nw'}
			else if (border == 'sw') {complement = 'ne'}
			else if (border == 'w') {complement = 'e'}
			else if (border == 'nw') {complement = 'se'};
			this.borders[border].v1.d = borderingMap.borders[complement].v2.d;
			this.borders[border].v2.d = borderingMap.borders[complement].v1.d;
		};
	};
	for (var border of ['ne','e','se','sw','w','nw']) {
		if (this.borders[border].v1.d == undefined) {
			this.borders[border].v1.d = ['ridge','valley'][Math.random() * 2 << 0];
		};
	};
	
	// Generate or copy edge points
	var intersects, ridgeOrValley;
	for (var border of ['ne','e','se','sw','w','nw']) {
		borderingMap = undefined;
		for (var map of game.maps) {
			if (map.id == this.neighbors[border]) {
				borderingMap = map;
			};
		};
		if (borderingMap !== undefined) {
			if (border == 'ne') {complement = 'sw'}
			else if (border == 'e') {complement = 'w'}
			else if (border == 'se') {complement = 'nw'}
			else if (border == 'sw') {complement = 'ne'}
			else if (border == 'w') {complement = 'e'}
			else if (border == 'nw') {complement = 'se'};
			intersects = borderingMap.borders[complement].n;
			for (var i=0;i<intersects;i++) {
				this.borders[border]['i'+i] = borderingMap.borders[complement]['i'+(intersects-i-1)];
			};
		} else {
			intersects = Math.random() * 6 + 4 << 0;
			if (this.borders[border].v1.d == this.borders[border].v2.d) {
				intersects = intersects * 2 + 1;
			} else {
				intersects = intersects * 2;
			};
			ridgeOrValley = this.borders[border].v1.d;
			for (var i=0;i<intersects;i++) {
				if (ridgeOrValley == 'ridge') {
					ridgeOrValley = 'valley';
				} else {
					ridgeOrValley = 'ridge';
				};
				this.borders[border]['i'+i] = {
					x: ((intersects-i)*this.borders[border].v1.x + (1+i)*this.borders[border].v2.x)/(intersects+1),
					y: ((intersects-i)*this.borders[border].v1.y + (1+i)*this.borders[border].v2.y)/(intersects+1),
					d: ridgeOrValley,
				};
			};
			for (i=0;i<intersects;i++) {
				this.borders[border]['i'+i].x += 200/intersects * (Math.random()-0.5);
				this.borders[border]['i'+i].y += 200/intersects * (Math.random()-0.5);
			};
		};
		this.borders[border].n = intersects;
	};

	this.perimeter = [];
	for (var border of ['ne','e','se','sw','w','nw']) {
		this.perimeter.push(this.borders[border].v1);
		for (var i = 0;i<this.borders[border].n;i++) {
			this.perimeter.push(this.borders[border]['i'+i]);
		};
	};
	
	var definedNeighbors = [];
	for (var border in this.neighbors) {
		for (var map of game.maps) {
			if (map.id == this.neighbors[border]) {
				definedNeighbors.push(map);
			};
		};
	};
	
	var biomes = ['green','saddlebrown','gold','gainsboro','darkgreen'];
	if (x !== 0 && y!== 0) {
		biomes.push('blue');
		biomes.push('blue');
		biomes.push('blue');
	};
	for (var neighbor of definedNeighbors) {
		biomes.push(neighbor.backgroundColor);
		biomes.push(neighbor.backgroundColor);
		biomes.push(neighbor.backgroundColor);
	};
	this.backgroundColor = biomes[Math.random() * biomes.length << 0];
	
	var wind = {
		direction: Math.random() * Math.PI * 2,
		speed: Math.random() * Math.random() * Math.random() * 3,
	};
	this.wind = wind;
	if (x==0&&y==0) {this.wind.speed = 0.1};
	
	// Ridges and Valleys
	
	var line,stages = 20,thisStep, lastPoint, nextPoint, lastIndex, nextIndex;
	this.elevationLines = [];
	for (var border of ['ne','e','se','sw','w','nw']) {
		this.elevationLines.push([true,this.borders[border].v1]);
		for (var i = 0;i<this.borders[border].n;i++) {
			this.elevationLines.push([true,this.borders[border]['i'+i]]);
		};
	};
	var currentLines = [];
	for (var line of this.elevationLines) {
		currentLines.push(line);
	};
	var lineOptions = ['continue','continue','continue','end'];
	for (i = 0;i<stages;i++) {
		for (var l in currentLines) {
			line = currentLines[l];
			if (line[0]) {
				thisStep = lineOptions[Math.random() * lineOptions.length << 0];
// 				if (i==0) {thisStep = 'continue'};
				lastPoint = line[line.length-1];
				newPoint = {
					x: ( lastPoint.x*5 + this.x )/6,
					y: ( lastPoint.y*5 + this.y )/6,
				};
				lastIndex = parseInt(l)-1;
				if (lastIndex < 0) {lastIndex =currentLines.length-1};
				nextIndex = parseInt(l)+1;
				if (nextIndex >= currentLines.length) {nextIndex = 0};
				if (thisStep == 'continue') {
					newPoint.d = line[1].d;
					line.push(newPoint);
					lineOptions = ['continue','continue','continue','end'];
				} else if (thisStep == 'end') {
					line[0] = false;
					newPoint.d = currentLines[lastIndex][1].d;
					currentLines[lastIndex].splice(currentLines[lastIndex].length-1,1,newPoint);
					currentLines[nextIndex].push(newPoint);
					currentLines.splice(currentLines.indexOf(line),2);
					l--;
				};
			};
		};
	};
	for (line of currentLines) {
		if (line[0]) {
			line.push({x:this.x,y:this.y});
		};
	};
	
	this.flags = [];
	var flagCount = 1;
	
	this.slopes = [];
	var slope;
	var currentLines = [];
	for (var line of this.elevationLines) {
		currentLines.push(line);
	};
	for (i=1;i<stages+2;i++) {
		for (var l in currentLines) {
			if (currentLines[l].length <= i) {
// 				currentLines.splice(l,1);
			} else {
				lastIndex = parseInt(l)-1;
				if (lastIndex < 0) {lastIndex =currentLines.length-1};
				nextIndex = parseInt(l)+1;
				if (nextIndex >= currentLines.length) {nextIndex = 0};
				slope = {points:[]};
				a = currentLines[l][i];
				b = currentLines[l][i+1];
				c = currentLines[lastIndex][i+1];
				d = currentLines[lastIndex][i];
				if (a !== undefined && b !== undefined && c !== undefined && d !== undefined) {
					slope.points = [a,b,c,d];
					slope.fill = 'black';
				} else if (b == undefined && a !== undefined && c !== undefined && d !== undefined) {
					slope.points = [a,c,d];
					slope.fill = 'black';
				} else if (c == undefined && a !== undefined && b !== undefined && d !== undefined) {
					slope.points = [a,b,d];
					slope.fill = 'black';
				} else if (c == undefined && d == undefined && a !== undefined && b !== undefined) {
					this.flags.push({legend:'recursion',point:a});
					// needs to search back through currentLines to the most recent line with an i-index this high
				} else if (b == undefined && b == undefined && c == undefined) {
// 					this.flags.push({legend:'BCD',point:a});
				} else {
					var legend = '';
					if (a == undefined) {legend += 'A'};
					if (b == undefined) {legend += 'B'};
					if (c == undefined) {legend += 'C'};
					if (d == undefined) {legend += 'D'};
					this.flags.push({legend:legend,point:a});
					flagCount++;
				};
				if (slope.points.indexOf(undefined) == -1 && slope.points.length > 0) {
					this.slopes.push(slope);
				};
			};
		};
	};
	
	for (var slope of this.slopes) {
		slope.center = {x:0,y:0};
		slope.highPoint = {x:0,y:0};
		var ridgeCount = 0;
		if (slope.points.length > 0) {
			for (var point of slope.points) {
				slope.center.x += point.x;
				slope.center.y += point.y;
				if (point.d == 'ridge') {
					slope.highPoint.x += point.x;
					slope.highPoint.y += point.y;
					ridgeCount++;
				};
			};
			slope.center.x /= slope.points.length;
			slope.center.y /= slope.points.length;
			slope.highPoint.x /= ridgeCount;
			slope.highPoint.y /= ridgeCount;
		};
		if (slope.highPoint.y > slope.center.y) {
			slope.fill = 'white';
		};
	};
	
	this.buildings = [];
	this.mooringTowers = [];
	
	// Settlements
	if (Math.random() < 0.33 && this.backgroundColor !== 'blue' || (x==0&&y==0)) { // A Settlement!
		var angle = Math.random() * Math.PI * 2;
		var dist = Math.random() * 125;
		var townCenter = {
			name: undefined,
			x: this.x + Math.cos(angle) * dist,
			y:this.y + Math.sin(angle) * dist,
			r: 10 + Math.random() * Math.random() * 40,
			rotation: Math.random() * Math.PI * 2,
			towers: [],
			amenities: [],
		};
		this.town = townCenter;
		var roadOutlets = [];
		var towers = Math.ceil(Math.random() * Math.random() * 5);
		var rot = Math.random() * Math.PI * 2;
		for (var t=0;t<towers;t++) {
			rot += Math.PI * 2 / towers;
			if (rot > Math.PI * 2) {rot -= Math.PI * 2};
			var mooringTower = {
				id: this.id+'Tower'+t,
				occupied: false,
				fill: ['grey','gainsboro','#b7410e','ivory','darkred'][Math.random()*5<<0],
				x:townCenter.x + Math.cos(rot) * (townCenter.r + 9),
				y:townCenter.y - Math.sin(rot) * (townCenter.r + 9),
				rotation: townCenter.rotation,
			};
			this.mooringTowers.push(mooringTower);
			townCenter.towers.push(mooringTower);
			roadOutlets.push(rot);
		};
		for (t=0;t<Math.pow(townCenter.r,2)/1.5;t++) {
			angle = Math.random() * Math.PI * 2;
			dist = Math.random() * townCenter.r * 0.9;
			var newBuilding = {
				x: townCenter.x + Math.cos(angle) * dist,
				y: townCenter.y - Math.sin(angle) * dist,
				r: 2,
				rotation: Math.PI * 2 * Math.random(),
				id: this.id+"Building"+Math.random().toString(36).slice(2),
				sprite: 'basicRoof',
			};
			if (Math.random() > 0.8) {
				newBuilding.sprite = 'longRoof';
				newBuilding.r = 3;
			};
			var tooClose = false;
			for (var building of this.buildings) {
				dist = Math.pow(Math.pow(building.x-newBuilding.x,2)+Math.pow(building.y-newBuilding.y,2),0.5);
				if (dist < newBuilding.r + building.r) {
					tooClose = true;
				};
			};
			if (tooClose == false) {
				this.buildings.push(newBuilding);
			};
		};
		var tavern = {
			name: 'Tavern',
		};
		this.town.amenities.push(tavern);
		
		var wharf = {
			name: 'Wharf',
			localWares: {},
		};
		var ware, inStock = 0;
		for (var commodityKey in game.commodities) {
			ware = {key:commodityKey,demand:Math.random() + 0.5};
			if (ware.demand < 1 && inStock < 6 || (commodityKey == 'food' || commodityKey == 'fuel')) {
				ware.available = Math.random() * Math.random() * 100 << 0;
				inStock++;
			} else {
				ware.available = 0;
			};
			wharf.localWares[commodityKey] = ware;
		};
		this.town.amenities.push(wharf);
		
		var amenity = {
			name: ['Shipyard','Temple','Hospital'][Math.random() * 3 << 0],
		};
		amenity.name = 'Shipyard';
		this.town.amenities.push(amenity);
		var adjectives = ['Little','Big','Great','Friendly','Prudence','Percival','Gas','Alum'];
		var townNouns = [' Town',' City','ville','ton','burgh',' Station',' Towers'];
		if (this.backgroundColor == 'green') {
			adjectives = adjectives.concat(['Green','Verdant','Fair','Silk','Silks','Worm']);
			townNouns = townNouns.concat([' Meadow',' Fields',' Valley',' Dale','dale',' Vale','vale']);
		} else if (this.backgroundColor == 'darkgreen') {
			adjectives = adjectives.concat(['Deep','Sharinga','Para',"Hevea",'Rubber']);
			townNouns = townNouns.concat([' Station'," Orchards",' Groves',' Gardens','garden']);
		} else if (this.backgroundColor == 'saddlebrown') {
			adjectives = adjectives.concat(['High','Hill']);
			townNouns = townNouns.concat([' Hills',' Hill',' Mine',' Tor',' Vista','view']);
		} else if (this.backgroundColor == 'gold') {
			adjectives = adjectives.concat(['Dry','Happy','Hot']);
			townNouns = townNouns.concat([' Dunes',' Springs',' Oasis',' Sands']);
		} else if (this.backgroundColor == 'gainsboro') {
			adjectives = adjectives.concat(['Mount','Snow','Cold','Wind']);
			townNouns = townNouns.concat([' Aerie',' Vista','view']);
		};
		this.town.name = adjectives[adjectives.length * Math.random() << 0]+townNouns[townNouns.length * Math.random() << 0];
		game.townList.push(this.town);
	};
		
	// Landmarks

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
	for (var i=0;i<Math.random()*3;i++) {
		var newShip = new Ship(undefined,1 + Math.random() * Math.random() * 5 << 0);
		var angle = Math.random() * Math.PI * 2;
		var dist = Math.random() * 198;
		newShip.x = this.x + Math.cos(angle) * dist;
		newShip.y = this.y + Math.sin(angle) * dist;
		this.ships.push(newShip);
		view.addShip(newShip);
		game.ships.push(newShip);
	};
	
	this.populateClouds = function() {
		if (this.ships.length < 20) {
			for (var i = 0;i<5;i++) {
				this.spawnCloud();
			};
		};
	};
	
	this.spawnCloud = function(x,y) {
		if (x == undefined) {
			var angle = Math.random() * Math.PI * 2;
			var dist = Math.random() * 198;
			x = this.x + Math.cos(angle) * dist;
			y = this.y + Math.sin(angle) * dist;
		};
		var xDist = 10 * (Math.random() - 0.5);
		var yDist = 10 * (Math.random() - 0.5);
		for (var n = 0;n<5;n++) {
			var cloud = new Ship('cloud');
			cloud.x = x + xDist*n + 5 * (Math.random() - 0.5),
			cloud.y = y + yDist*n + 5 * (Math.random() - 0.5),
			this.ships.push(cloud);
			view.addShip(cloud);
		};
	};
}

function Ship(id,tier) {
	this.id = undefined;
	this.destination = undefined;
	if (id == 'cloud') {
		id = 'cloud_'+Math.random().toString(36).slice(2);
		this.sprite = 'cloud';
		this.fadeIn = true;
		this.opacity = 0;
		this.npc = false;
	} else if (id == undefined) {
		id = Math.random().toString(36).slice(2);
		this.npc = true;
	};
	if (tier == undefined) {tier = 1};
	
	this.id = id;
	
	this.x = 0;
	this.y = 0;
	this.heading = Math.random() * 2 * Math.PI;
	this.eot = 0;
	this.rudder = 0;
	this.airspeed = {
		direction: this.heading,
		speed: 0,
	};
	this.groundspeed = {};
	
	this.cargo = {
		fuel: 1,
		food: 1,
	};
	this.coin = 1000;
	this.components = {};
	if (id == 'p1') {
		this.components.keel = new Component('keel',1);
		this.components.keel.stats.hulls = 1;
		this.components.keel.stats.drag = 0.2;
		this.components.keel.stats.weight = 0.5;
		
		this.components.hull0 = new Component('hull',1);
		this.components.hull0.stats.internalSlots = 4;
		this.components.hull0.stats.externalSlots = 4;
		this.components.hull0.stats.topSlots = 1;
		this.components.hull0.stats.drag = 0.2;
		this.components.hull0.stats.weight = 0.75;
		
		this.components.hull0int0 = new Component('engine',1);
		this.components.hull0int0.stats.fuelCapacity = 0.5;
		this.components.hull0int0.stats.fuelConsumption = 0.5;
		this.components.hull0int0.stats.thrust = 0.5;
		this.components.hull0int0.stats.weight = 0.5;
		
		this.components.hull0int1 = new Component('gasbag',1);
		this.components.hull0int1.stats.lift = 0.5;
		this.components.hull0int1.stats.weight = 0.05;
		
		this.components.hull0int2 = new Component('cargoBay',1);
		this.components.hull0int2.stats.cargo = 0.5;
		this.components.hull0int2.stats.loadTime = 0.5;
		this.components.hull0int2.stats.weight = 0.05;
		
		this.components.hull0int3 = new Component('gasbag',1);
		this.components.hull0int3.stats.lift = 0.5;
		this.components.hull0int3.stats.weight = 0.05;
		
		this.components.hull0ext0 = new Component('motor',1);
		this.components.hull0ext0.stats.thrust = 0.5;
		this.components.hull0ext0.stats.lift = 0.5;
		this.components.hull0ext0.stats.turn = 0.5;
		this.components.hull0ext0.stats.drag = 0.2;
		this.components.hull0ext0.stats.weight = 0.4;
		this.components.hull0ext1 = new Component('motor',1);
		this.components.hull0ext1.stats.thrust = 0.5;
		this.components.hull0ext1.stats.lift = 0.5;
		this.components.hull0ext1.stats.turn = 0.5;
		this.components.hull0ext1.stats.drag = 0.2;
		this.components.hull0ext1.stats.weight = 0.4;
		
		this.components.hull0ext2 = new Component('stabilizer',1);
		this.components.hull0ext2.stats.stability = 0.5;
		this.components.hull0ext2.stats.drag = 0.2;
		this.components.hull0ext2.stats.weight = 0.1;
		this.components.hull0ext3 = new Component('stabilizer',1);
		this.components.hull0ext3.stats.stability = 0.5;
		this.components.hull0ext3.stats.drag = 0.2;
		this.components.hull0ext3.stats.weight = 0.1;
		
		this.components.hull0top0 = new Component('tailboom',1);
		this.components.hull0top0.stats.stability = 0.5;
		this.components.hull0top0.stats.lift = 0.5;
		this.components.hull0top0.stats.drag = 0.2;
		this.components.hull0top0.stats.weight = 0.15;
		
		
		view.buildShipDef(this);
		this.sprite = 'shipSprite_'+this.id;
	
	} else if (id.indexOf('cloud') == -1) {
	
// 		this.sprite = 'defaultShip';
		this.sprite = 'shipSprite_'+this.id;
	
		this.crew = [];
		for (var i=0;i<3;i++) {
			this.crew.push(new Crewmate());
		};
	
		var componentType, componentTypes;
		var keel = new Component('keel',tier);
		this.components.keel = keel;
		var powerSystem = 'engine';
		if (Math.random() > 0.5) {
			powerSystem = 'battery';
		};
		for (var h=0;h<keel.stats.hulls;h++) {
			var hull = new Component('hull',Math.ceil(Math.random()*tier));
			this.components['hull'+h] = hull;
			this.components['hull'+h+'ext0'] = new Component('motor',tier);
			this.components['hull'+h+'ext1'] = new Component('motor',tier);
			for (var c=2;c<=hull.stats.externalSlots-1;c+=2) {
				componentType = 'stabilizer';
				if (Math.random() > 0.5) {
					componentType = 'motor';
				};
				this.components['hull'+h+'ext'+c] = new Component(componentType,tier);
				this.components['hull'+h+'ext'+(c+1)] = new Component(componentType,tier);
			};
			this.components['hull'+h+'int0'] = new Component(powerSystem,tier);
			this.components['hull'+h+'int1'] = new Component('gasbag',tier);
			if (hull.stats.internalSlots > 2) {
				this.components['hull'+h+'int3'] = new Component('cargoBay',tier);
			};
			for (c=4;c<=hull.stats.internalSlots;c++) {
				this.components['hull'+h+'int'+c] = new Component('gasbag',tier);
			};
			for (c=0;c<hull.stats.topSlots;c++) {
				if (c == hull.stats.topSlots-1) {
					componentTypes = ['tailboom','fin','topDeck'];
					if (powerSystem == 'battery') {
						componentTypes.push('solarPanels');
					};
				} else {
					componentTypes = ['fin','topDeck'];
				};
				componentType = componentTypes[componentTypes.length * Math.random() << 0];
				this.components['hull'+h+'top'+c] = new Component(componentType,tier);
			};
		};
		view.buildShipDef(this);
		
	};
	
	this.getThrust = function() {return this.getStat('thrust')};
	this.getTurn = function() {return this.getStat('turn')};
	this.getTopSpeed = function() {return 5};
	
	this.getStat = function(statName) {
		var total = 0;
		for (var slot in this.components) {
			if (this.components[slot].stats[statName] !== undefined) {
				total += this.components[slot].stats[statName];
			};
			if (statName == 'thrust' && this.components[slot].stats.drag !== undefined) {
				total = Math.max(total - this.components[slot].stats.drag,0);
			} else if (statName == 'turn' && this.components[slot].stats.drag !== undefined) {
				total = Math.max(total - this.components[slot].stats.drag*0.5,0);
			} else if (statName == 'lift' && this.components[slot].stats.weight !== undefined) {
				total = Math.max(total - this.components[slot].stats.weight,0);
			};
		};
		return total;
	};
	
	this.availableCargoSpace = function() {
		var space = this.getStat('cargo') * 10;
		var cargoCrates = 0;
		for (var commodityKey in this.cargo) {
			cargoCrates += this.cargo[commodityKey];
		};
		
		return Math.floor(space - cargoCrates);
	};
	
	this.availableCargoLift = function() {
		var lift = this.getStat('lift') * 100;
		var cargoWeight = 0;
		for (var commodityKey in this.cargo) {
			cargoWeight += this.cargo[commodityKey] * game.commodities[commodityKey].weight;
		};
		
		return Math.floor((lift - cargoWeight)*10)/10;
	};
	
	this.destroy = function() {
		var currentMap = this.currentMap();
		var index = currentMap.ships.indexOf(this);
		if (index !== -1) {
			currentMap.ships.splice(index,1);
		};
	};
	
	this.throttle = function(direction) {
		var eot = this.eot * 20;
		if (direction == 'forward') {
			eot++;
		} else if (direction == 'reverse') {
			eot--;
		};
		eot = Math.floor(Math.min(Math.max(eot,-20),26.66))/20;
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
	
	this.mooringNose = function() {
		var lowestY = Infinity, leadNose;
		for (var h=0;h<this.components.keel.stats.hulls;h++) {
			if (this.components['hull'+h].nose.y < lowestY) {
				lowestY = this.components['hull'+h].nose.y;
				leadNose = this.components['hull'+h].nose;
			};
		};
		var nosePoint = {
			x:this.x + Math.sin(this.heading) * leadNose.y * -1,
			y:this.y - Math.cos(this.heading) * leadNose.y * -1,
		};
		return nosePoint;
	};
	
	this.moored = false;
	this.anchor = {x:undefined,y:undefined,d:5};
	this.moor = function() {
		var nosePoint = this.mooringNose();
		var insideTown = false;
		if (this.currentMap().town !== undefined) {
			var town = this.currentMap().town;
			var dist = Math.pow(Math.pow(nosePoint.x-town.x,2)+Math.pow(nosePoint.y-town.y,2),0.5);
			if (dist < town.r) {
				insideTown = true;
			};
		}
		if (this.moored) {
			if (this.anchor.tower !== undefined) {
				this.anchor.tower.occupied = false;
				view.displayUnmooring(this.anchor.tower);
				if (this == game.p1ship) {
					view.townToShip();
				};
			};
			this.moored = false;
			this.anchor = {x:undefined,y:undefined,d:5};
		} else {
			if (this.currentMap().backgroundColor == 'blue') {
				view.displayAlert('You cannot moor on open water.');
			} else if (this.groundspeed.speed > game.constants.topMooringSpeed) {
				if (this == game.p1ship) {
					view.displayAlert('You are going too fast to moor.');
				};
			} else if (insideTown) {
				if (this == game.p1ship) {
					view.displayAlert("You can't drop your mooring anchor on a town!");
				};
			} else {
				this.moored = true;
				var towerInRange = undefined, dist,successDist;
				for (var tower of this.currentMap().mooringTowers) {
					dist = Math.pow(Math.pow(nosePoint.x - tower.x,2)+Math.pow(nosePoint.y - tower.y,2),0.5);
					if (dist < game.constants.mooringTowerRange && tower.occupied == false) {
						towerInRange = tower;
						successDist = dist;
					};
				};
				if (towerInRange !== undefined) {
					this.anchor = {x:towerInRange.x,y:towerInRange.y,d:successDist};
					this.rudder = 0;
					this.eot = 0;
					view.updateWheel();
					view.updateEOT();
					towerInRange.occupied = true;
					this.anchor.tower = towerInRange;
					view.displayMooring(towerInRange);
					if (this == game.p1ship) {
						view.displayAlert('Distance to mast: '+Math.round(successDist*100)/100);
						view.shipToTown(town);
					};
					this.logMooring();
				} else {
					this.anchor.x = nosePoint.x;
					this.anchor.y = nosePoint.y;
					this.anchor.d = 5;
				};
			};
		};
	};
	
	this.mooringLog = [];
	this.mooringCount = 0;
	this.logMooring = function() {
		this.mooringCount++;
		var currentMap = this.currentMap();
		if (this.mooringLog.indexOf(currentMap.id) == -1) {
			this.mooringLog.push(currentMap.id);
		};
	};
	
	this.stressDamage = function() {
	};
	
	this.tick = function() {
		
		// AI
		if (this.npc) {
			this.ai();
		};
		
		// Telemetry
		this.heading += this.getTurn() * this.rudder * 0.1;
		if (this.heading >= Math.PI * 2) {
			this.heading -= Math.PI * 2;
		} else if (this.heading < 0) {
			this.heading = Math.PI * 2 - this.heading;
		};
		var oldX = this.x, oldY = this.y;
		this.x += Math.sin(this.heading) * this.getThrust() * this.eot * 0.1;
		this.y -= Math.cos(this.heading) * this.getThrust() * this.eot * 0.1;
		this.x += Math.sin(this.airspeed.direction) * this.airspeed.speed;
		this.y -= Math.cos(this.airspeed.direction) * this.airspeed.speed;
		this.airspeed.speed = Math.pow(Math.pow(this.x - oldX,2)+Math.pow(this.y - oldY,2),0.5);
		this.airspeed.direction = Math.atan2( (this.x-oldX) , (oldY-this.y) );
		this.airspeed.speed *= 0.99;
		
		// Wind
		var windEffect = this.getStat('drag') - this.getStat('stability');
		var currentMap = this.currentMap();
		this.x += Math.sin(currentMap.wind.direction) * currentMap.wind.speed * windEffect*3;
		this.y -= Math.cos(currentMap.wind.direction) * currentMap.wind.speed * windEffect*3;
		var windTurn = currentMap.wind.direction - this.heading;
		if (windTurn < 0) {
			windTurn = Math.PI * 2 + windTurn;
		} else if (windTurn > Math.PI * 2) {
			windTurn -= Math.PI*2;
		};
		var windTurnRotation = Math.PI/400 * currentMap.wind.speed * windEffect*3;
		if (this.moored) {windTurnRotation *= 30};
		if (windTurn > Math.PI * 1.05) {
			this.heading += windTurnRotation;
		} else if (windTurn < Math.PI * 0.95 ) {
			this.heading -= windTurnRotation;
		};
		
		this.groundspeed.direction = Math.atan2( (this.x-oldX) , (oldY-this.y) );
		this.groundspeed.speed = Math.pow(Math.pow(this.x - oldX,2)+Math.pow(this.y - oldY,2),0.5);
		
		// Moored
		if (this.moored) {
			if (this.anchor.d > 5.1) {
				this.anchor.d -= 0.1;
			} else if (this.anchor.d < 4.9) {
				this.anchor.d += 0.1;
			};
			var anchorDist = Math.pow(Math.pow(this.x-this.anchor.x,2)+Math.pow(this.y-this.anchor.y,2),0.5);
			if (anchorDist > this.anchor.d) {
				var anchorDirection = Math.atan2(this.x-this.anchor.x,this.y-this.anchor.y);
				this.x = this.anchor.x + Math.sin(anchorDirection) * this.anchor.d;
				this.y = this.anchor.y + Math.cos(anchorDirection) * this.anchor.d;
			};
			this.airspeed.speed = Math.pow(Math.pow(this.x - oldX,2)+Math.pow(this.y - oldY,2),0.5);
			this.airspeed.direction = Math.atan2( (this.x-oldX) , (oldY-this.y) );
		};
		
		// Change Map Registry
		if (this.lastMap == undefined) {
			this.lastMap = currentMap;
		} else if (currentMap !== this.lastMap) {
			currentMap.ships.push(this);
			if (this.lastMap.ships.indexOf(this) !== -1) {
				this.lastMap.ships.splice(this.lastMap.ships.indexOf(this),1);
			};
			this.lastMap = currentMap;
		};
		
		if (this.fadeIn) {
			this.opacity += 0.05 * Math.random();
			if (this.opacity > 0.5) {
				this.fadeIn = false;
				this.dissipates = true;
			};
		} else if (this.dissipates) {
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
			view.updateNavMarkers();
			if (this.eot > 1 || this.eot < -0.75 || this.airspeed.speed > this.getTopSpeed() ) {
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
				if (document.getElementById(loadingMap.id) == null) {
					view.addMap(loadingMap);
				};
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
	
	this.buyCommodity = function(commodityKey) {
		var current = this.cargo[commodityKey];
		if (current == undefined) {current = 0};
		this.cargo[commodityKey] = current + 1;
		
		this.coin -= game.localPrice(commodityKey);
		
		view.updateWharfUI();
		view.updatePurse(game);
	};
	
	this.sellCommodity = function(commodityKey) {
		var current = this.cargo[commodityKey];
		if (current == undefined) {current = 0};
		this.cargo[commodityKey] = current - 1;
		
		this.coin += game.localPrice(commodityKey);
		
		view.updateWharfUI();
		view.updatePurse(game);
	};
	
	// AI
	
	this.ai = function() {
		if (this.destination == undefined) {
			this.pickDestination();
		};
		if (this.moored) {
			this.mooringTime--;
			if (this.mooringTime < 0) {
				this.moor();
				this.pickDestination();
			};
		} else { // In Flight
			var distToTown = Math.pow(Math.pow(this.x-this.destination.x,2)+Math.pow(this.y-this.destination.y,2),0.5);
			if (distToTown < 50) {
				var targetTower = undefined;
				for (var tower of this.destination.towers) {
					if (tower.occupied == false) {
						targetTower = tower;
					};
				};
				if (targetTower !== undefined) {
					this.steerTowards(targetTower);
					var distToTower = Math.pow(Math.pow(this.x-targetTower.x,2)+Math.pow(this.y-targetTower.y,2),0.5);
					if (distToTower < game.constants.mooringTowerRange && targetTower.occupied == false) {
						this.moor();
						this.mooringTime = 200;
					};
				};
			} else {
				this.steerTowards(this.destination);
			};
		};
	};
	
	this.pickDestination = function() {
		if (game.townList.length > 1) {
			var destinations = [];
			for (var town of game.townList) {
				if (town !== this.currentMap().town) {
					destinations.push(town);
				};
			};
			this.destination = destinations[destinations.length * Math.random() << 0];
		} else {
			this.destination = {
				x:0,
				y:0,
				towers:[{x:0,y:0}],
			};
		};
	};
	
	this.steerTowards = function(target) {
		var course = Math.atan2(target.x-this.x,this.y-target.y);
		if (course < 0) {course += Math.PI * 2};
		var courseChange = course - this.heading;
		if (courseChange > Math.PI) {
			courseChange -= Math.PI * 2;
		} else if (courseChange < Math.PI * -1) {
			courseChange += Math.PI * 2;
		};
		if (courseChange > 0 && this.rudder < 0.3) {
			this.steer('right');
		} else if (courseChange < 0 && this.rudder > -0.3) {
			this.steer('left');
		};
		
		var dist = Math.pow(Math.pow(target.x-this.x,2)+Math.pow(this.y-target.y,2),0.5);
		if (dist > 1000 && Math.abs(courseChange) < Math.PI/8 && this.eot < 1 && this.airspeed.speed < this.getTopSpeed()) {
			this.throttle('forward');
		} else if (dist > 1000 && Math.abs(courseChange) < Math.PI/8 && this.eot > 0 && this.airspeed.speed > this.getTopSpeed()) {
			this.throttle('reverse');
		} else if (Math.abs(courseChange) < Math.PI/8 && this.groundspeed.speed < 1 && this.eot < 1) {
			this.throttle('forward');
		} else if (Math.abs(courseChange) < Math.PI/8 && this.groundspeed.speed > game.constants.topMooringSpeed*0.5 && Math.abs(this.heading-this.groundspeed.direction) < Math.PI/8) {
			this.throttle('reverse');
		};
// 		console.log(target.name,courseChange,this.rudder);
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
	this.name = 'Placeholder';
	this.type = type;
	this.tier = tier;
	this.condition = 1;
	
	var colors = ['gainsboro','lightgray','silver','darkgray','gray','dimgray','lightslategray','slategray','mintcream','azure','aliceblue','ghostwhite','whitesmoke','beige','oldlace','ivory','cornsilk','wheat','burlywood','tan','lightsteelblue','powderblue'];
	this.color = colors[colors.length * Math.random() << 0];
	
	var stats = [];
	var weight = 1;
	var nouns = ['component'];
	this.stats = {};
	if (type == 'keel') {
		stats.push('hulls','drag');
		weight = 1;
		nouns = ['Aluminum Keel','Duralumin Keel','Aerogel Keel','Graphene Hull','Aerographite Keel','Carbon Nanotube Keel','Diamond Nanothread Keel'];
	} else if (type == 'hull') {
		stats.push('internalSlots','externalSlots','topSlots','drag');
		weight = 1.5;
		nouns = ['Courier Hull','Ultralight Hull','Yacht Hull','Corvette Hull','Akron Hull','Argosy Hull','Workhorse Hull','Thunderhead Hull','Titan Hull','Colossus Hull'];
	} else if (type == 'engine') {
		stats.push('thrust','fuelCapacity','fuelConsumption');
		weight = 1;
		nouns = ['Two-Piston Engine','Four-Piston Engine','Six-Piston Engine','Eight-Piston Engine','Rotary Engine'];
	} else if (type == 'battery') {
		stats.push('thrust','chargeCapacity');
		weight = 1;
		nouns = ['Nickel-Cadmium Battery','Lithium Ion Battery','Dual Carbon Battery','Germanium Air Battery','Molten Salt Battery','Polymer Battery','Flow Battery','Organic Radical Battery','Fuel Cell','Ultrabattery'];
	} else if (type == 'motor') {
		stats.push('thrust','turn','lift','drag');
		weight = 0.8;
		nouns = ['Prop','Contraprop','Proprotor','Ducted Fan','Turboprop','Turbojet','Turbofan','Propfan','Ramjet','Scramjet'];
	} else if (type == 'gasbag') {
		stats.push('lift');
		weight = 0.1;
		nouns = ['Tarbag','Rubberbag','Silk Bag','Spidersilk Bag'];
	} else if (type == 'stabilizer') {
		stats.push('drag','stability');
		weight = 0.2;
		nouns = ['Stabilizer','Trimfin','Canard'];
	} else if (type == 'solarPanels') {
		stats.push('power');
		weight = 0.2;
		nouns = ['Charge Panels','Solar Collectors','Solar Plant'];
	} else if (type == 'topDeck') {
		stats.push('sight');
		weight = 0.1;
		nouns = ['Deck','Dome'];
	} else if (type == 'fin') {
		stats.push('drag','stability');
		weight = 0.2;
		nouns = ['Fin','Rudder','Dorsal'];
	} else if (type == 'tailboom') {
		stats.push('drag','lift','stability');
		weight = 0.3;
		nouns = ['Tailboom'];
	} else if (type == 'cargoBay') {
		stats.push('cargo','loadTime');
		weight = 0.1;
		nouns = ['Cargo Bay'];
	} else if (type == 'cargoCrane') {
		stats.push('cargo','loadTime');
		weight = 0.1;
		nouns = ['Winch','Crane'];
	};
	stats.push('weight');
	for (var statName of stats) {
		this.stats[statName] = 0;
		for (var i=0;i<tier;i++) {
			this.stats[statName] += Math.random()*0.9+0.1;
		};
		if (statName == 'hulls') {
			this.stats[statName] = Math.ceil(this.stats[statName]);
		} else if (statName == 'internalSlots') {
			this.stats[statName] = 1 + Math.ceil(this.stats[statName] * 2) * 2;
		} else if (statName == 'externalSlots') {
			this.stats[statName] = Math.ceil(this.stats[statName] * 2) * 2;
		} else if (statName == 'topSlots') {
			this.stats[statName] = 1 + Math.floor(this.stats[statName]);
		};
		if (statName == 'drag') {
			this.stats[statName] *= 0.2;
		};
	};
	this.stats.weight *= weight;
	if (type == 'keel') {
		this.stats.drag *= this.stats.hulls;
	} else if (type == 'hull') {
		this.length = (this.stats.internalSlots+this.stats.externalSlots+this.stats.topSlots);
	};
	this.name = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.charAt((tier-1)*2.6+Math.random()*2.6 << 0);
	this.name += '-'+Math.ceil(Math.random()*100)+' ';
	this.name += nouns[nouns.length*(tier-1)/10];
}

var gamenEventPointers = {
	tick: function() {
		game.clock.logEventIn(1,'tick');
		game.tick();
	},
	
	windChange: function() {
		game.clock.logEventIn(Math.random() * 500000 + 500000,'windChange');
		game.windChange();
	},
}