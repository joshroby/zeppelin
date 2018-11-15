var view = {
	
	gameTitle: 'Zeppel Endless',

	options: {
		scoreDisplay: 'VPS',
	},
	
	r2d: function(radians) {
		return radians * 180 / Math.PI;
	},
	
	setHref: function(element,href,external) {
		var string = '#'+href;
		if (external) {
			string = href;
		};
		element.setAttribute('href',string);
		element.setAttributeNS('http://www.w3.org/1999/xlink','xlink:href',string);
	},

	gameDivContents: function() {
		
		var svgDiv = document.createElement('div');
		svgDiv.id = 'svgDiv';
	
		var svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
		svg.id = 'gameSVG';
		svg.setAttribute('viewBox','-100 -61.5 200 123');
		svgDiv.appendChild(svg);
		
		var defs = document.createElementNS('http://www.w3.org/2000/svg','defs');
		defs.id = 'globalDefs';
		svg.appendChild(defs);
		
		var hex = document.createElementNS('http://www.w3.org/2000/svg','polygon');
		hex.id = 'tileHex';
		defs.appendChild(hex);
		hex.setAttribute('stroke','inherit');
		hex.setAttribute('stroke-width','inherit');
		hex.setAttribute('fill','inherit');
		hex.setAttribute('points','0,100 87.5,50 87.5,-50 0,-100 -87.5,-50 -87.5,50');
		hex.setAttribute('transform','scale(2.01)');
		
		var weeds = document.createElementNS('http://www.w3.org/2000/svg','g');
		defs.appendChild(weeds);
		weeds.id = 'weeds';
		weeds.setAttribute('stroke','black');
		var polygon = document.createElementNS('http://www.w3.org/2000/svg','polygon');
		polygon.setAttribute('points','-2,2 2,2 3,-1 1,0 0,-2 -1,0 -3,-1 -2,2');
		polygon.setAttribute('stroke','black');
		polygon.setAttribute('stroke-linejoin','round');
		weeds.appendChild(polygon);
		
		var hill = document.createElementNS('http://www.w3.org/2000/svg','g');
		defs.appendChild(hill);
		hill.id = 'hill';
		var ridge = 'M -10 0 Q -8,-1 -6,0 T -3,0 T 1,0 T 5,0 T 10,0 ';
		var shadowPath = ridge + 'C 2.5,2.5 2.5,5 0,5 S -2.5,2.5 -10,0 z';
		var highlightPath = ridge + 'C 2.5,-2.5 2.5,-5 0,-5 S -2.5,-2.5 -10,0 z';
		var shadow = document.createElementNS('http://www.w3.org/2000/svg','path');
		hill.appendChild(shadow);
		shadow.setAttribute('fill','black');
		shadow.setAttribute('opacity',0.2);
		shadow.setAttribute('d',shadowPath);
		var highlight = document.createElementNS('http://www.w3.org/2000/svg','path');
		hill.appendChild(highlight);
		highlight.setAttribute('fill','white');
		highlight.setAttribute('opacity',0.2);
		highlight.setAttribute('d',highlightPath);
		
		var sandbar = document.createElementNS('http://www.w3.org/2000/svg','path');
		defs.appendChild(sandbar);
		sandbar.id = 'sandbar';
		sandbar.setAttribute('fill','gold');
		var d = 'M -10,0 Q -10,-2 -7,-2 T -4,-3 T 0,-1 T 3,-2 T 6,-3 T 8,-2 T 10,0';
		d += 'T 7,3 T 5,2 T4,2 T 1,3 T -2,2 T -5,3 T -8,2 T -10,0 z';
		sandbar.setAttribute('d',d);
		
		// Ship Defs

		var defaultShip = document.createElementNS('http://www.w3.org/2000/svg','g')
		defs.appendChild(defaultShip);
		defaultShip.id = 'defaultShip';
		defaultShip.setAttribute('fill','grey');
		defaultShip.setAttribute('stroke-width',0.5);
		var ellipse = document.createElementNS('http://www.w3.org/2000/svg','ellipse');
		ellipse.setAttribute('cx',0);
		ellipse.setAttribute('cy',0);
		ellipse.setAttribute('rx',1.5);
		ellipse.setAttribute('ry',4);
		ellipse.setAttribute('fill','grey');
		ellipse.setAttribute('stroke','black');
		defaultShip.appendChild(ellipse);
		var tailboom = document.createElementNS('http://www.w3.org/2000/svg','polygon');
		var points = "0,2 3.25,3 3.25,4.25 0,4 -3.25,4.25 -3.25,3";
		tailboom.setAttribute('points',points);
		tailboom.setAttribute('fill','grey');
		tailboom.setAttribute('stroke','black');
		defaultShip.appendChild(tailboom);	
		var ellipse = document.createElementNS('http://www.w3.org/2000/svg','ellipse');
		ellipse.setAttribute('cx',2);
		ellipse.setAttribute('cy',3);
		ellipse.setAttribute('rx',0.5);
		ellipse.setAttribute('ry',1.5);
		ellipse.setAttribute('fill','grey');
		ellipse.setAttribute('stroke','black');
		defaultShip.appendChild(ellipse);
		var ellipse = document.createElementNS('http://www.w3.org/2000/svg','ellipse');
		ellipse.setAttribute('cx',-2);
		ellipse.setAttribute('cy',3);
		ellipse.setAttribute('rx',0.5);
		ellipse.setAttribute('ry',1.5);
		ellipse.setAttribute('fill','grey');
		ellipse.setAttribute('stroke','black');
		defaultShip.appendChild(ellipse);
		
		var cloud = document.createElementNS('http://www.w3.org/2000/svg','ellipse');
		defs.appendChild(cloud);
		cloud.id = 'cloud';
		cloud.setAttribute('fill','white');
		cloud.setAttribute('rx',10);
		cloud.setAttribute('ry',14);
		
		// UI Defs

		var eotBracket = document.createElementNS('http://www.w3.org/2000/svg','g');
		defs.appendChild(eotBracket);
		eotBracket.id = 'eotBracket';
		eotBracket.setAttribute('fill','goldenrod');
		eotBracket.setAttribute('stroke','darkgoldenrod');
		var eotHandle = document.createElementNS('http://www.w3.org/2000/svg','rect');
		eotBracket.appendChild(eotHandle);
		eotHandle.setAttribute('x',-7);
		eotHandle.setAttribute('y',-2);
		eotHandle.setAttribute('width',5);
		eotHandle.setAttribute('height',4);
		var eotBall = document.createElementNS('http://www.w3.org/2000/svg','circle');
		eotBracket.appendChild(eotBall);
		eotBall.setAttribute('cx',-7);
		eotBall.setAttribute('r',3);
		var eotFlange = document.createElementNS('http://www.w3.org/2000/svg','polygon');
		eotBracket.appendChild(eotFlange);
		var points = "0,0 5,5 25,5 25,8 -3,8 -3,-8 25,-8 25,-5 5,-5";
		eotFlange.setAttribute('points',points);
		
		var shipsWheel = document.createElementNS('http://www.w3.org/2000/svg','g');
		defs.appendChild(shipsWheel);
		shipsWheel.id = 'shipsWheel'
		shipsWheel.setAttribute('fill','saddlebrown');
		shipsWheel.setAttribute('stroke','black');
		shipsWheel.setAttribute('stroke-linejoin','round');
		var d = 'M0 0 h-1 l-1 24 '
		d += 'q 1 0 1 1 t -1 1 q 0 4 2 4 ';
		d += 't 2 -4 q -1 0 -1 -1 t 1 -1';
		d += ' l-1 -24 z';
		for (var i=0;i<8;i++) {
			var path = document.createElementNS('http://www.w3.org/2000/svg','path');
			shipsWheel.appendChild(path);
			path.setAttribute('d',d);
			path.setAttribute('transform','rotate('+(i*45)+')');
		};
		var axle = document.createElementNS('http://www.w3.org/2000/svg','circle');
		shipsWheel.appendChild(axle);
		axle.setAttribute('r',5);
		var rim = document.createElementNS('http://www.w3.org/2000/svg','circle');
		shipsWheel.appendChild(rim);
		rim.setAttribute('r',20);
		rim.setAttribute('stroke-width',3);
		rim.setAttribute('stroke','saddlebrown');
		rim.setAttribute('fill','none');
		var rimOutsideStroke = document.createElementNS('http://www.w3.org/2000/svg','circle');
		shipsWheel.appendChild(rimOutsideStroke);
		rimOutsideStroke.setAttribute('r',22);
		rimOutsideStroke.setAttribute('fill','none');
		rimOutsideStroke.setAttribute('stroke','black');
		var rimInsideStroke = document.createElementNS('http://www.w3.org/2000/svg','circle');
		shipsWheel.appendChild(rimInsideStroke);
		rimInsideStroke.setAttribute('r',18);
		rimInsideStroke.setAttribute('fill','none');
		rimInsideStroke.setAttribute('stroke','black');
		var d = 'm -4 -22.5 l 6 5 h 2 l -6 -5 z';
		var ropeMark = document.createElementNS('http://www.w3.org/2000/svg','path');
		shipsWheel.appendChild(ropeMark);
		ropeMark.setAttribute('fill','blue');
		ropeMark.setAttribute('stroke-width',2);
		ropeMark.setAttribute('paint-order','stroke');
		ropeMark.setAttribute('stroke-linejoin','round');
		ropeMark.setAttribute('d',d);

		// Layers
		var landscapeGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
		landscapeGroup.id = 'landscapeGroup';
		svg.appendChild(landscapeGroup);
		
		var shipsGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
		shipsGroup.id = 'shipsGroup';
		svg.appendChild(shipsGroup);
		
		var uiGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
		uiGroup.id = 'uiGroup';
		svg.appendChild(uiGroup);
		
		return [svgDiv];
	},
	
	initMap: function(maps) {
	
		// Clear Map
		var landscapeGroup = document.getElementById('landscapeGroup');
		landscapeGroup.innerHTML = '';
		
		for (var map of maps) {
			map.populateClouds();
			view.addMap(map);			
		};
	},
	
	addMap: function(map) {
		var sectionGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
		landscapeGroup.appendChild(sectionGroup);
		sectionGroup.id = map.id;
	
		// Background
		var backgroundTile = document.createElementNS('http://www.w3.org/2000/svg','use');
		sectionGroup.appendChild(backgroundTile);
		backgroundTile.setAttribute('fill',map.backgroundColor);
		backgroundTile.setAttribute('x',map.x);
		backgroundTile.setAttribute('y',map.y);
		view.setHref(backgroundTile,'tileHex');

		// Landmarks
		for (var landmark of map.landmarks) {
			var landmarkUse = document.createElementNS('http://www.w3.org/2000/svg','use');
			landmarkUse.setAttribute('x',landmark.x);
			landmarkUse.setAttribute('y',landmark.y);
			landmarkUse.setAttribute('fill',landmark.fill);
			view.setHref(landmarkUse,landmark.glyph);
			sectionGroup.appendChild(landmarkUse);
		};
		
		view.updatePlayerMap(map);
	},
	
	initUI: function(ship) {
		var uiGroup = document.getElementById('uiGroup');
		uiGroup.innerHTML = '';
		
		var rumbleGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
		uiGroup.appendChild(rumbleGroup);
		var rumbleAnimation = document.createElementNS('http://www.w3.org/2000/svg','animateTransform');
		rumbleGroup.appendChild(rumbleAnimation);
		rumbleAnimation.id = 'rumbleAnimation';
		rumbleAnimation.setAttribute('attributeName','transform');
		rumbleAnimation.setAttribute('attributeType','XML');
		rumbleAnimation.setAttribute('type','rotate');
		rumbleAnimation.setAttribute('from','0');
		rumbleAnimation.setAttribute('to','2');
		rumbleAnimation.setAttribute('dur','0.01s');
		rumbleAnimation.setAttribute('begin','indefinite');
		var rumbleAnimation = document.createElementNS('http://www.w3.org/2000/svg','animateTransform');
		rumbleGroup.appendChild(rumbleAnimation);
		rumbleAnimation.id = 'rumbleAnimation2';
		rumbleAnimation.setAttribute('attributeName','transform');
		rumbleAnimation.setAttribute('attributeType','XML');
		rumbleAnimation.setAttribute('type','rotate');
		rumbleAnimation.setAttribute('from','2');
		rumbleAnimation.setAttribute('to','0');
		rumbleAnimation.setAttribute('dur','0.01s');
		rumbleAnimation.setAttribute('begin','rumbleAnimation.end');
		
		var eotGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
		rumbleGroup.appendChild(eotGroup);
		var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		rect.setAttribute('x',83.5);
		rect.setAttribute('y',1);
		rect.setAttribute('width',20);
		rect.setAttribute('height',65);
		rect.setAttribute('fill','saddlebrown');
		rect.setAttribute('stroke','black');
		rect.setAttribute('stroke-width',0.5);
		eotGroup.appendChild(rect);
		var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		rect.setAttribute('x',85);
		rect.setAttribute('y',3);
		rect.setAttribute('width',17);
		rect.setAttribute('height',65);
		rect.setAttribute('fill','gainsboro');
		rect.setAttribute('stroke','black');
		rect.setAttribute('stroke-width',0.5);
		eotGroup.appendChild(rect);
		var speedNames = ['Flank Speed','Full Ahead','Half Ahead','Slow Ahead','Full Stop','Slow Astern','Half Astern','Full Astern'];
		for (var i=0;i<speedNames.length;i++) {
			var speedGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
			eotGroup.appendChild(speedGroup);
			var text = document.createElementNS('http://www.w3.org/2000/svg','text');
			text.setAttribute('x',93);
			text.setAttribute('y',7 + i*7);
			text.setAttribute('font-size',2);
			text.setAttribute('paint-order','stroke');
			text.setAttribute('text-anchor','middle');
			text.innerHTML = speedNames[i];
			speedGroup.appendChild(text);
		};
		var eotBracket = document.createElementNS('http://www.w3.org/2000/svg','use');
		eotBracket.id = 'uiEOTBracket';
		eotGroup.appendChild(eotBracket);
		eotBracket.setAttribute('x',85);
		eotBracket.setAttribute('y',34);
		view.setHref(eotBracket,'eotBracket');

		var wheel = document.createElementNS('http://www.w3.org/2000/svg','use');
		view.setHref(wheel,'shipsWheel');
		wheel.id = 'uiWheel';
		rumbleGroup.appendChild(wheel);
		wheel.setAttribute('y',62);
		wheel.setAttribute('transform','translate(0 62) rotate('+view.r2d(ship.rudder)+') translate(0 -62)');
		
		var airspeedCasingRect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		rumbleGroup.appendChild(airspeedCasingRect);
		airspeedCasingRect.setAttribute('x',67);
		airspeedCasingRect.setAttribute('y',55);
		airspeedCasingRect.setAttribute('rx',2);
		airspeedCasingRect.setAttribute('ry',2);
		airspeedCasingRect.setAttribute('width',20);
		airspeedCasingRect.setAttribute('height',20);
		airspeedCasingRect.setAttribute('fill','saddlebrown');
		airspeedCasingRect.setAttribute('stroke','black');
		var airspeedRect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		rumbleGroup.appendChild(airspeedRect);
		airspeedRect.setAttribute('x',69);
		airspeedRect.setAttribute('y',57.5);
		airspeedRect.setAttribute('width',16);
		airspeedRect.setAttribute('height',3.5);
		airspeedRect.setAttribute('fill','lemonchiffon');
		airspeedRect.setAttribute('stroke','black');
		airspeedRect.setAttribute('stroke-width',0.5);
		var airspeedText = document.createElementNS('http://www.w3.org/2000/svg','text');
		rumbleGroup.appendChild(airspeedText);
		airspeedText.id = 'uiAirspeed';
		airspeedText.setAttribute('x',83);
		airspeedText.setAttribute('y',60);
		airspeedText.setAttribute('font-size',2);
		airspeedText.setAttribute('text-anchor','end');
		
		var headingCasingRect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		rumbleGroup.appendChild(headingCasingRect);
		headingCasingRect.setAttribute('x',28);
		headingCasingRect.setAttribute('y',50);
		headingCasingRect.setAttribute('rx',2);
		headingCasingRect.setAttribute('ry',2);
		headingCasingRect.setAttribute('width',14);
		headingCasingRect.setAttribute('height',20);
		headingCasingRect.setAttribute('fill','saddlebrown');
		headingCasingRect.setAttribute('stroke','black');
		var headingRect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		rumbleGroup.appendChild(headingRect);
		headingRect.setAttribute('x',30);
		headingRect.setAttribute('y',52);
		headingRect.setAttribute('width',10);
		headingRect.setAttribute('height',9.25);
		headingRect.setAttribute('fill','lightgoldenrodyellow');
		headingRect.setAttribute('stroke','black');
		headingRect.setAttribute('stroke-width',0.5);
		var headingText = document.createElementNS('http://www.w3.org/2000/svg','text');
		rumbleGroup.appendChild(headingText);
		headingText.id = 'uiHeadingCardinal';
		headingText.setAttribute('x',35);
		headingText.setAttribute('y',57);
		headingText.setAttribute('font-size',4);
		headingText.setAttribute('text-anchor','middle');
		var headingText = document.createElementNS('http://www.w3.org/2000/svg','text');
		rumbleGroup.appendChild(headingText);
		headingText.id = 'uiHeading';
		headingText.setAttribute('x',35);
		headingText.setAttribute('y',60);
		headingText.setAttribute('font-size',2);
		headingText.setAttribute('text-anchor','middle');
		
		var mapGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
		rumbleGroup.appendChild(mapGroup);
		var mapBoard = document.createElementNS('http://www.w3.org/2000/svg','rect')
		mapGroup.appendChild(mapBoard);
		mapBoard.setAttribute('fill','saddlebrown');
		mapBoard.setAttribute('stroke','black');
		mapBoard.setAttribute('x',-101);
		mapBoard.setAttribute('y',-63);
		mapBoard.setAttribute('width',40);
		mapBoard.setAttribute('height',40);
		var mapBG = document.createElementNS('http://www.w3.org/2000/svg','rect');
		mapGroup.appendChild(mapBG);
		mapBG.setAttribute('fill','cornsilk');
		mapBG.setAttribute('x',-98);
		mapBG.setAttribute('y',-60);
		mapBG.setAttribute('width',35);
		mapBG.setAttribute('height',35);
		var mapSVG = document.createElementNS('http://www.w3.org/2000/svg','svg');
		mapGroup.appendChild(mapSVG);
		mapSVG.id = 'mapSVG';
		mapSVG.setAttribute('x',-98);
		mapSVG.setAttribute('y',-60);
		mapSVG.setAttribute('width',35);
		mapSVG.setAttribute('height',35);
		mapSVG.setAttribute('stroke','black');
		mapSVG.setAttribute('viewBox','-3000 -3000 6000 6000');
		var circle = document.createElementNS('http://www.w3.org/2000/svg','circle');
		mapGroup.appendChild(circle);
		circle.setAttribute('cx',-98 + 35/2);
		circle.setAttribute('cy',-60 + 35/2);
		circle.setAttribute('r',0.25);
		circle.setAttribute('fill','red');
		circle.setAttribute('stroke','black');
		circle.setAttribute('stroke-width',0.25);
		circle.setAttribute('paint-order','stroke');
		
		var windSockGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
		rumbleGroup.appendChild(windSockGroup);
		var windSockX = -92;
		var windSockY = -55;
		windSockGroup.setAttribute('stroke-width',0.5);
		var circle = document.createElementNS('http://www.w3.org/2000/svg','circle');
		windSockGroup.appendChild(circle)
		circle.setAttribute('cx',windSockX);
		circle.setAttribute('cy',windSockY);
		circle.setAttribute('r',4);
		circle.setAttribute('fill','saddlebrown');
		circle.setAttribute('stroke','black');
		var circle = document.createElementNS('http://www.w3.org/2000/svg','circle');
		windSockGroup.appendChild(circle)
		circle.setAttribute('cx',windSockX);
		circle.setAttribute('cy',windSockY);
		circle.setAttribute('r',3);
		circle.setAttribute('fill','lightgoldenrodyellow');
		circle.setAttribute('stroke','black');
		var text = document.createElementNS('http://www.w3.org/2000/svg','text');
		windSockGroup.appendChild(text);
		text.setAttribute('x',windSockX);
		text.setAttribute('y',windSockY+2);
		text.setAttribute('text-anchor','middle');
		text.setAttribute('font-size',1.5);
		text.innerHTML = 'Wind';
		var line = document.createElementNS('http://www.w3.org/2000/svg','line');
		windSockGroup.appendChild(line);
		line.setAttribute('stroke','red');
		line.setAttribute('stroke-width',2);
		line.setAttribute('x1',windSockX);
		line.setAttribute('y1',windSockY);
		line.setAttribute('x2',windSockX);
		line.setAttribute('y2',windSockY-5);
		line.setAttribute('stroke-linecap','round');
		line.id = 'uiWindSock';

	},
	
	addShip: function(ship) {
		var shipsGroup = document.getElementById('shipsGroup');
		
		var shipGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
		shipGroup.id = 'shipGroup_'+ship.id;
		shipsGroup.appendChild(shipGroup);
		
		view.updateShip(ship);
	},
	
	updateShip: function(ship) {
		var shipGroup = document.getElementById('shipGroup_'+ship.id);
		shipGroup.innerHTML = '';
		
		var useNode = document.createElementNS('http://www.w3.org/2000/svg','use');
		useNode.setAttribute('x',ship.x);
		useNode.setAttribute('y',ship.y);
		view.setHref(useNode,ship.sprite);
		shipGroup.appendChild(useNode);
		
		if (ship.opacity !== undefined) {
			shipGroup.setAttribute('opacity',ship.opacity);
		};
		
		shipGroup.setAttribute('transform','translate('+ship.x+' '+ship.y+') rotate('+(view.r2d(ship.heading))+') translate('+(-1*ship.x)+' '+(-1*ship.y)+')');
	},
	
	updateEOT: function() {
		var uiEOTBracket = document.getElementById('uiEOTBracket');
		var height = 34 - game.p1ship.eot * 21;
		uiEOTBracket.setAttribute('y',height);
	},
	
	updateWheel: function() {
		var uiWheel = document.getElementById('uiWheel');
		var rotation = view.r2d(game.p1ship.rudder);
		uiWheel.setAttribute('transform','translate(0 62) rotate('+rotation+') translate(0 -62)');
	},
	
	updateHeadingAndSpeed: function() {
		var uiAirspeed = document.getElementById('uiAirspeed');
		uiAirspeed.innerHTML = Math.round(game.p1ship.velocity.speed*100)/100 + " knots";
		
		var uiHeading = document.getElementById('uiHeading');
		headingString = view.r2d(game.p1ship.heading);
		if (headingString < 0) {
			headingString = 360 + headingString;
		};
		uiHeading.innerHTML = Math.round(headingString) + "&#176;";
		
		var uiHeadingCardinal = document.getElementById('uiHeadingCardinal');
		var cardinalString = "N";
		if (headingString < 22.5) {
		} else if (headingString < 67.5) {
			cardinalString = "NE";
		} else if (headingString < 112.5) {
			cardinalString = "E";
		} else if (headingString < 157.5) {
			cardinalString = "SE";
		} else if (headingString < 202.5) {
			cardinalString = "S";
		} else if (headingString < 247.5) {
			cardinalString = "SW";
		} else if (headingString < 292.5) {
			cardinalString = "W";
		} else if (headingString < 337.5) {
			cardinalString = "NW";
		};
		uiHeadingCardinal.innerHTML = cardinalString;
		
		var uiWindSock = document.getElementById('uiWindSock');
		var windDirection = game.p1ship.currentMap().wind.direction;
		var windSpeed = game.p1ship.currentMap().wind.speed;
		var windSockX = -92;
		var windSockY = -55;
		var x2 = windSockX + Math.sin(windDirection) * windSpeed * 1.5;
		var y2 = windSockY - Math.cos(windDirection) * windSpeed * 1.5;
		uiWindSock.setAttribute('x2',x2);
		uiWindSock.setAttribute('y2',y2);
	},
	
	updatePlayerMap: function(map) {
		var mapSVG = document.getElementById('mapSVG');
		if (mapSVG !== null) {
			var mapTileUse = document.createElementNS('http://www.w3.org/2000/svg','use');
			view.setHref(mapTileUse,'tileHex');
			mapTileUse.setAttribute('x',map.x);
			mapTileUse.setAttribute('y',map.y);
			mapTileUse.setAttribute('fill',map.backgroundColor);
			mapSVG.appendChild(mapTileUse);
		};
	},
	
	recenterMap: function() {
		var gameSVG = document.getElementById('gameSVG');
		var center = {x:game.p1ship.x,y:game.p1ship.y};
		gameSVG.setAttribute('viewBox',(center.x-100)+" "+(center.y-61.5)+' 200 123');
		
		var mapSVG = document.getElementById('mapSVG');
		mapSVG.setAttribute('viewBox',(center.x-3000)+" "+(center.y-3000)+' 6000 6000');
		
		var uiGroup = document.getElementById('uiGroup');
		uiGroup.setAttribute('transform','translate('+(center.x)+" "+(center.y)+')');
	},
	
	rumble: function() {
		document.getElementById('rumbleAnimation').beginElement();
	},

};