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
	
	this.windLimit = function() {
		return 0.5 + Math.pow(Math.pow(game.p1ship.y,2)+Math.pow(game.p1ship.x,2),0.5) / 2000;
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
		for (var event of this.events) {
			event.time -= this.clock.tick / 1000;
			if (event.time < 0) {
				events[event.eventKey].resolve(event);
				this.removeEvent(event);
			};
		};
	};
	
	this.windChange = function() {
		var speedChange = Math.random() * Math.random();
		var windLimit = 1;
		if (this.p1ship !== undefined) {
			windLimit = game.windLimit();
			speedChange *= windLimit;
		};
		var directionChange = (Math.random() - 0.5) * Math.PI / 2;
		var mapsInPlay = this.mapsInPlay();
		for (var map of mapsInPlay) {
			map.wind = game.addVectors([map.wind,{direction:directionChange,speed:speedChange}]);
			map.wind.speed = Math.min(windLimit,map.wind.speed);
		};
		var angle = Math.random() * Math.PI * 2;
		var dist = Math.random() * 20 + 10;
		var p1ship = game.p1ship;
		p1ship.currentMap().spawnCloud(p1ship.x+Math.sin(angle)*dist,p1ship.y-Math.cos(angle)*dist);
	};
	
	this.pauseUnpauseGame = function() {
		this.clock.pauseUnpause();
		if (this.clock.paused) {
			document.getElementById('gameSVG').pauseAnimations();
		} else {
			document.getElementById('gameSVG').unpauseAnimations();
		};
	};
	
	this.localPrice = function(commodityKey) {
		return Math.floor(this.commodities[commodityKey].cost * this.p1ship.currentMap().town.amenities[1].localWares[commodityKey].demand);
	};
	
	this.reprovisionCost = function() {
		return Math.ceil((game.p1ship.currentMap().town.amenities[1].localWares.food.demand * game.commodities.food.cost) * (1 - game.p1ship.provisions)*game.p1ship.discount('resupply'));
	};
	
	this.refuelCost = function() {
		return Math.ceil((game.p1ship.currentMap().town.amenities[1].localWares.fuel.demand * game.commodities.fuel.cost) * (1 - game.p1ship.fuel)*game.p1ship.discount('resupply'));
	};
	
	this.rechargeCost = function() {
		return Math.ceil((game.p1ship.currentMap().town.amenities[1].localWares.charge.demand * game.commodities.charge.cost) * (1 - game.p1ship.charge)*game.p1ship.discount('resupply'));
	};
	
	this.rumor = function() {
		var rumors = [];
		// Town Rumors
		var town = this.townList[this.townList.length * Math.random() << 0];
		var greatestDemand = 0, demandedCommodity;
		var leastDemand = Infinity, surplusCommodity;
		for (var commodityKey in town.amenities[1].localWares) {
			if (commodityKey !== 'charge') {
				if (town.amenities[1].localWares[commodityKey].demand > greatestDemand) {
					greatestDemand = town.amenities[1].localWares[commodityKey].demand;
					demandedCommodity = commodityKey;
				};
				if (town.amenities[1].localWares[commodityKey].demand < leastDemand) {
					leastDemand = town.amenities[1].localWares[commodityKey].demand;
					surplusCommodity = commodityKey;
				};
			};
		};
		rumors.push(town.name + ' harbors a great demand for ' + game.commodities[demandedCommodity].displayName + '.');
		rumors.push(town.name + ' is overflowing with a surplus of ' + game.commodities[surplusCommodity].displayName + '.');
		
		// Commodity Rumors
		var mostCommodity, greatestQty = 0;
		for (commodityKey in game.p1ship.cargo) {
			if (game.p1ship.cargo[commodityKey] > greatestQty) {
				greatestQty = game.p1ship.cargo[commodityKey];
				mostCommodity = commodityKey;
			};
		};
		if (mostCommodity !== undefined) {
			var demandingTown, greatestDemand = 1;
			for (var town of game.townList) {
				if (town.amenities[1].localWares[mostCommodity].demand > greatestDemand) {
					greatestDemand = town.amenities[1].localWares[mostCommodity].demand;
					demandingTown = town;
				};
			};
		};
		if (demandingTown) {
			rumors.push("Best market I know for "+game.commodities[mostCommodity].displayName+" is "+demandingTown.name+".");
		};
		
		// Speaker
		var adjectives = ['bedraggled','dashing','tipsy','gregarious','suspicious-looking','shady','prim','laughing','beautiful','plump','skinny','dreamy-eyed'];
		var people = ['ship captain','street urchin','old biddy','bartender','waiter','piano player','wharf worker','miner','farmer','pilot','quartermaster'];
		var verbs = ['opines','shares','confides','insists','speculates'];
		var speaker = "A "+adjectives[Math.random() * adjectives.length << 0] + " " + people[people.length * Math.random() << 0] + " " + verbs[verbs.length * Math.random() << 0] + ": ";
		return speaker+'"'+rumors[rumors.length * Math.random() << 0]+'"';
	};
	
	this.eventIndex = 0;
	this.newEvent = function(eventKey,parameters,time,icon) {
		var duplicate = false;
		for (var event of this.events) {
			if (event.eventKey == eventKey && event.parameters == parameters) {
				duplicate = true;
			};
		};
		if (eventKey==undefined) {
			console.log('Cannot log an event without an eventKey');
		} else if (duplicate == false) {
			if (time==undefined) {time = 100};
			if (icon==undefined) {icon = 'defaultEventIcon'};
			var lastEvent = this.events[this.events.length-1];
			var event = {
				id: this.eventIndex,
				eventKey: eventKey,
				parameters: parameters,
				time: time,
				icon: icon,
			};
			this.events.push(event);
			view.addEvent(event);
			this.eventIndex++;
		};
	};
	
	this.removeEvent = function(event) {
		var index = this.events.indexOf(event);
		if (index !== -1) {
			this.events.splice(index,1);
		};
		view.removeEvent(event);
	};
	
	this.atTheBarDrink = function(tavern) {
		game.p1ship.coin -= 2;
		view.updatePurse(game);
		tavern.atTheBar.drinkCount++;
		tavern.atTheBar.revelations.name = true;
		if (tavern.atTheBar.type == 'recruitable') {
			tavern.atTheBar.lastDialogue = tavern.atTheBar.npc.recruitDialogue(tavern,true);
		};
	};
	
	this.atTheBarAnother = function(tavern) {
		tavern.atTheBar.drinkCount++;
		game.p1ship.coin -= 2;
		view.updatePurse(game);
		tavern.atTheBar.lastDialogue = tavern.atTheBar.npc.recruitDialogue(tavern,true);
	};
	
	this.atTheBarChat = function(tavern) {
		tavern.atTheBar.lastDialogue = tavern.atTheBar.npc.recruitDialogue(tavern);
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
	this.commodities.charge = {
		key: 'charge',
		displayName: 'Charge',
		weight: 0,
		cost: this.commodities.fuel.cost,
	};
	
	this.colors = ['gainsboro','lightgray','silver','darkgray','gray','dimgray','azure','aliceblue','powderblue','lightsteelblue','lightslategray','slategray','mintcream','ghostwhite','whitesmoke','ivory','beige','cornsilk','oldlace','wheat','burlywood','tan'];

	this.clock = new Clock();
	this.clock.tick = 100;
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
// 	this.p1ship = new Ship('p1x',5);
	this.maps[0].ships.push(this.p1ship);
	view.addShip(this.p1ship);
	view.initUI(this.p1ship);
	view.updatePurse(this);
	
	this.postings = {
			pilot:{i:1,displayName:"Ship's Pilot",buttonName:'Pilot',positionName:'pilot'},
			chiefEngineer:{i:2,displayName:'Chief Engineer',buttonName:['Chief','Engineer'],positionName:'chief engineer'},
			quartermaster:{i:3,displayName:'Quartermaster',buttonName:['Quarter','Master'],positionName:'quartermaster'},
			supercargo:{i:4,displayName:'Supercargo',buttonName:'Supercargo',positionName:'supercargo'},
			operations:{i:5,displayName:'Operations Crew',buttonName:'Operations',positionName:'operations mate'},
			engineering:{i:6,displayName:'Engineer',buttonName:'Engineering',positionName: 'engineer'},
			morale:{i:7,displayName:'Morale & Hospitality Crew',buttonName:['Morale &','Hospitality'],positionName:'steward'},
			brig:{i:8,displayName:'In the Brig',buttonName:'Brig',positionName:'prisoner'},
	};
	
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
	
	this.alerts = [];
	
	this.constants = {
		topMooringSpeed: 3,
		mooringTowerRange: 10,
	};
	
	this.events = [];
	
	this.newEvent('help',undefined,300,'helpEventIcon');
}

function SectionMap(x,y,game) {
	
	this.id = 'sectionMap_'+x+'_'+y;
	this.hexGridX = x;
	this.hexGridY = y;
	
	this.level = Math.round(Math.pow(Math.pow(x*7,2)+Math.pow(y*6,2),0.5)/7);
	
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
	
	var windLimit = 1;
	if (game.p1ship !== undefined) { windLimit = game.windLimit(); };
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
			atTheBar: {
				npc: new Crewmate(10+this.level),
				type: 'recruitable',
				revelations: {},
				drinkCount: 0,
				lastDialogue: undefined,
			},
		};
		this.town.tavern = tavern;
		this.town.amenities.push(tavern);
		
		var wharf = {
			name: 'Wharf',
			localWares: {},
		};
		var ware, inStock = 0;
		for (var commodityKey in game.commodities) {
			ware = {key:commodityKey,demand:Math.random() + 0.5};
			if (ware.demand < 1 && inStock < 6) {
				ware.available = Math.random() * Math.random() * 100 << 0;
				inStock++;
			} else {
				ware.available = 0;
			};
			wharf.localWares[commodityKey] = ware;
		};
		wharf.localWares.charge.available = 0;
		this.town.wharf = wharf;
		this.town.amenities.push(wharf);
		
		var amenity = {
			name: 'Temple',
		};
		if (true) {
			amenity.name = 'Shipyard';
			this.town.shipyard = amenity;
			amenity.stock = [];
			for (var i=0;i<5;i++) {
				amenity.stock.push(new Component(undefined,1+Math.random() * 10 << 0));
			};
		} else if (false) {
			amenity.name = 'Temple';
			this.town.temple = amenity;
		} else if (false) {
			amenity.name = 'Hospital';
			this.town.hospital = amenity;
		};
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
		var founder = new Crewmate();
		if (Math.random() < 0.25) {
			adjectives = [founder.name.split(' ')[0]];
		} else if (Math.random() < 0.33) {
			adjectives = ['','','','','','Great ','Little '];
			townNouns = [founder.name.split(' ')[1]];
		} else if (Math.random() < 0.33) {
			adjectives = [founder.name.split(' ')[1]];
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
	
	this.charge = 1;
	this.fuel = 1;
	this.provisions = 1;
	
	this.cargo = {
		fuel: 1,
		food: 1,
	};
	this.coin = 500;
	
	this.crew = [];
	for (var i=0;i<3;i++) {
		this.crew.push(new Crewmate());
	};
	this.postings = {
		pilot: undefined,
		supercargo: undefined,
		quartermaster: undefined,
		chiefEngineer: undefined,
		engineering: [],
		operations: [],
		morale: [],
		brig: [],
	};
	for (var crewmate of this.crew) {
		this.postings.operations.push(crewmate);
	};
		
	this.components = {};
	if (id == 'p1') {
		this.components.keel = new Component('keel',1);
		this.components.keel.stats.hulls = 1;
		this.components.keel.stats.profile = 3;
		this.components.keel.stats.drag = 0.2;
		this.components.keel.stats.weight = 0.5;
		
		this.components.hull0 = new Component('hull',1);
		this.components.hull0.stats.internalSlots = 4;
		this.components.hull0.stats.externalSlots = 4;
		this.components.hull0.stats.topSlots = 1;
		this.components.hull0.stats.drag = 0.2;
		this.components.hull0.stats.weight = 0.75;
		this.components.hull0.length = 8;
		
		this.components.hull0int0 = new Component('gasbag',1);
		this.components.hull0int0.stats.lift = 0.5;
		this.components.hull0int0.stats.weight = 0.05;
		
		this.components.hull0int1 = new Component('engine',1);
		this.components.hull0int1.stats.fuelCapacity = 0.5;
		this.components.hull0int1.stats.thrust = 0.5;
		this.components.hull0int1.stats.weight = 0.5;
				
		this.components.hull0int2 = new Component('cargobay',1);
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
				this.components['hull'+h+'int3'] = new Component('cargobay',tier);
			};
			for (c=4;c<=hull.stats.internalSlots;c++) {
				this.components['hull'+h+'int'+c] = new Component('gasbag',tier);
			};
			for (c=0;c<hull.stats.topSlots;c++) {
				if (c == hull.stats.topSlots-1) {
					componentTypes = ['tailboom','fin','topDeck'];
				} else {
					componentTypes = ['fin','topDeck','garden'];
				};
				if (powerSystem == 'battery') {
					componentTypes.push('solarPanels');
				};
				componentType = componentTypes[componentTypes.length * Math.random() << 0];
				this.components['hull'+h+'top'+c] = new Component(componentType,tier);
			};
		};
		view.buildShipDef(this);
		
	};
	
	this.crewBenefit = function(statName) {
		var total = 0;
		
		for (var crewmate of this.crew) {
			if (statName == 'amenities') {
				if (crewmate.posting == 'quartermaster') {total += crewmate.stats.hospitality;};
				if (crewmate.posting == 'morale') {total += crewmate.stats.hospitality;};
			} else if (statName == 'cargo') {
				if (crewmate.posting == 'supercargo') {total += crewmate.stats.loadmastery;};
			} else if (statName == 'chargeCapacity') {
				if (crewmate.posting == 'chiefEngineer') {total += crewmate.stats.engineering;};
			} else if (statName == 'fuelEfficiency') {
				if (crewmate.posting == 'chiefEngineer') {total += crewmate.stats.engineering;};
			} else if (statName == 'harvest') {
				if (crewmate.posting == 'quartermaster') {total += crewmate.stats.hospitality;};
				if (crewmate.posting == 'operations') {total += crewmate.stats.hospitality;};
			} else if (statName == 'lift') {
				if (crewmate.posting == 'pilot') {total += crewmate.stats.loadmastery;};
			} else if (statName == 'recharge') {
				if (crewmate.posting == 'engineer') {total += crewmate.stats.loadmastery;};
			} else if (statName == 'stability') {
				if (crewmate.posting == 'operations') {total += crewmate.stats.piloting;};
			} else if (statName == 'thrust') {
				if (crewmate.posting == 'pilot') {total += crewmate.stats.piloting;};
			} else if (statName == 'turn') {
				if (crewmate.posting == 'pilot') {total += crewmate.stats.piloting;};
			};
		};
		
		return 1 + total/100;
	};
	
	this.discount = function(type) {
		var discount = 1;
		if (type == 'resupply' && this.postings.quartermaster !== undefined) {
			discount -= this.postings.quartermaster.stats.haggling / 100;
		} else if (type == 'commodity' && this.postings.supercargo !== undefined) {
			discount -= this.postings.supercargo.stats.haggling / 100;
		} else if (type == 'shipyard' && this.postings.chiefEngineer !== undefined) {
			discount -= this.postings.chiefEngineer.stats.haggling / 100;
		};
		return discount;
	};
	
	this.install = function(component,slot) {
		for (var oldSlot in this.components) {
			if (this.components[oldSlot] == component) {
				this.components[oldSlot] = undefined;
			};
		};
		this.components[slot] = component;
		view.refreshShipyardUI();
		var airWrench = new Audio('audio/Air Wrench-SoundBible.com-111926242.mp3');
		airWrench.play();
		view.updateWharfUI();
	};
	
	this.paintComponent = function(component,color) {
		component.color = color;
		view.buildShipDef(this);
		this.coin -= view.panes.selectedComponent.paintCost;
		view.updatePurse(game);
	};
	
	this.sellComponent = function(component) {
		var slotKey;
		var price = Math.ceil(component.cost * 0.5 * (2-game.p1ship.discount('shipyard')));
		var content = document.createElement('p');
		if (this.postings.chiefEngineer == undefined) {
			content.innerHTML = "With no Chief Engineer to represent you to the shipyard breakers, the only offer you get for your used "+component.name+" is $"+price+".";
		} else {
			content.innerHTML = this.postings.chiefEngineer.name + " is able to haggle the shipyard breakers up from their original offer to $"+price+" for the used "+component.name+".";
		};
		var buttonArray = [
			{label:'No Thanks',execute:view.dismissWindow},
			{label:'Sell for $' + price, execute:this.confirmedSellComponent.bind(this,component,price)},
		];
		view.displayWindow(content,buttonArray,'image');
	};
	
	this.confirmedSellComponent = function(component,price) {
		for (var slot in this.components) {
			if (this.components[slot] == component) {
				this.components[slot] = undefined;
			};
		};
		this.coin += price;
		this.currentMap().town.amenities[2].stock.push(component);
		view.buildShipDef(this);
		view.refreshShipyardUI();
		view.updatePurse(game);
		view.dismissWindow();
	};
	
	this.getThrust = function() {return this.getStat('thrust')};
	this.getTurn = function() {return this.getStat('turn')};
	this.getTopSpeed = function() {return 5};
	
	this.getStat = function(statName,crewBenefit) {
		var total = 0;
		if (statName == 'profile') {
			if (id.indexOf('cloud') == -1) {
				for (var componentKey in this.components) {
					if (this.components[componentKey] !== undefined && this.components[componentKey].length !== undefined) {
						total += this.components[componentKey].length * 0.75;
					};
				};
			} else {
				total = 10;
			};
		} else if (statName == 'damageControl') {
			for (var crewmate of this.postings.engineering) {
				total += crewmate.stats.engineering;
			};
		} else {
			for (var slot in this.components) {
				if (this.components[slot]) {
					if (this.components[slot].stats[statName] !== undefined) {
						total += this.components[slot].stats[statName] * this.components[slot].condition;
					};
					if (statName == 'thrust' && this.components[slot].stats.drag !== undefined) {
						total = Math.max(total - this.components[slot].stats.drag,0);
					} else if (statName == 'turn' && this.components[slot].stats.drag !== undefined) {
						total = Math.max(total - this.components[slot].stats.drag*0.5,0);
					} else if (statName == 'lift' && this.components[slot].stats.weight !== undefined) {
						total = Math.max(total - this.components[slot].stats.weight,0);
					};
				};
			};
		};
		if (crewBenefit == undefined || crewBenefit == true) {
			total *= this.crewBenefit(statName);
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
	
	this.reprovision = function() {
		this.provisions = 1;
		this.coin -= game.reprovisionCost();
		view.updatePurse(game);
		view.updateWharfUI();
	};
	
	this.refuel = function() {
		this.fuel = 1;
		this.coin -= game.refuelCost();
		view.updatePurse(game);
		view.updateWharfUI();
	};
	
	this.recharge = function() {
		this.charge = 1;
		this.coin -= game.rechargeCost();
		view.updatePurse(game);
		view.updateWharfUI();
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
		var magnitude = 1;
		if (direction == 'left') {
			rudder -= 1;
			if (rudder > 10) { rudder -= 2 };
		} else if (direction == 'right') {
			rudder += 1;
			if (rudder < -10) { rudder += 2 };
		};
		rudder = Math.round(rudder)/30;
		rudder = Math.min(Math.max(rudder,-1.2),1.2);
		this.rudder = rudder;
		view.updateWheel();
	};
	
	this.mooringNose = function() {
		var lowestY = Infinity, leadNose;
		for (var h=0;h<this.components.keel.stats.hulls;h++) {
			if (this.components['hull'+h] && this.components['hull'+h].nose.y < lowestY) {
				lowestY = this.components['hull'+h].nose.y;
				leadNose = this.components['hull'+h].nose;
			};
		};
		if (leadNose == undefined) {
			leadNose = {x:0,y:0};
		};
		var nosePoint = {
			x:this.x + Math.sin(this.heading) * leadNose.y * -1,
			y:this.y - Math.cos(this.heading) * leadNose.y * -1,
		};
		return nosePoint;
	};
	
	this.moored = false;
	this.anchor = {x:undefined,y:undefined,d:5};
	this.lastMoor = new Date();
	this.moor = function() {
		var now = new Date();
		if (now - this.lastMoor > 1000) {
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
					this.lastMoor = now;
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
							var color = 'red';
							if (successDist > 6) {color = 'yellow'} else if (successDist > 3) {color = 'lime'};
							view.displayAlert('Distance to mast: '+Math.round(successDist*100)/100,color);
							view.shipToTown(town);
						};
						this.logMooring();
					} else {
						this.anchor.x = nosePoint.x;
						this.anchor.y = nosePoint.y;
						this.anchor.d = 5;
					};
					if (this == game.p1ship && view.panes.course !== undefined && this.currentMap().town !== undefined && view.panes.course.x == this.currentMap().town.x && view.panes.course.y == this.currentMap().town.y) {
						view.panes.course = undefined;
					};
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
		for (var crewmate of this.crew) {
			if (crewmate.mooringLog.indexOf(currentMap.id) == -1) {
				crewmate.mooringLog.push(currentMap.id);
				var newPortHappy = 10;
				if (crewmate.traits.curious) {newPortHappy = 20};
				crewmate.addToHappylog('Recently visited a new port',newPortHappy);
				crewmate.gainXP(1);
			};
			crewmate.addToHappylog('Recently enjoyed shore leave',10);
		};
	};
	
	this.stressDamage = function() {
		if (Math.random() < 0.2) {
			view.rumble();
			var componentsArray = Object.keys(this.components);
			var damagedComponent = componentsArray[componentsArray.length * Math.random() << 0];
			this.components[damagedComponent].condition -= 0.05 * Math.random();
			if (this.components[damagedComponent].condition < 0) {
				view.displayAlert("We've lost the "+this.components[damagedComponent].name+"!");
			};
		};
	};
	
	this.damageControl = function() {
		var component;
		var crewFactor = this.getStat('damageControl');
		for (var componentKey in this.components) {
			component = this.components[componentKey];
			if (component.condition < 1) {
				component.condition += crewFactor * 0.0001;
				if (component.condition > 1) {component.condition = 1};
			};
		};
	};
	
	this.repair = function(component) {
		var cost = Math.ceil(component.cost*(1-component.condition));
		if (cost <= this.coin) {
			component.condition = 1;
			var airWrench = new Audio('audio/Air Wrench-SoundBible.com-111926242.mp3');
			airWrench.play();
			this.coin -= cost;
			view.updatePurse(game);
			view.refreshShipyardUI();
		} else {
			view.displayAlert("Repairing the "+component.name+" costs $"+cost+", and you only have $"+game.p1ship.coin+"!");
		};
	};
	
	this.outOfFuel = function() {
		game.newEvent('outOfFuel',undefined,10);
	};
	
	this.outOfCharge = function() {
		game.newEvent('outOfCharge',undefined,10);
	};
	
	this.outOfProvisions = function() {
		game.newEvent('outOfProvisions',undefined,10);
	};
	
	this.tick = function() {
		
		// AI
		if (this.npc) {
			this.ai();
		};
		
		// Consumption
		if (game.p1ship == this) {
			var power = (Math.pow(Math.abs(this.eot),2) + Math.abs(this.rudder * 0.1)) * 0.0001;
			var component, fuelConsumption=0, chargeConsumption=0, totalHarvest=0, totalRecharge=0;
			for (var componentKey in this.components) {
				component = this.components[componentKey];
				if (component) {
					if (component.stats.fuelEfficiency !== undefined) {
						fuelConsumption += power / component.stats.fuelEfficiency;
					};
					if (component.stats.chargeCapacity !== undefined) {
						chargeConsumption += power / component.stats.chargeCapacity;
					};
					if (component.stats.harvest !== undefined) {
						totalHarvest += component.stats.harvest * 0.00001;
					};
					if (component.stats.recharge !== undefined) {
						totalRecharge += component.stats.recharge * 0.0001;
					};
				};
			};
			this.fuel = Math.max(0,this.fuel - fuelConsumption);
			this.charge = Math.min(1,Math.max(0,this.charge - chargeConsumption + totalRecharge));
			if (this.moored == false) {
				this.provisions = Math.min(1,Math.max(0,this.provisions + totalHarvest - this.crew.length * 0.00001));
			};
			view.updateGauges();
			if (this.fuel <= 0) {this.outOfFuel()};
			if (this.charge <= 0) {this.outOfCharge()};
			if (this.provisions <= 0) {this.outOfProvisions()};
		};
		
		// Telemetry
		var oldX = this.x, oldY = this.y;
		if (this.fuel > 0 && this.charge > 0) {
			this.heading += this.getTurn() * this.rudder * 0.1;
			if (this.heading >= Math.PI * 2) {
				this.heading -= Math.PI * 2;
			} else if (this.heading < 0) {
				this.heading = Math.PI * 2 - this.heading;
			};
			this.x += Math.sin(this.heading) * this.getThrust() * this.eot * 0.1;
			this.y -= Math.cos(this.heading) * this.getThrust() * this.eot * 0.1;
		};
		
		this.x += Math.sin(this.airspeed.direction) * this.airspeed.speed;
		this.y -= Math.cos(this.airspeed.direction) * this.airspeed.speed;
		this.airspeed.speed = Math.pow(Math.pow(this.x - oldX,2)+Math.pow(this.y - oldY,2),0.5);
		this.airspeed.direction = Math.atan2( (this.x-oldX) , (oldY-this.y) );
		this.airspeed.speed *= 0.99;
		
		// Wind
		var windEffect = Math.max(0,this.getStat('profile') - this.getStat('stability'));
		var currentMap = this.currentMap();
		this.x += Math.sin(currentMap.wind.direction) * currentMap.wind.speed * windEffect * 0.25;
		this.y -= Math.cos(currentMap.wind.direction) * currentMap.wind.speed * windEffect * 0.25;
		var windTurn = currentMap.wind.direction - this.heading;
		if (windTurn < 0) {
			windTurn = Math.PI * 2 + windTurn;
		} else if (windTurn > Math.PI * 2) {
			windTurn -= Math.PI*2;
		};
		var windTurnRotation = Math.PI/400 * currentMap.wind.speed * windEffect;
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
			this.damageControl();
			if (this.eot > 1 || this.eot < -0.75 || this.airspeed.speed > this.getTopSpeed() ) {
				this.stressDamage();
			};
			this.checkMapUpdate();
			for (var crewmate of this.crew) {
				crewmate.tick();
			};
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
		
		this.coin -= Math.floor(game.localPrice(commodityKey)*game.p1ship.discount('commodity'));
		
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
	
	this.postCrewmate = function(crewmate,posting) {
		if (Object.keys(this.postings).indexOf(posting) !== -1) {
			for (var potential in this.postings) {
				if (this.postings[potential] == crewmate) {
					this.postings[potential] = undefined;
				} else if (this.postings[potential] !== undefined && this.postings[potential].construtor == 'Array') {
					this.postings[potential].splice(this.postings[potential].indexOf(crewmate),1);
				};
			};
			var incumbent = this.postings[posting];
			if (incumbent == undefined) {
				this.postings[posting] = crewmate;
			} else if (incumbent.length == undefined) {
				this.postings.operations.push(incumbent);
				incumbent.posting = 'operations';
				this.postings[posting] = crewmate;
			} else {
				this.postings[posting].push(crewmate);
			};
			crewmate.posting = posting;
		};
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

function Crewmate(level) {
	if (level == undefined) {level = 10};
	
	var firstbits = ['jon','tom','will','rich','rick','rob','edw','hen','jame','fran','nich','mat','christ','ant','sam','an','liz','beth','jo','al','marg','ell','isab','mar','prud','perc'];
	var middlebits = ['a','e','o','s','z'];
	var lastbits = ['bell','bella','bello','ice','en','ence','ival','aret','as','iam','ard','ert','in','ry','rietta','son','dottir','skid','cis','las','thew','ia','uel','iel','ael','und','drew','a','beth','bett','betta','ann','anna','et','ette','etta','ta','tha','ua'];
	var prefices = ['sher','cald','col','blake','til','grant','lang','blan','nor','north','rad','rud','south','su','sut','somer','wes','west','whit','guil','brew','church','cros','bran','brand','brin','haw','hay','kings','mel','mil','pres','gar','strat','sedg','stock','wain','wal','war','ash','bere','bark','birk','elm','farn','oak','ry','rye','saf','sal','salf','sel','wil','will','willough','york','ive','cov','dig','how','law','hol','mar','wad','sea','ather','car','fen','bever','bor','ever','cran','buck','swin','har','ram','shep','ship','wether','hart','sted','newt','ald','cad','ed','eld','ew','fitz','hal']
	var suffices = ['castle','cott','croft','court','by','worth','ham','ford','shire','bury','ton','vell','berry','hurst','bert','olf','et','don','tle','ey','key','sey','more','land','wood','ell','man','mon','ond','rich','rick','son','und','web','wright','son','dottir','skid','ton','on']
	var middles = ['by','rock','rox','stan','cam','brad','bridg','bridge','brig','chester','kirk','burg','wick','bed','swain','well','thorn','thorne','drake','cok','bram','bain','water','beck','borne','burn','clay','cliff','burl','dun','hill','lake','ley','mont','brent','lin','ridge','ridg','dale','del','den','fisk','hund','hard','ward','win']
	prefices = prefices.concat(middles);
	suffices = suffices.concat(suffices);
	
	this.name = '';
	this.name += view.capitalize(firstbits[firstbits.length * Math.random() << 0]);
	if (Math.random() < 0.2) {this.name += middlebits[middlebits.length * Math.random() << 0];};
	this.name += lastbits[lastbits.length * Math.random() << 0];
	this.name += ' ';
	this.name += view.capitalize(prefices[prefices.length * Math.random() << 0]);
	if (Math.random() > 0.5) {
		this.name += middles[middles.length * Math.random() << 0];
	};
	this.name += suffices[suffices.length * Math.random() << 0];
	
	this.id = this.name.replace(/ /g,'');
	
	this.happylog = [];
	
	this.stats = {};
	for (var statName of ['engineering','fisticuffs','haggling','hospitality','loadmastery','piloting']) {
		this.stats[statName] = 0;
	};
	var statList = Object.keys(this.stats);
	for (var i=0;i<level;i++) {
		statName = statList[statList.length * Math.random() << 0];
		this.stats[statName]++;
	};
	
	this.traits = {};
	for (var i=0;i<3;i++) {
		var availableTraits = Object.keys(data.traits);
		var traitName = availableTraits[availableTraits.length * Math.random() << 0];
		if (this.traits[traitName] == undefined) {
			this.traits[traitName] = true;
		};
	};
	
	this.posting = 'operations';
	this.pay = 0;
	
	this.xp = 0;
	this.mooringLog = [];
	
	this.body = new MorfologyBody(this.id);
	for (var garment of this.body.garments) {
		garment.red = (garment.red + 0.5 ) / 2;
		garment.blue = (garment.blue + 0.5 ) / 2;
		garment.green = (garment.green + 0.5 ) / 2;
	};
	this.body.garments[0].garmentTop = 0;
	
	// Functions
	
	this.tick = function() {
		var expendedItems = [];
		for (var item of this.happylog) {
			if (item.value > 0) {
				item.value -= item.ablation;
				if (item.value <= 0) {
					expendedItems.push(item);
				};
			} else {
				item.value += item.ablation;
				if (item.value >= 0) {
					expendedItems.push(item);
				};
			};
		};
		for (item of expendedItems) {
			this.happylog.splice(this.happylog.indexOf(item),1);
		};
	};
	
	this.traitPose = function() {
		var traitArray = Object.keys(this.traits);
		var pose = traitArray[traitArray.length * Math.random() << 0];
		if (this.body.library[pose] == undefined) {
			pose = 'hello';
		};
		this.body.adoptPose(pose);
	};
	this.traitPose();
	
	this.addToHappylog = function(label,value,ablation) {
		if (ablation == undefined) {ablation = 0.001};
		this.happylog.push({label:label,value:value,ablation:ablation,datestamp:new Date()});
	};
	this.addToHappylog('Recently joined the crew',50);
	
	this.happiness = function(readout) {
		var array = [];
		if (game.p1ship.provisions > 0.5) {
			array.push({label:'Full Larder',value:25});
		} else if (game.p1ship.provisions > 0.25) {
			array.push({label:'Sufficient Provisions',value:10});
		};
		if (game.p1ship.availableCargoSpace() < game.p1ship.getStat('cargo') * 10 * 0.1 || game.p1ship.availableCargoLift < game.p1ship.getStat('lift') * 100 * 0.1) {
			array.push({label:'Full Cargo Bay',value:10});
		};
		var now = game.clock.time;
		for (var item of this.happylog) {
			array.push(item);
		};
		if (readout) {
			return array;
		} else {
			var totalHappiness = 0;
			for (var item of array) {
				totalHappiness += item.value;
			};
			return Math.min(1,totalHappiness/100);
		};
	};
	
	this.nextLevel = function() {
		var currentLevel = 0;
		for (var statName in this.stats) {
			currentLevel += this.stats[statName];
		};
		return (currentLevel - 9) * 3;
	};
	
	this.gainXP = function(num) {
		this.xp += num;
		if (this.xp >= this.nextLevel()) {
			game.newEvent('levelUp',[this.id],undefined,'UIxp');
		};
	};
	
	this.levelUp = function(statName) {
		this.xp -= this.nextLevel();
		this.stats[statName]++;
		view.displayAlert(this.name + " levels up " + statName + " to " + this.stats[statName] + "!",'cyan');
	};
	
	this.drink = function() {
		var num = 20;
		if (this.traits.tippler) {
			num = 50;
		} else if (this.traits.teetotaler) {
			num = 1;
		};
		this.addToHappylog('Captain recently bought a round',num);
	};
	
	this.recruitDialogue = function(tavern,drink) {
		var dialogue;
		if (tavern.atTheBar.lastDialogue == undefined) {
			dialogue = "Hello, my name is "+this.name+", and I am interested in signing onto a zeppelin.  Might you know of one that is hiring crew?";
			dialogue += "  I'd need a ship that offers at least $"+this.hireCost(tavern)+" pay up front.";
		} else {
			var revealChance = 0.2 + tavern.atTheBar.drinkCount * 0.1;
			if (drink) {revealChance = 1};
			var dialogueOptions = [];
			if (Math.random() < revealChance) {
				var revealOptions = Object.keys(this.stats).concat(Object.keys(this.traits));
				for (key in tavern.atTheBar.revelations) {
					if (revealOptions.indexOf(key) !== -1) {
						revealOptions.splice(revealOptions.indexOf(key),1);
					};
				};
				var revelation = revealOptions[revealOptions.length * Math.random() << 0];
				tavern.atTheBar.revelations[revelation] = true;
				if (Object.keys(this.stats).indexOf(revelation) !== -1 && this.stats[revelation] == 0) {
					dialogueOptions = ["I should tell you now that I have zero experience in "+revelation+"."];
				} else if (Object.keys(this.stats).indexOf(revelation) !== -1) {
					dialogueOptions = [
						"I've trained for working in "+revelation+".",
						"I have some experience with "+revelation+".",
					];
				} else {
					if (data.traits[revelation].pos == 'noun') {
						dialogueOptions = ["Gotta tell you, I'm a bit of a "+data.traits[revelation].displayName+".  I hope that won't be a problem.",];
					} else {
						dialogueOptions = ["Gotta tell you, I'm a bit "+data.traits[revelation].displayName+".  I trust that won't be a problem.",];
					};
				};
			} else {
				var randomTown = game.townList[game.townList.length * Math.random() << 0].name;
				dialogueOptions = [
					"Have you ever noticed that the secret to pronouncing most people's names is knowing which letters to pretend aren't there?",
					"Have you ever been to "+randomTown+"?  Lovely place.",
					"Have you ever been to "+randomTown+"?  Nice place to visit; wouldn't want to live there.",
					"Do you have any plans to head towards "+randomTown+"?",
					"Honestly, I'm just eager to get out of this town.",
					"You seem like you run a pleasant crew.",
				];
			};
			dialogue = dialogueOptions[dialogueOptions.length * Math.random() << 0];
		};
		return dialogue;
	};
	
	this.hireCost = function(tavern) {
		var hireCost = this.nextLevel() * 10;
		if (this.traits.tippler) {
			hireCost -= tavern.atTheBar.drinkCount * 10
		};
		return Math.max(0,hireCost);
	};
	
	this.hire = function(tavern) {
		var hireCost = this.hireCost(tavern);
		this.pay -= hireCost;
		game.p1ship.coin -= hireCost;
		view.updatePurse(game);
		game.p1ship.crew.push(this);
		this.addToHappylog('Recently joined the crew',50);
		tavern.atTheBar = undefined;
		view.maximizeCrewPane();
		view.displayCrewmate(this);
	};
}

function Component(type,tier) {
	var commonComponents = ['hull','engine','motor','gasbag','quarters','stabilizer','topDeck','fin','tailboom','cargobay'];
	var rareComponents = ['keel','battery','solarPanels','garden','loader'];
	var allComponents = commonComponents.concat(rareComponents.concat(commonComponents));
	if (type == undefined) {
		type = allComponents[allComponents.length * Math.random() << 0];
	} else if (type == 'common') {
		type = commonComponents[commonComponents.length * Math.random() << 0];
	} else if (type == 'rare') {
		type = rareComponents[rareComponents.length * Math.random() << 0];
	};
	if (tier == undefined) {tier = 1 + Math.random() * Math.random() * 10 << 0};
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
		this.slotType = 'keel';
		stats.push('hulls','drag');
		weight = 1;
		cost = 2000;
		nouns = ['Aluminum Keel','Duralumin Keel','Aerogel Keel','Graphene Keel','Aerographite Keel','Carbon Nanotube Keel','Diamond Nanothread Keel'];
	} else if (type == 'hull') {
		this.slotType = 'hull';
		stats.push('internalSlots','externalSlots','topSlots','drag');
		weight = 1.5;
		cost = 2000;
		nouns = ['Courier Hull','Ultralight Hull','Yacht Hull','Corvette Hull','Akron Hull','Argosy Hull','Workhorse Hull','Thunderhead Hull','Titan Hull','Colossus Hull'];
	} else if (type == 'engine') {
		this.slotType = 'int';
		stats.push('thrust','fuelEfficiency');
		weight = 1;
		cost = 1000;
		nouns = ['Two-Piston Engine','Four-Piston Engine','Six-Piston Engine','Eight-Piston Engine','Rotary Engine'];
	} else if (type == 'battery') {
		this.slotType = 'int';
		stats.push('thrust','chargeCapacity');
		weight = 1;
		cost = 1000;
		nouns = ['Nickel-Cadmium Battery','Lithium Ion Battery','Dual Carbon Battery','Germanium Air Battery','Molten Salt Battery','Polymer Battery','Flow Battery','Organic Radical Battery','Fuel Cell','Ultrabattery'];
	} else if (type == 'motor') {
		this.slotType = 'ext';
		stats.push('thrust','turn','lift','drag');
		weight = 0.8;
		cost = 300;
		nouns = ['Prop','Contraprop','Proprotor','Ducted Fan','Turboprop','Turbojet','Turbofan','Propfan','Ramjet','Scramjet'];
	} else if (type == 'gasbag') {
		this.slotType = 'int';
		stats.push('lift');
		weight = 0.1;
		cost = 200;
		nouns = ['Tarbag','Rubberbag','Silk Bag','Spidersilk Bag'];
	} else if (type == 'quarters') {
		this.slotType = 'int';
		stats.push('amenities');
		weight = 0.5;
		cost = 2000;
		nouns = ['Bunks','Cells','Cabins','Suites'];
	} else if (type == 'stabilizer') {
		this.slotType = 'ext';
		stats.push('stability','drag');
		weight = 0.2;
		cost = 100;
		nouns = ['Stabilizer','Trimfin','Canard'];
	} else if (type == 'solarPanels') {
		this.slotType = 'top';
		stats.push('recharge');
		weight = 0.2;
		cost = 2000;
		nouns = ['Charge Panels','Solar Collectors','Solar Plant'];
	} else if (type == 'topDeck') {
		this.slotType = 'top';
		stats.push('amenities');
		weight = 0.1;
		cost = 300;
		nouns = ['Deck','Observation Dome'];
	} else if (type == 'fin') {
		this.slotType = 'top';
		stats.push('stability','drag');
		weight = 0.2;
		cost = 100;
		nouns = ['Fin','Rudder','Dorsal'];
	} else if (type == 'tailboom') {
		this.slotType = 'top';
		stats.push('lift','stability','drag');
		weight = 0.3;
		cost = 300;
		nouns = ['Tailboom'];
	} else if (type == 'garden') {
		this.slotType = 'top';
		stats.push('harvest','amenities','drag');
		weight = 0.5;
		cost = 300;
		nouns = ['Garden','Greenhouse','Hothouse','Aeroponics Station','Terrace','Top Park'];
	} else if (type == 'cargobay') {
		this.slotType = 'int';
		stats.push('cargo','loadTime');
		weight = 0.1;
		cost = 500;
		nouns = ['Cargo Bay'];
	} else if (type == 'loader') {
		this.slotType = 'int';
		stats.push('cargo','loadTime');
		weight = 0.1;
		cost = 100;
		nouns = ['Winch','Crane'];
	};
	stats.push('weight');
	var value = 0;
	for (var statName of stats) {
		this.stats[statName] = 0;
		for (var i=0;i<tier;i++) {
			this.stats[statName] += Math.random()*0.9+0.1;
		};
		if (statName == 'weight' || statName == 'drag') {
			value += tier - this.stats[statName];
		} else {
			value += this.stats[statName];
		};
		if (statName == 'hulls') {
			this.stats[statName] = Math.ceil(this.stats[statName]);
			this.stats[statName] = Math.min(this.stats[statName],5);
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
	this.name += nouns[nouns.length*(tier-1)/10 << 0];
	
	this.paintCost = cost;
	
	value /= stats.length;
	value /= tier;
	this.cost = Math.floor(cost * tier * value);
};

var gamenEventPointers = {
	tick: function() {
		game.clock.logEventIn(1,'tick');
		game.tick();
	},
	
	windChange: function() {
		game.clock.logEventIn(Math.random() * 500000 + 500000,'windChange');
		game.windChange();
	},
};

var data = {

	traits: {
		curious: {displayName: 'Curious',pos:'adjective'},
		gamer: {displayName: 'Gamer',pos:'noun'},
		gregarious: {displayName: 'Gregarious',pos:'adjective'},
		greenThumb: {displayName: 'Green Thumb',pos:'noun'},
		hothead: {displayName: 'Hothead',pos:'noun'},
		hunter: {displayName: 'Hunter',pos:'noun'},
		painter: {displayName: 'Painter',pos:'noun'},
		pious: {displayName: 'Pious',pos:'adjective'},
		poet: {displayName: 'Poet',pos:'noun'},
		rake: {displayName: 'Rake',pos:'noun'},
		scholar: {displayName: 'Scholar',pos:'noun'},
		skeptic: {displayName: 'Skeptic',pos:'noun'},
		tinker: {displayName: 'Tinker',pos:'noun'},
		teetotaler: {displayName: 'Teetotaler',pos:'noun'},
		tippler: {displayName: 'Tippler',pos:'noun'},
	}
};

var events = {
	help: {
		execute: function(event) {
			if (game !== undefined && event !== undefined) {
				game.removeEvent(event);
			};
			var windowContents = {
				title: 'How the Blazes Do I Fly This Thing?',
				paragraphs: [
					"<strong>Steering:</strong> 'A' and 'D' or &larr; and &rarr; to steer left and right.  Zeppelins employ <em>powered turns</em>, setting the motors on one side to forward and the motors on the other side to reverse (or adjusts them if also under forward or reverse thrust).  The ship does not turn by means of flaps or control surfaces, so your air speed has no impact on your turn rate.",
					"<strong>Throttle:</strong> 'W' and 'S' or &uarr; and &darr; to adjust the chadburn, on the right.  This informs the engine room as to how much thrust to deliver, and in which direction.  Thrust in excess of Full Ahead or Half Astern may sometimes be necessary but will damage the engines, motors, and the rest of the ship.",
					"<strong>Mooring:</strong> 'L' or 'X' will drop a mooring line and landing party to fix the ship in place.  Drop your mooring line while the nose of the ship is within a mooring tower's target circle to moor at the tower and visit the town.  'X' and 'L' will also release the mooring line when you ready to move on.",
					"<strong>Map:</strong> 'M' will toggle the minimap in the upper left corner.  Click on the name of a town to set a course; this will display a bearing marker showing you which direction the town is in.",
					"<strong>Pause:</strong> The spacebar will pause and unpause the game.",
				],
			};
			var div = view.windowObjectToDiv(windowContents);
			var buttonArray = [];
			buttonArray.push({label:"Let's Do This!",execute:view.dismissWindow});
			buttonArray.push({label:"Tell Me More",execute:events.help.more});
			view.displayWindow(div,buttonArray);
		},
		resolve: function(event) {
			game.removeEvent(event);
		},
		more: function() {
			view.dismissWindow();
			var windowContents = {
				title: 'Advanced Pretend Airship Flying',
				paragraphs: [
					"<strong>Wind:</strong> Wind is the airship pilot's constant companion and enemy.  The wind gauge in the upper left corner will show you which way the wind is blowing and how hard.  Your ship will not only be pushed along by the wind, but will also slowly turn to face the wind.  To counteract this, you must steer against the wind.",
					"<strong>Speed:</strong> The speedometer near the chadburn displays your air speed: your speed in relation to the prevailing winds.  In high wind, your air speed can be very different from your ground speed.  Your ground speed can be determined by looking at the ground and seeing how fast it's moving.",
					"<strong>Gauges:</strong> The gauges on the left display the ship's Provisions, Charge, and Fuel.  Ships powered by an engine (like yours) run on Fuel and Provisions.  Ships running off a battery run on Charge and Provisions.  Some ships run on both engines and batteries.  Running any of these gauges to zero is bad news.  Resupply at the wharf of any town.",
					"<strong>Towns:</strong> Towns are places where you can trade goods, repair your ship, upgrade its components, and even knock back a few at the local tavern.",
					"<strong>Crew:</strong> Crew is not yet implemented, so don't worry about them... yet.",
				],
			};
			var div = view.windowObjectToDiv(windowContents);
			var buttonArray = [];
			buttonArray.push({label:"Let's Do This!",execute:view.dismissWindow});
			view.displayWindow(div,buttonArray);
		},
	},
	
	levelUp: {
		execute: function(event) {
			if (view.panes.crew == 'maximized') {view.minimizeCrewPane()};
			var leveler = events.levelUp.leveler(event);
			var optionsArray = events.levelUp.options(leveler);
			var windowContents = {
				title: leveler.name + " Levels Up!",
				paragraphs: [
					'Through hard work, determination, and a large helping of luck, '+leveler.name+' has survived long enough to become a better crewmate.',
					"The " + game.postings[leveler.posting].positionName + " is considering two paths of personal advancement: focusing on <strong>"+optionsArray[0]+"</strong> or on <strong>"+optionsArray[1]+"</strong>.",
					leveler.name.split(' ')[0]+ " comes to you for advice.  What is your advice?",
				],
			};
			var div = view.windowObjectToDiv(windowContents);
			var buttonArray = [
				{label:'No Advice',execute:view.dismissWindow},
				{label:optionsArray[1],execute:events.levelUp.dismissAndSelect.bind(this,leveler,optionsArray[1],event)},
				{label:optionsArray[0],execute:events.levelUp.dismissAndSelect.bind(this,leveler,optionsArray[0],event)},
			];
			view.displayWindow(div,buttonArray);
		},
		leveler: function(event) {
			var leveler;
			for (var crewmate of game.p1ship.crew) {
				if (crewmate.id == event.parameters[0]) {
					leveler = crewmate;
				};
			};
			return leveler;
		},
		options: function(crewmate) {
			var optionsArray = [];
			if (crewmate.posting == 'pilot') {
				optionsArray.push(['piloting','loadmastery'][Math.random() * 2 << 0]);
			} else if (crewmate.posting == 'chiefEngineer') {
				optionsArray.push(['engineering','haggling'][Math.random() * 2 << 0]);
			} else if (crewmate.posting == 'quartermaster') {
				optionsArray.push(['hospitality','haggling'][Math.random() * 2 << 0]);
			} else if (crewmate.posting == 'supercargo') {
				optionsArray.push(['loadmastery','haggling'][Math.random() * 2 << 0]);
			} else if (crewmate.posting == 'operations') {
				optionsArray.push(['piloting','hospitality'][Math.random() * 2 << 0]);
			} else if (crewmate.posting == 'engineering') {
				optionsArray.push(['engineering','loadmastery'][Math.random() * 2 << 0]);
			} else if (crewmate.posting == 'morale') {
				optionsArray.push(['hospitality','haggling'][Math.random() * 2 << 0]);
			} else if (crewmate.posting == 'brig') {
				optionsArray.push('haggling');
			};
			var remaining = [];
			for (var statName in crewmate.stats) {
				if (optionsArray[0] !== statName) {
					remaining.push(statName);
				};
			};
			optionsArray.push(remaining[remaining.length * Math.random() << 0]);
			return optionsArray;
		},
		resolve: function(event) {
			game.removeEvent(event);
			var leveler = events.levelUp.leveler(event);
			var optionsArray = events.levelUp.options(leveler);
			var option = optionsArray[optionsArray.length * Math.random() << 0];
			events.levelUp.select(leveler,option);
		},
		dismissAndSelect: function(crewmate,statName,event) {
			view.dismissWindow();
			if (crewmate.xp < crewmate.nextLevel() * 2 + 3) {
				game.removeEvent(event);
			};
			events.levelUp.select(crewmate,statName);
		},
		select: function(crewmate,statName) {
			crewmate.levelUp(statName);
		},
	},

	outOfFuel: {
		execute: function(event) {
			game.removeEvent(event);
			var buttonArray = [];
			var windowContents = {
				title: 'Out of Fuel!',
				paragraphs: [
					"You have run out of fuel.  (Your fuel gauge is the one marked 'F' to the left.)",
				],
			}
			if (game.p1ship.cargo.fuel !== undefined && game.p1ship.cargo.fuel > 0) {
				windowContents.paragraphs.push("Luckily, you are hauling crates of fuel.  Without other options, you order your mates to head down into the cargo hold, break open a crate, and pour the contents into the fuel tanks.  You won't be able to sell that crate, of course, but at least you can make it into port!");
				buttonArray.push({label:"Get Pourin'",execute:view.dismissWindow});
				game.p1ship.cargo.fuel--;
				game.p1ship.fuel = 1;
			} else if (game.p1ship.coin >= 1000) {
				windowContents.paragraphs.push("Without even the last-ditch option of breaking open crated fuel in the cargo bay, you have to moor on the first bit of solid ground you can find and send the crew out, <em>on foot</em>, to find a nearby town and hire somebody to bring you fuel by cart or possibly zeppelin.");
				windowContents.paragraphs.push("It's a hideously expensive proposition, and by the end of the day, your purse is lighter by a grand.");
				buttonArray.push({label:"Embarassing!",execute:view.dismissWindow});
				game.p1ship.fuel = 1;
				game.p1ship.coin -= 1000;
			} else {
				windowContents.paragraphs.push("With neither the option of breaking open crated fuel in the cargo bay nor funds to pay for fuel delivery, you'll have to moor on the first bit of solid ground you can find and send the crew out, <em>on foot</em>, to find a nearby town.");
				windowContents.paragraphs.push("Somebody will eventually be along with a cart full of fuel, but they won't come to rescue you.  They'll be coming to buy your ship, and it will be the best offer, and the only offer, you get.");
				windowContents.paragraphs.push("Your flying days are done.");
			};
			var div = view.windowObjectToDiv(windowContents);
			view.displayWindow(div,buttonArray);
		},
		resolve: function(event) {
			events.outOfFuel.execute(event);
		},
	},

	outOfProvisions: {
		execute: function(event) {
			game.removeEvent(event);
			var buttonArray = [];
			var windowContents = {
				title: 'Out of Provisions!',
				paragraphs: [
					"You have run out of provisions.  (Your provisions gauge is the one marked 'P' to the left.)",
				],
			}
			if (game.p1ship.cargo.fuel !== undefined && game.p1ship.cargo.fuel > 0) {
				windowContents.paragraphs.push("Luckily, you are hauling crates of food.  Without other options, you order your mates to head down into the cargo hold, break open a crate, and eat like royalty.  You won't be able to sell that crate, of course, but at least you won't starve!");
				buttonArray.push({label:"Let's Eat!",execute:view.dismissWindow});
				game.p1ship.cargo.food--;
				game.p1ship.provisions = 1;
			} else if (game.p1ship.coin >= 500) {
				windowContents.paragraphs.push("Without even the last-ditch option of breaking open crated food in the cargo bay, you have to moor on the first bit of solid ground you can find and send the crew out, <em>on foot</em>, to find a nearby town and hire somebody to bring you food by cart or possibly zeppelin.");
				windowContents.paragraphs.push("It's a hideously expensive proposition, and the farmer who comes to bail you out happily takes $500 for his trouble... and load of fresh produce.");
				buttonArray.push({label:"Embarassing!",execute:view.dismissWindow});
				game.p1ship.provisions = 1;
				game.p1ship.coin -= 500;
			} else {
				windowContents.paragraphs.push("With neither the option of breaking open crated food in the cargo bay nor funds to pay for food delivery, you have to moor on the first bit of solid ground you can find and send the crew out, <em>on foot</em>, to whatever nearby town they can find.");
				windowContents.paragraphs.push("They won't come back.");
				windowContents.paragraphs.push("Somebody will eventually be along with a cart full of new crewmates and crates of provisions, but they won't come to rescue you.  They'll be coming to buy your ship, and it will be the best offer, and the only offer, you get.");
				windowContents.paragraphs.push("Your flying days are done.");
			};
			var div = view.windowObjectToDiv(windowContents);
			view.displayWindow(div,buttonArray);
		},
		resolve: function(event) {
			events.outOfProvisions.execute(event);
		},
	},

	outOfCharge: {
		execute: function(event) {
			game.removeEvent(event);
			var buttonArray = [];
			var windowContents = {
				title: 'Out of Charge!',
				paragraphs: [
					"Your batteries have run out of charge.  (Your charge gauge is the one marked 'C' to the left.)",
				],
			}
			if (game.p1ship.cargo.fuel !== undefined && game.p1ship.cargo.fuel > 0) {
				windowContents.paragraphs.push("Luckily, you do have functioning solar panels, so all you really need to do is moor somewhere safe and wait until the batteries are charged up again.");
				buttonArray.push({label:"Sunbathing Time!",execute:view.dismissWindow});
			} else if (game.p1ship.coin >= 2000) {
				windowContents.paragraphs.push("Without functioning solar panels, you have to moor on the first bit of solid ground you can find and send the crew out, <em>on foot</em>, to find a nearby town and hire somebody to bring you charged-up batteries, either by cart or more probably by zeppelin.");
				windowContents.paragraphs.push("It's a hideously expensive proposition, and when your rescuers arrive, you have to shell out $2000 to get back in the sky.");
				buttonArray.push({label:"Embarassing!",execute:view.dismissWindow});
				game.p1ship.charge = 1;
				game.p1ship.coin -= 2000;
			} else {
				windowContents.paragraphs.push("With neither functioning solar panels nor funds to pay for battery delivery, you have to moor on the first bit of solid ground you can find and send the crew out, <em>on foot</em>, to whatever nearby town they can find.");
				windowContents.paragraphs.push("They won't come back.");
				windowContents.paragraphs.push("Somebody will eventually be along with a cart full of new crewmates and fresh batteries, but they won't come to rescue you.  They'll be coming to buy your ship, and it will be the best offer, and the only offer, you get.");
				windowContents.paragraphs.push("Your flying days are done.");
			};
			var div = view.windowObjectToDiv(windowContents);
			view.displayWindow(div,buttonArray);
		},
		resolve: function(event) {
			events.outOfCharge.execute(event);
		},
	},
};