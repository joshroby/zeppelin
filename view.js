var view = {
	
	gameTitle: 'Putter Round',

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
		
		var genericPart = document.createElementNS('http://www.w3.org/2000/svg','rect');
		genericPart.id = 'genericPart';
		genericPart.setAttribute('x',0);
		genericPart.setAttribute('y',0);
		genericPart.setAttribute('width',10);
		genericPart.setAttribute('height',10);
		genericPart.setAttribute('fill','grey');
		genericPart.setAttribute('stroke','black');
		defs.appendChild(genericPart);
		
		var genericPartWheel = document.createElementNS('http://www.w3.org/2000/svg','g');
		genericPartWheel.id = 'genericPartWheel';
		defs.appendChild(genericPartWheel);
		var circle = document.createElementNS('http://www.w3.org/2000/svg','circle');
		circle.setAttribute('cx',5);
		circle.setAttribute('cy',5);
		circle.setAttribute('r',3);
		circle.setAttribute('fill','grey');
		circle.setAttribute('stroke','black');
		genericPartWheel.appendChild(circle);
		var lilCircle = document.createElementNS('http://www.w3.org/2000/svg','circle');
		lilCircle.setAttribute('cx',5);
		lilCircle.setAttribute('cy',7);
		lilCircle.setAttribute('r',1);
		lilCircle.setAttribute('fill','grey');
		lilCircle.setAttribute('stroke','black');
		genericPartWheel.appendChild(lilCircle);
		
		var genericPartShoot = document.createElementNS('http://www.w3.org/2000/svg','g');
		genericPartShoot.id = 'genericPartShoot';
		defs.appendChild(genericPartShoot);
		var polyline = document.createElementNS('http://www.w3.org/2000/svg','polyline');
		polyline.setAttribute('fill','gray');
		polyline.setAttribute('stroke','black');
		polyline.setAttribute('points','3,0 2,9 -2,9 -3,0');
		genericPartShoot.appendChild(polyline);

		var resourceStone = document.createElementNS('http://www.w3.org/2000/svg','circle');
		resourceStone.id = 'resourceStone';
		resourceStone.setAttribute('cx',0);
		resourceStone.setAttribute('cy',0);
		resourceStone.setAttribute('r',2);
		resourceStone.setAttribute('stroke','black');
		defs.appendChild(resourceStone);
		
		var resourceIngot = document.createElementNS('http://www.w3.org/2000/svg','g');
		resourceIngot.id = 'resourceIngot';
		defs.appendChild(resourceIngot);
		var polygon = document.createElementNS('http://www.w3.org/2000/svg','polygon');
		polygon.setAttribute('points','1,2 3,0 2.5,-2 0.5,-2 -2.5,0');
		polygon.setAttribute('stroke','black');
		polygon.setAttribute('stroke-linejoin','round');
		resourceIngot.appendChild(polygon);
		var polygon = document.createElementNS('http://www.w3.org/2000/svg','polygon');
		polygon.setAttribute('points','-3,2 -2.5,0 0.5,0 1,2 -3,2');
		polygon.setAttribute('stroke','black');
		polygon.setAttribute('stroke-linejoin','round');
		resourceIngot.appendChild(polygon);
		
		var resourceCoin = document.createElementNS('http://www.w3.org/2000/svg','g');
		resourceCoin.id = 'resourceCoin';
		resourceCoin.setAttribute('stroke','black');
		defs.appendChild(resourceCoin);
		var ellipseHeads = document.createElementNS('http://www.w3.org/2000/svg','ellipse');
		resourceCoin.appendChild(ellipseHeads);
		ellipseHeads.setAttribute('cx',0.25);
		ellipseHeads.setAttribute('cy',0);
		ellipseHeads.setAttribute('rx',1.5);
		ellipseHeads.setAttribute('ry',2);
		var ellipseTails = document.createElementNS('http://www.w3.org/2000/svg','ellipse');
		resourceCoin.appendChild(ellipseTails);
		ellipseTails.setAttribute('cx',-0.25);
		ellipseTails.setAttribute('cy',0);
		ellipseTails.setAttribute('rx',1.5);
		ellipseTails.setAttribute('ry',2);
		
		var resourceCrown = document.createElementNS('http://www.w3.org/2000/svg','g');
		defs.appendChild(resourceCrown);
		resourceCrown.id = 'resourceCrown';
		resourceCrown.setAttribute('stroke','black');
		var polygon = document.createElementNS('http://www.w3.org/2000/svg','polygon');
		polygon.setAttribute('points','-2,2 2,2 3,-1 1,0 0,-2 -1,0 -3,-1 -2,2');
		polygon.setAttribute('stroke','black');
		polygon.setAttribute('stroke-linejoin','round');
		resourceCrown.appendChild(polygon);
		
		var resourceShield = document.createElementNS('http://www.w3.org/2000/svg','g');
		defs.appendChild(resourceShield);
		resourceShield.id = 'resourceShield';
		resourceShield.setAttribute('stroke','black');
		var path = document.createElementNS('http://www.w3.org/2000/svg','path');
		var d = 'M 2,0 L 0,-2 L -2,0 L 0,2';
		d += 'C 0.5,2.5 1.5,2.5 2,2';
		d += 'C 2.5,1.5 2.5,0.5 2,0';
		d += ' z'
		path.setAttribute('d',d);
		path.setAttribute('stroke','black');
		path.setAttribute('stroke-linejoin','round');
		resourceShield.appendChild(path);
		
		var resourceSword = document.createElementNS('http://www.w3.org/2000/svg','g');
		defs.appendChild(resourceSword);
		resourceSword.id = 'resourceSword';
		resourceSword.setAttribute('stroke','black');
		var polygon = document.createElementNS('http://www.w3.org/2000/svg','polygon');
		polygon.setAttribute('points',' -2.5,-2 -2,-2.5 2.5,1.5 2.5,2.5 1.5,2.5 -2.5,-2');
		polygon.setAttribute('stroke','black');
		polygon.setAttribute('stroke-linejoin','round');
		resourceSword.appendChild(polygon);
		var polygon = document.createElementNS('http://www.w3.org/2000/svg','polygon');
		polygon.setAttribute('points','0,-2 1,-1 -1,1 -2,0 0,-2');
		polygon.setAttribute('stroke','black');
		polygon.setAttribute('stroke-linejoin','round');
		resourceSword.appendChild(polygon);
		
		var resourceCup = document.createElementNS('http://www.w3.org/2000/svg','g');
		defs.appendChild(resourceCup);
		resourceCup.id = 'resourceCup';
		resourceCup.setAttribute('stroke','black');
		var path = document.createElementNS('http://www.w3.org/2000/svg','path');
		var d = 'M -2,-2';
		d += 'C -2,0 -0.75,-0.5 -0.75,0';
		d += 'C -0.75,1.5 -1.5,2 -1.5,2';
		d += 'L 1.5,2';
		d += 'C 1.5,2 0.75,1.5 0.75,0';
		d += 'C 0.75,-0.5 2,0 2,-2';
		d += ' z'
		path.setAttribute('d',d);
		path.setAttribute('stroke','black');
		path.setAttribute('stroke-linejoin','round');
		resourceCup.appendChild(path);

		var resourceGem = document.createElementNS('http://www.w3.org/2000/svg','g');
		defs.appendChild(resourceGem);
		resourceGem.id = 'resourceGem';
		var polygon = document.createElementNS('http://www.w3.org/2000/svg','polygon');
		polygon.setAttribute('points','-1,-2 1,-2 2,-1 2,1 1,2 -1,2 -2,1 -2,-1');
		polygon.setAttribute('stroke','black');
		resourceGem.appendChild(polygon);
		var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		rect.setAttribute('x',-1);
		rect.setAttribute('y',-1);
		rect.setAttribute('width',2);
		rect.setAttribute('height',2);
		rect.setAttribute('stroke-width',0.25);
		rect.setAttribute('stroke','black');
		resourceGem.appendChild(rect);
		
		var victoryPoint = document.createElementNS('http://www.w3.org/2000/svg','polygon');
		defs.appendChild(victoryPoint);
		victoryPoint.id = 'resourceVictoryPoint';
		victoryPoint.setAttribute('fill','cyan');
		victoryPoint.setAttribute('stroke','black');
		victoryPoint.setAttribute('stroke-width',0.5);
		victoryPoint.setAttribute('points','0,-2 1,-1 3,-1 2,0 3,1 1,1 0,2 -1,1 -3,1 -2,0 -3,-1 -1,-1');
		victoryPoint.setAttribute('transform','scale(0.9,1.2)');

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
	
	initMap: function(map) {
	
		// Clear Map
		var landscapeGroup = document.getElementById('landscapeGroup');
		landscapeGroup.innerHTML = '';
	
		// Landmarks
		for (var landmark of map.landmarks) {
			var landmarkUse = document.createElementNS('http://www.w3.org/2000/svg','use');
			landmarkUse.setAttribute('x',landmark.x);
			landmarkUse.setAttribute('y',landmark.y);
			landmarkUse.setAttribute('fill',landmark.fill);
			view.setHref(landmarkUse,landmark.glyph);
			landscapeGroup.appendChild(landmarkUse);
		};
	},
	
	initUI: function() {
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

	},
	
	addShip: function(ship) {
		var shipsGroup = document.getElementById('shipsGroup');
		
		var shipGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
		shipGroup.id = 'shipGroup_'+ship.id;
		shipsGroup.appendChild(shipGroup);
		
		view.updateShip(ship);
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
	},
	
	updateShip: function(ship) {
		var shipGroup = document.getElementById('shipGroup_'+ship.id);
		shipGroup.innerHTML = '';
		
		var useNode = document.createElementNS('http://www.w3.org/2000/svg','use');
		useNode.setAttribute('x',ship.x);
		useNode.setAttribute('y',ship.y);
		useNode.setAttribute('fill','blue');
		view.setHref(useNode,'resourceCrown');
		shipGroup.appendChild(useNode);
		
		var ellipse = document.createElementNS('http://www.w3.org/2000/svg','ellipse');
		ellipse.setAttribute('cx',ship.x);
		ellipse.setAttribute('cy',ship.y + 3.5);
		ellipse.setAttribute('rx',2);
		ellipse.setAttribute('ry',5);
		ellipse.setAttribute('fill','blue');
		ellipse.setAttribute('stroke','black');
		shipGroup.appendChild(ellipse);
		
		shipGroup.setAttribute('transform','translate('+ship.x+' '+ship.y+') rotate('+(180+view.r2d(ship.heading))+') translate('+(-1*ship.x)+' '+(-1*ship.y)+')');
	},
	
	recenterMap: function() {
		var gameSVG = document.getElementById('gameSVG');
		var center = {x:game.p1ship.x,y:game.p1ship.y};
		gameSVG.setAttribute('viewBox',(center.x-100)+" "+(center.y-61.5)+' 200 123');
		
		var uiGroup = document.getElementById('uiGroup');
		uiGroup.setAttribute('transform','translate('+(center.x)+" "+(center.y)+')');
	},
	
	rumble: function() {
		document.getElementById('rumbleAnimation').beginElement();
	},

};