var view = {
	
	gameTitle: 'Zeppel Endless',
	supportLink: 'http://patreon.com/joshroby',
	supportLinkLabel: 'Patreon',
	
	panes: {
		minimap: 'minimized',
		tab0: 'minimized',
		tab1: 'minimized',
		tab2: 'minimized',
		tab3: 'minimized',
		tab4: 'minimized',
		crew: 'minimized',
		selectedComponent: undefined,
		course: undefined,
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

	capitalize: function(string) {
    	return string.charAt(0).toUpperCase() + string.slice(1);
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
		
		// Component Defs
		
		var stabilizer = document.createElementNS('http://www.w3.org/2000/svg','polygon');
		stabilizer.id = 'stabilizer_t1';
		var points = "0,-0.5 2,0.2 2,0.5 0,0.5";
		stabilizer.setAttribute('points',points);
		stabilizer.setAttribute('fill','inherit');
		stabilizer.setAttribute('stroke','black');
		defs.appendChild(stabilizer);
		
		var motorGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
		defs.appendChild(motorGroup);
		motorGroup.id = 'motor_t1';
		motorGroup.setAttribute('fill','inherit');
		motorGroup.setAttribute('stroke','black');
		var strut = document.createElementNS('http://www.w3.org/2000/svg','rect');
		motorGroup.appendChild(strut);
		strut.setAttribute('x',0);
		strut.setAttribute('y',-0.25);
		strut.setAttribute('width',1.5);
		strut.setAttribute('height',0.5);
		var motor = document.createElementNS('http://www.w3.org/2000/svg','ellipse');
		motorGroup.appendChild(motor);
		motor.setAttribute('cx',1.25);
		motor.setAttribute('cy',0);
		motor.setAttribute('rx',0.25);
		motor.setAttribute('ry',0.75);
		
		var fin = document.createElementNS('http://www.w3.org/2000/svg','line');
		defs.appendChild(fin);
		fin.id = 'fin_t1';
		fin.setAttribute('x1',0);
		fin.setAttribute('y1',0);
		fin.setAttribute('x2',0);
		fin.setAttribute('y2',2);
		fin.setAttribute('fill','inherit');
		fin.setAttribute('stroke','black');
		
		var topDeck = document.createElementNS('http://www.w3.org/2000/svg','ellipse');
		defs.appendChild(topDeck);
		topDeck.id = 'topDeck_t1';
		topDeck.setAttribute('cx',0);
		topDeck.setAttribute('cy',0);
		topDeck.setAttribute('rx',0.3);
		topDeck.setAttribute('ry',0.45);
		topDeck.setAttribute('fill','inherit');
		topDeck.setAttribute('stroke','black');
		
		var solarPanels = document.createElementNS('http://www.w3.org/2000/svg','g');
		defs.appendChild(solarPanels);
		solarPanels.id = 'solarPanels_t1';
		solarPanels.setAttribute('fill','cadetblue');
		solarPanels.setAttribute('stroke','black');
		var panel1 = document.createElementNS('http://www.w3.org/2000/svg','rect');
		solarPanels.appendChild(panel1);
		panel1.setAttribute('x',0);
		panel1.setAttribute('y',-1);
		panel1.setAttribute('width',1);
		panel1.setAttribute('height',2);
		var panel2 = document.createElementNS('http://www.w3.org/2000/svg','rect');
		solarPanels.appendChild(panel2);
		panel2.setAttribute('x',-1);
		panel2.setAttribute('y',-1);
		panel2.setAttribute('width',1);
		panel2.setAttribute('height',2);
		
		var garden = document.createElementNS('http://www.w3.org/2000/svg','g');
		defs.appendChild(garden);
		garden.id = 'garden_t1';
		garden.setAttribute('fill','green');
		garden.setAttribute('stroke','black');
		var panel1 = document.createElementNS('http://www.w3.org/2000/svg','rect');
		garden.appendChild(panel1);
		panel1.setAttribute('x',0);
		panel1.setAttribute('y',-1);
		panel1.setAttribute('width',1);
		panel1.setAttribute('height',2);
		var panel2 = document.createElementNS('http://www.w3.org/2000/svg','rect');
		garden.appendChild(panel2);
		panel2.setAttribute('x',-1);
		panel2.setAttribute('y',-1);
		panel2.setAttribute('width',1);
		panel2.setAttribute('height',2);
		
		var tailboom = document.createElementNS('http://www.w3.org/2000/svg','polygon');
		tailboom.id = 'tailboom_t1';
		var points = "0,1 1.725,2 1.75,2.625 0,2 -1.75,2.625 -1.725,2";
		tailboom.setAttribute('points',points);
		tailboom.setAttribute('fill','inherit');
		tailboom.setAttribute('stroke','black');
		defs.appendChild(tailboom);
		
		var cloud = document.createElementNS('http://www.w3.org/2000/svg','ellipse');
		defs.appendChild(cloud);
		cloud.id = 'cloud';
		cloud.setAttribute('fill','url(#cloudGradient)');
		cloud.setAttribute('rx',10);
		cloud.setAttribute('ry',14);
		
		var cloudGradient = document.createElementNS('http://www.w3.org/2000/svg','radialGradient');
		defs.appendChild(cloudGradient);
		cloudGradient.id = 'cloudGradient';
		var stop = document.createElementNS('http://www.w3.org/2000/svg','stop');
		cloudGradient.appendChild(stop);
		stop.setAttribute('offset','0%');
		stop.setAttribute('stop-color','white');
		stop.setAttribute('stop-opacity',0.7);
		var stop = document.createElementNS('http://www.w3.org/2000/svg','stop');
		cloudGradient.appendChild(stop);
		stop.setAttribute('offset','100%');
		stop.setAttribute('stop-color','white');
		stop.setAttribute('stop-opacity',0);
		
		// Map Features
		
		var mooringTower = document.createElementNS('http://www.w3.org/2000/svg','g');
		defs.appendChild(mooringTower);
		mooringTower.id = 'mooringTower';
		mooringTower.setAttribute('stroke','black');
		mooringTower.setAttribute('fill','inherit');
		mooringTower.setAttribute('stroke-width',0.25);
		for (var i=0;i<6;i++) {
			var girderGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
			mooringTower.appendChild(girderGroup);
			var girder = document.createElementNS('http://www.w3.org/2000/svg','rect');
			girderGroup.appendChild(girder);
			girder.setAttribute('x',6);
			girder.setAttribute('y',-0.25);
			girder.setAttribute('width',5.5);
			girder.setAttribute('height',0.5);
			girder.setAttribute('stroke-width',0.25);
			girder.setAttribute('transform','rotate(140 6 0)');
			var girder = document.createElementNS('http://www.w3.org/2000/svg','rect');
			girderGroup.appendChild(girder);
			girder.setAttribute('x',6);
			girder.setAttribute('y',-0.25);
			girder.setAttribute('width',5.5);
			girder.setAttribute('height',0.5);
			girder.setAttribute('stroke-width',0.25);
			girder.setAttribute('transform','rotate(-140 6 0)');
			girderGroup.setAttribute('transform','rotate('+i*60+' 0 0)');
		};
		var footD = 'm0,-0.75 h3 l3.5,0.25 l0.5,-0.5 l0.5,0 l1,0.5 v1 l-1,0.5 l-0.5,0 l-0.5,-0.5 l-3.5,0.25 h-3 z';
		var legD = 'm0,-0.75 h3 l3.5,0.25 h1 v1 h-1 l-3.5,0.25 h-3 z';
		for (var i=0;i<6;i++) {
			var legGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
			mooringTower.appendChild(legGroup);
			var foot = document.createElementNS('http://www.w3.org/2000/svg','path');
			legGroup.appendChild(foot);
			foot.setAttribute('d',footD);
			var leg = document.createElementNS('http://www.w3.org/2000/svg','path');
			legGroup.appendChild(leg);
			leg.setAttribute('d',legD);
			legGroup.setAttribute('transform','rotate('+i*60+' 0 0)');
		};
		var circle = document.createElementNS('http://www.w3.org/2000/svg','circle');
		mooringTower.appendChild(circle);
		circle.setAttribute('r',3);
		var circle = document.createElementNS('http://www.w3.org/2000/svg','circle');
		mooringTower.appendChild(circle);
		circle.setAttribute('r',2.5);
		var mast = document.createElementNS('http://www.w3.org/2000/svg','circle');
		mooringTower.appendChild(mast);
		mast.setAttribute('r',0.25);
		var roofDetails = document.createElementNS('http://www.w3.org/2000/svg','g');
		mooringTower.appendChild(roofDetails);
		roofDetails.setAttribute('stroke-width',0.125);
		var elevator = document.createElementNS('http://www.w3.org/2000/svg','rect');
		roofDetails.appendChild(elevator);
		elevator.setAttribute('x',0.675);
		elevator.setAttribute('y',-0.675);
		elevator.setAttribute('width',1.25);
		elevator.setAttribute('height',1.25);
		var elevator = document.createElementNS('http://www.w3.org/2000/svg','rect');
		roofDetails.appendChild(elevator);
		elevator.setAttribute('x',0-0.675-1.25);
		elevator.setAttribute('y',-0.675);
		elevator.setAttribute('width',1.25);
		elevator.setAttribute('height',1.25);
		
		var targetGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
		defs.appendChild(targetGroup);
		targetGroup.id = 'mooringTarget';
		var targetSize = 10;
		targetGroup.setAttribute('opacity',0.5);
		targetGroup.setAttribute('fill','none');
		targetGroup.setAttribute('stroke','lime');
		targetGroup.setAttribute('stroke-width',2);
		targetGroup.setAttribute('stroke-linecap','round');
		var targetCircle = document.createElementNS('http://www.w3.org/2000/svg','circle');
		targetGroup.appendChild(targetCircle);
		targetCircle.setAttribute('r',targetSize);
		var targetLineUp = document.createElementNS('http://www.w3.org/2000/svg','line');
		targetGroup.appendChild(targetLineUp);
		targetLineUp.setAttribute('x1',0);
		targetLineUp.setAttribute('y1',targetSize);
		targetLineUp.setAttribute('x2',0);
		targetLineUp.setAttribute('y2',targetSize+3);
		var targetLineDown = document.createElementNS('http://www.w3.org/2000/svg','line');
		targetGroup.appendChild(targetLineDown);
		targetLineDown.setAttribute('x1',0);
		targetLineDown.setAttribute('y1',targetSize*-1);
		targetLineDown.setAttribute('x2',0);
		targetLineDown.setAttribute('y2',(targetSize+3)*-1);
		var targetLineLeft = document.createElementNS('http://www.w3.org/2000/svg','line');
		targetGroup.appendChild(targetLineLeft);
		targetLineLeft.setAttribute('y1',0);
		targetLineLeft.setAttribute('x1',targetSize);
		targetLineLeft.setAttribute('y2',0);
		targetLineLeft.setAttribute('x2',targetSize+3);
		var targetLineRight = document.createElementNS('http://www.w3.org/2000/svg','line');
		targetGroup.appendChild(targetLineRight);
		targetLineRight.setAttribute('y1',0);
		targetLineRight.setAttribute('x1',targetSize*-1);
		targetLineRight.setAttribute('y2',0);
		targetLineRight.setAttribute('x2',(targetSize+3)*-1);
		var targetSpin = document.createElementNS('http://www.w3.org/2000/svg','animateTransform');
		targetGroup.appendChild(targetSpin);
		targetSpin.setAttribute('attributeName','transform');
		targetSpin.setAttribute('attributeType','XML');
		targetSpin.setAttribute('type','rotate');
		targetSpin.setAttribute('from','0 0 0');
		targetSpin.setAttribute('to','360 0 0');
		targetSpin.setAttribute('dur','4s');
		targetSpin.setAttribute('repeatCount','indefinite');
		
		var targetGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
		defs.appendChild(targetGroup);
		targetGroup.id = 'componentTarget';
		var targetSize = 0.75;
		targetGroup.setAttribute('opacity',0.75);
		targetGroup.setAttribute('fill','none');
// 		targetGroup.setAttribute('stroke','cyan');
		targetGroup.setAttribute('stroke-width',0.25);
		targetGroup.setAttribute('stroke-linecap','round');
		var backingCircle = document.createElementNS('http://www.w3.org/2000/svg','circle');
		targetGroup.appendChild(backingCircle);
		backingCircle.setAttribute('r',targetSize+0.25);
		backingCircle.setAttribute('fill','white');
		backingCircle.setAttribute('stroke','none');
		backingCircle.setAttribute('opacity',0.01);
		var targetCircle = document.createElementNS('http://www.w3.org/2000/svg','circle');
		targetGroup.appendChild(targetCircle);
		targetCircle.setAttribute('r',targetSize);
		var targetLineUp = document.createElementNS('http://www.w3.org/2000/svg','line');
		targetGroup.appendChild(targetLineUp);
		targetLineUp.setAttribute('x1',0);
		targetLineUp.setAttribute('y1',targetSize);
		targetLineUp.setAttribute('x2',0);
		targetLineUp.setAttribute('y2',targetSize+0.25);
		var targetLineDown = document.createElementNS('http://www.w3.org/2000/svg','line');
		targetGroup.appendChild(targetLineDown);
		targetLineDown.setAttribute('x1',0);
		targetLineDown.setAttribute('y1',targetSize*-1);
		targetLineDown.setAttribute('x2',0);
		targetLineDown.setAttribute('y2',(targetSize+0.25)*-1);
		var targetLineLeft = document.createElementNS('http://www.w3.org/2000/svg','line');
		targetGroup.appendChild(targetLineLeft);
		targetLineLeft.setAttribute('y1',0);
		targetLineLeft.setAttribute('x1',targetSize);
		targetLineLeft.setAttribute('y2',0);
		targetLineLeft.setAttribute('x2',targetSize+0.25);
		var targetLineRight = document.createElementNS('http://www.w3.org/2000/svg','line');
		targetGroup.appendChild(targetLineRight);
		targetLineRight.setAttribute('y1',0);
		targetLineRight.setAttribute('x1',targetSize*-1);
		targetLineRight.setAttribute('y2',0);
		targetLineRight.setAttribute('x2',(targetSize+0.25)*-1);
		var targetSpin = document.createElementNS('http://www.w3.org/2000/svg','animateTransform');
		targetGroup.appendChild(targetSpin);
		targetSpin.setAttribute('attributeName','transform');
		targetSpin.setAttribute('attributeType','XML');
		targetSpin.setAttribute('type','rotate');
		targetSpin.setAttribute('from','0 0 0');
		targetSpin.setAttribute('to','360 0 0');
		targetSpin.setAttribute('dur','4s');
		targetSpin.setAttribute('repeatCount','indefinite');
		
		var basicRoof = document.createElementNS('http://www.w3.org/2000/svg','g');
		defs.appendChild(basicRoof);
		basicRoof.id = 'basicRoof';
		basicRoof.setAttribute('fill','darkgoldenrod');
		basicRoof.setAttribute('stroke-width',0.25);
		basicRoof.setAttribute('stroke','black');
		var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		basicRoof.appendChild(rect);
		rect.setAttribute('x',0);
		rect.setAttribute('y',-1);
		rect.setAttribute('width',1);
		rect.setAttribute('height',2);
		var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		basicRoof.appendChild(rect);
		rect.setAttribute('x',-1);
		rect.setAttribute('y',-1);
		rect.setAttribute('width',1);
		rect.setAttribute('height',2);
		
		var basicRoofShader = document.createElementNS('http://www.w3.org/2000/svg','g');
		defs.appendChild(basicRoofShader);
		basicRoofShader.id = 'basicRoofShader';
		basicRoofShader.setAttribute('opacity','0.2');
		basicRoofShader.setAttribute('stroke','none');
		var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		basicRoofShader.appendChild(rect);
		rect.setAttribute('x',0);
		rect.setAttribute('y',-1);
		rect.setAttribute('width',1);
		rect.setAttribute('height',2);
		rect.setAttribute('fill','black');
		var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		basicRoofShader.appendChild(rect);
		rect.setAttribute('x',-1);
		rect.setAttribute('y',-1);
		rect.setAttribute('width',1);
		rect.setAttribute('height',2);
		rect.setAttribute('fill','white');
		
		var longRoof = document.createElementNS('http://www.w3.org/2000/svg','g');
		defs.appendChild(longRoof);
		longRoof.id = 'longRoof';
		longRoof.setAttribute('fill','darkgoldenrod');
		longRoof.setAttribute('stroke-width',0.25);
		longRoof.setAttribute('stroke','black');
		var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		longRoof.appendChild(rect);
		rect.setAttribute('x',0);
		rect.setAttribute('y',-1);
		rect.setAttribute('width',1);
		rect.setAttribute('height',3);
		var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		longRoof.appendChild(rect);
		rect.setAttribute('x',-1);
		rect.setAttribute('y',-1);
		rect.setAttribute('width',1);
		rect.setAttribute('height',3);
		
		var longRoofShader = document.createElementNS('http://www.w3.org/2000/svg','g');
		defs.appendChild(longRoofShader);
		longRoofShader.id = 'longRoofShader';
		longRoofShader.setAttribute('opacity','0.2');
		longRoofShader.setAttribute('stroke','none');
		var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		longRoofShader.appendChild(rect);
		rect.setAttribute('x',0);
		rect.setAttribute('y',-1);
		rect.setAttribute('width',1);
		rect.setAttribute('height',3);
		rect.setAttribute('fill','black');
		var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		longRoofShader.appendChild(rect);
		rect.setAttribute('x',-1);
		rect.setAttribute('y',-1);
		rect.setAttribute('width',1);
		rect.setAttribute('height',3);
		rect.setAttribute('fill','white');
		
		// UI Defs
		
		var navMarker = document.createElementNS('http://www.w3.org/2000/svg','g');
		defs.appendChild(navMarker);
		navMarker.id = 'navMarker';
		navMarker.setAttribute('stroke-width',0.25);
		var path = document.createElementNS('http://www.w3.org/2000/svg','path');
		navMarker.appendChild(path);
		path.setAttribute('d','M0,-1.25 L0.75,0.75 L-0.75,0.75 Z');

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
		
		var mugGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
		defs.appendChild(mugGroup);
		mugGroup.id = 'mug';
		mugGroup.setAttribute('stroke-width',0.25);
		mugGroup.setAttribute('transform','scale(1.25) rotate(-10)');
		var handle = document.createElementNS('http://www.w3.org/2000/svg','path');
		mugGroup.appendChild(handle);
		handle.setAttribute('fill','white');
		handle.setAttribute('stroke','black');
		var d = 'M3,-3 q 2,0 2,2 v2 q 0,2 -2,2 v-1 h-0.5 q 1.5,0 1.5,-1.5 v-1 q 0,-1.5 -1.5,-1.5 z';
		handle.setAttribute('d',d);
		var path = document.createElementNS('http://www.w3.org/2000/svg','path');
		mugGroup.appendChild(path);
		path.setAttribute('fill','white');
		path.setAttribute('stroke','black');
		var d = 'M-3,-4 h6 v8 q -3,0.5 -6,0 v-8';
		path.setAttribute('d',d);
		var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		rect.setAttribute('fill','gold');
		rect.setAttribute('stroke','black');
		rect.setAttribute('x',-2.25);
		rect.setAttribute('y',-3.25);
		rect.setAttribute('width',4.5);
		rect.setAttribute('height',6.5);
		rect.setAttribute('rx',0.5);
		rect.setAttribute('ry',0.5);
		mugGroup.appendChild(rect);
		var suds = [
			{x:-1,y:-4.5,r:1.25,stroke:'black'},
			{x:-2,y:-4.25,r:1,stroke:'black'},
			{x:-2.25,y:-2.25,r:0.75,stroke:'black'},
			{x:-2,y:-3.25,r:1,stroke:'black'},
			{x:-2.25,y:-1.5,r:0.75,stroke:'black'},
			{x:-2.5,y:-0.5,r:0.5,stroke:'black'},
			{x:-3,y:0,r:0.4,stroke:'black'},
			{x:-3,y:-1,r:0.5,stroke:'black'},
			{x:-3,y:-2,r:0.6,stroke:'black'},
			{x:-3,y:-3,r:0.75,stroke:'black'},
			{x:2.75,y:-4,r:0.5,stroke:'black'},
			{x:2,y:-4,r:0.6,stroke:'black'},
			{x:1,y:-4.1,r:0.75,stroke:'black'},
			{x:0,y:-4,r:1,stroke:'black'},
			{x:-1,y:-3.9,r:0.75,stroke:'black'},
			{x:-3,y:-4,r:1,stroke:'black'},
			{x:0,y:-3.25,r:0.7,stroke:'black'},
			{x:2,y:-3.25,r:0.7,stroke:'black'},
			
			{x:-2,y:-4,r:0.6,stroke:'none'},
			{x:-0.25,y:-3.75,r:0.6,stroke:'none'},
			{x:-2.5,y:-2.5,r:0.5,stroke:'none'},
			{x:-2.75,y:-0.5,r:0.4,stroke:'none'},
			{x:1.75,y:-3.75,r:0.5,stroke:'none'},
		];
		for (var bubble of suds) {
			var circle = document.createElementNS('http://www.w3.org/2000/svg','circle');
			mugGroup.appendChild(circle);
			circle.setAttribute('cx',bubble.x);
			circle.setAttribute('cy',bubble.y);
			circle.setAttribute('r',bubble.r);
			circle.setAttribute('fill','white');
			circle.setAttribute('stroke',bubble.stroke);
		};
		
		var heart = document.createElementNS('http://www.w3.org/2000/svg','g');
		defs.appendChild(heart);
		heart.id = 'UIheart';
		var path = document.createElementNS('http://www.w3.org/2000/svg','path');
		heart.appendChild(path);
		var d = 'M 0,4 C 1,3 4,1.1 4,0 C 4,-1.1 3.1,-2 2,-2 C 0.9,-2 0,-1.1 0,0 C 0,-1.1 -0.9,-2 -2,-2 C -3.1,-2 -4,-1.1 -4,0 C -4,1.1 -1,3 0,4 Z';
		path.setAttribute('d',d);
		heart.setAttribute('transform','translate(0,-1.25)');
		
		var xp = document.createElementNS('http://www.w3.org/2000/svg','g');
		defs.appendChild(xp);
		xp.id = 'UIxp';
		xp.setAttribute('stroke-width',0.25);
		var circle = document.createElementNS('http://www.w3.org/2000/svg','circle');
		xp.appendChild(circle);
		circle.setAttribute('r',3);
		circle.setAttribute('fill','limegreen');
		circle.setAttribute('stroke','black');
		var path = document.createElementNS('http://www.w3.org/2000/svg','path');
		xp.appendChild(path);
		path.setAttribute('fill','white');
		path.setAttribute('stroke','black');
		path.setAttribute('d','M0,-2 L2,0 L1,0 L1,2 L-1,2 L-1,0 L-2,0 Z');
		path.setAttribute('stroke-linejoin','round');
		
		var defaultEventIcon = document.createElementNS('http://www.w3.org/2000/svg','g');
		defs.appendChild(defaultEventIcon);
		defaultEventIcon.id = 'defaultEventIcon';
		var text = document.createElementNS('http://www.w3.org/2000/svg','text');
		defaultEventIcon.appendChild(text);
		text.setAttribute('y',2);
		text.setAttribute('x',0);
		text.setAttribute('fill','red');
		text.setAttribute('stroke','black');
		text.setAttribute('paint-order','stroke');
		text.setAttribute('text-anchor','middle');
		text.setAttribute('font-size',6);
		text.innerHTML = "!";
		
		var helpEventIcon = document.createElementNS('http://www.w3.org/2000/svg','g');
		defs.appendChild(helpEventIcon);
		helpEventIcon.id = 'helpEventIcon';
		var text = document.createElementNS('http://www.w3.org/2000/svg','text');
		helpEventIcon.appendChild(text);
		text.setAttribute('y',2);
		text.setAttribute('x',0);
		text.setAttribute('fill','red');
		text.setAttribute('stroke','black');
		text.setAttribute('paint-order','stroke');
		text.setAttribute('text-anchor','middle');
		text.setAttribute('font-size',6);
		text.innerHTML = "?";
		

		// Layers
		var titleGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
		titleGroup.id = 'titleGroup';
		svg.appendChild(titleGroup);
		
		var landscapeGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
		landscapeGroup.id = 'landscapeGroup';
		svg.appendChild(landscapeGroup);
		
		var shipsGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
		shipsGroup.id = 'shipsGroup';
		svg.appendChild(shipsGroup);
		
		var uiGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
		uiGroup.id = 'uiGroup';
		svg.appendChild(uiGroup);
		
		var alertsGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
		svg.appendChild(alertsGroup);
		alertsGroup.id = 'alertsGroup';
		
		// Title Screen
		
		var text = document.createElementNS('http://www.w3.org/2000/svg','text');
		titleGroup.appendChild(text);
		text.innerHTML = "Zeppel Endless";
		text.setAttribute('text-anchor','middle');
		
		var newGameButton = view.buildButton('New Game',-33,10,30,0.5);
		titleGroup.appendChild(newGameButton);
		newGameButton.addEventListener('click',handlers.newGame);
		
		var loadGameButton = view.buildButton('Load Game',-16,10,30,0.5);
		titleGroup.appendChild(loadGameButton);
		loadGameButton.setAttribute('opacity',0.5);
// 		loadGameButton.addEventListener('click',handlers.newGame);
		
		var helpButton = view.buildButton('Controls',1,10,30,0.5);
		titleGroup.appendChild(helpButton);
		helpButton.addEventListener('click',events.help.execute);
		
		var supportButton = view.buildButton('Support',18,10,30,0.5);
		titleGroup.appendChild(supportButton);
		supportButton.addEventListener('click',view.patreon);
		
		// Controls
		
		svgDiv.addEventListener('mousedown',handlers.mouseDown);
		svgDiv.addEventListener('mouseup',handlers.mouseUp);
		
		return [svgDiv];
	},
	
	patreon: function() {
		window.open('http://patreon.com/joshroby');
	},

	
	getHullCenters: function(ship) {
		var hullCenters;
		var totalHulls = ship.components.keel.stats.hulls;
		if (totalHulls == 1) {
			hullCenters = [{x:0,y:0}];
		} else if (totalHulls == 2) {
			hullCenters = [
				{x:-0.5,y:0},
				{x:0.5,y:0},
			];		

		} else if (totalHulls == 3) {
			hullCenters = [
				{x:0,y:-0.75},
				{x:-1,y:0.75},
				{x:1,y:0.75},
			];		

		} else if (totalHulls == 4) {
			hullCenters = [
				{x:0,y:1},
				{x:0.8,y:0},
				{x:-0.8,y:0},
				{x:0,y:-1},
			];		

		} else if (totalHulls == 5) {
			hullCenters = [
				{x:1.5,y:0.5},
				{x:-1.5,y:0.5},
				{x:1,y:0},
				{x:-1,y:0},
				{x:0,y:-0.5},
			];		
		};
		
		return hullCenters;

	},
	
	getComponentPosition: function(ship,hull,slotType,slotNum) {
		var hullLength = ship.components['hull'+hull].length, hullWidth = hullLength/3;
		var hullCenters = view.getHullCenters(ship);
		
		var x = hullCenters[hull].x;
		var y = hullCenters[hull].y;
		
		if (slotType == 'external') {
			var xOffset = hullWidth/4 + Math.floor(slotNum/2)*0.2;
			if (true) {xOffset *= 2.5};
			if (slotNum % 2 == 0) {
				x -= xOffset;
			} else {
				x += xOffset;
			};
			y += (Math.floor(slotNum/2)+2)*(hullLength/(Math.floor(ship.components['hull'+hull].stats.externalSlots/2)+2)) - hullLength/2;
		} else if (slotType == 'top') {
			y += (slotNum+2)*(hullLength/(ship.components['hull'+hull].stats.topSlots+2)) - hullLength/2;
		};
		
		return {x,y};
	},
	
	buildHull: function(hull) {
		var hullRect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		if (hull) {
			var hullLength = hull.length, hullWidth = hullLength/3;
			hullRect.setAttribute('width',hullWidth);
			hullRect.setAttribute('height',hullLength);
			hullRect.setAttribute('rx',hullWidth/2);
			hullRect.setAttribute('ry',hullLength/3);
			hullRect.setAttribute('width',hullWidth);
			hullRect.setAttribute('length',hullLength);
			hullRect.setAttribute('fill',hull.color);
			hullRect.setAttribute('stroke','black');
			hullRect.setAttribute('stroke-width',0.25);
			hullRect.setAttribute('transform','translate('+(hullWidth/-2)+' '+(hullLength/-2)+')');
		};
		return hullRect;
	},
	
	buildShipDef: function(ship) {
		var defs = document.getElementById('globalDefs');
		
		var shipGroup = document.getElementById('shipSprite_'+ship.id);
		if (shipGroup == null) {
			var shipGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
			shipGroup.id = 'shipSprite_'+ship.id;
			defs.appendChild(shipGroup);
		};
		shipGroup.innerHTML = '';
		shipGroup.setAttribute('stroke-width',0.25);
		
		if (ship.components.keel) {
		
			var hullCenters = view.getHullCenters(ship);
		
			for (var i=0;i<hullCenters.length;i++) {
				var hullLength
				if (ship.components['hull'+i]) {
					hullLength = ship.components['hull'+i].length;
					ship.components['hull'+i].nose = {
						x: hullCenters[i].x,
						y: hullCenters[i].y - hullLength/2,
					};
				} else {
					hullLength = 10;
				};
				hullCenters[i].length = hullLength;
				hullCenters[i].x *= hullLength * 0.4;
				hullCenters[i].y *= hullLength * 0.4;
			};
		
			var points, hullLength;
			if (hullCenters.length > 1) {
				for (var a of hullCenters) {
					for (var b of hullCenters) {
						if (a !== b) {
							points = '';
							points += a.x + ',' + (a.y+a.length/3+0.5) + ' ';
							points += b.x + ',' + (b.y+b.length/3+0.5) + ' ';
							points += b.x + ',' + (b.y+b.length/3-0.5) + ' ';
							points += a.x + ',' + (a.y+a.length/3-0.5) + ' ';
							var polygon = document.createElementNS('http://www.w3.org/2000/svg','polygon');
							polygon.setAttribute('fill',ship.components.keel.color);
							polygon.setAttribute('stroke','black');
							polygon.setAttribute('points',points);
							shipGroup.appendChild(polygon);
						
							points = '';
							points += a.x + ',' + (a.y-a.length/3+0.5) + ' ';
							points += b.x + ',' + (b.y-b.length/3+0.5) + ' ';
							points += b.x + ',' + (b.y-b.length/3-0.5) + ' ';
							points += a.x + ',' + (a.y-a.length/3-0.5) + ' ';
							var polygon = document.createElementNS('http://www.w3.org/2000/svg','polygon');
							polygon.setAttribute('fill',ship.components.keel.color);
							polygon.setAttribute('stroke','black');
							polygon.setAttribute('points',points);
							shipGroup.appendChild(polygon);
						};
					};
				};
			};
		
			for (var h=0;h<ship.components.keel.stats.hulls;h++) {
				if (ship.components['hull'+h]) {
					var hullLength = ship.components['hull'+h].length;
					var hullWidth = hullLength/3;
					var component;
					for (var s=0;s<ship.components['hull'+h].stats.externalSlots;s++) {
						component = ship.components['hull'+h+'ext'+s];
						if (component) {
							componentX = hullWidth/4 + Math.floor(s/2)*0.2;
							componentY = (Math.floor(s/2)+2)*(hullLength/(Math.floor(ship.components['hull'+h].stats.externalSlots/2)+2)) - hullLength/2;
							var componentUse = document.createElementNS('http://www.w3.org/2000/svg','use');
							componentUse.setAttribute('fill',component.color);
							view.setHref(componentUse,component.type+'_t1');
							componentUse.setAttribute('x',hullCenters[h].x + componentX);
							componentUse.setAttribute('y',hullCenters[h].y + componentY);
							if (s % 2 == 0) {
								componentUse.setAttribute('transform','translate('+hullCenters[h].x+' '+hullCenters[h].y+') scale(-1,1) translate('+(-1*hullCenters[h].x)+' '+(-1*hullCenters[h].y)+')');
							};
							shipGroup.appendChild(componentUse);
						};
					};
			
					var hull = view.buildHull(ship.components['hull'+h]);
					hull.setAttribute('x',hullCenters[h].x);
					hull.setAttribute('y',hullCenters[h].y);
					shipGroup.appendChild(hull);
			
					for (var s=0;s<ship.components['hull'+h].stats.topSlots;s++) {
						component = ship.components['hull'+h+'top'+s];
						if (component) {
							componentX = 0;
							componentY = (s+2)*(hullLength/(ship.components['hull'+h].stats.topSlots+2)) - hullLength/2;
							var componentUse = document.createElementNS('http://www.w3.org/2000/svg','use');
							componentUse.setAttribute('fill',component.color);
							view.setHref(componentUse,component.type+'_t1');
							componentUse.setAttribute('x',hullCenters[h].x + componentX);
							componentUse.setAttribute('y',hullCenters[h].y + componentY);
							shipGroup.appendChild(componentUse);
						};
					};
				};	
			};
		};
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

		var contouredHex = document.createElementNS('http://www.w3.org/2000/svg','polyline');
		sectionGroup.appendChild(contouredHex);
		contouredHex.setAttribute('stroke','none');
		contouredHex.setAttribute('fill',map.backgroundColor);
		var points = '';
		for (var point of map.perimeter) {
			points += point.x+','+point.y+' ';
		};
		contouredHex.setAttribute('points',points);
		
			
		for (var slope of map.slopes) {
			var pointsString = '';
			for (var point of slope.points) {
				pointsString += point.x+','+point.y+' ';
			};
			var polygon = document.createElementNS('http://www.w3.org/2000/svg','polygon');
			sectionGroup.appendChild(polygon);
			polygon.setAttribute('opacity',0.1);
			polygon.setAttribute('fill',slope.fill);
// 			polygon.setAttribute('stroke','red');
// 			polygon.setAttribute('stroke-width',0.5);
			polygon.setAttribute('points',pointsString);
		};
			
// 		for (var line of map.elevationLines) {
// 			var polyline = document.createElementNS('http://www.w3.org/2000/svg','polyline');
// 			sectionGroup.appendChild(polyline);
// 			var points = '';
// 			for (var p=1;p<line.length;p++) {
// 				var circle = document.createElementNS('http://www.w3.org/2000/svg','circle');
// 				sectionGroup.appendChild(circle);
// 				circle.setAttribute('cx',line[p].x);
// 				circle.setAttribute('cy',line[p].y);
// 				circle.setAttribute('r',0.25);
// 				circle.setAttribute('fill','red');
// 				var text = document.createElementNS('http://www.w3.org/2000/svg','text');
// 				sectionGroup.appendChild(text);
// 				text.setAttribute('x',line[p].x);
// 				text.setAttribute('y',line[p].y+4);
// 				text.setAttribute('text-anchor','middle');
// 				text.setAttribute('font-size','2');
// 				text.setAttribute('fill','red');
// 				text.innerHTML = p;
// 				points += line[p].x+','+line[p].y+' ';
// 			};
// 			polyline.setAttribute('points',points);
// 			polyline.setAttribute('opacity',1);
// 			polyline.setAttribute('fill','none');
// 			polyline.setAttribute('stroke-width',0.5);
// 			polyline.setAttribute('stroke-linejoin','round');
// 			polyline.setAttribute('stroke-linecap','round');
// 			if (line[1].d == 'ridge') {
// 				polyline.setAttribute('stroke','black');
// 			} else {
// 				polyline.setAttribute('stroke','cyan');
// 			};
// 		};
		
// 		for (var flag of map.flags) {
// 			var circle = document.createElementNS('http://www.w3.org/2000/svg','circle');
// 			sectionGroup.appendChild(circle);
// 			circle.setAttribute('cx',flag.point.x);
// 			circle.setAttribute('cy',flag.point.y);
// 			circle.setAttribute('r',2);
// 			circle.setAttribute('fill','none');
// 			circle.setAttribute('stroke','red');
// 			var text = document.createElementNS('http://www.w3.org/2000/svg','text');
// 			sectionGroup.appendChild(text);
// 			text.setAttribute('x',flag.point.x);
// 			text.setAttribute('y',flag.point.y+5);
// 			text.setAttribute('text-anchor','middle');
// 			text.setAttribute('font-size','4');
// 			text.setAttribute('fill','red');
// 			text.innerHTML = flag.legend;
// 		};

		// Interactive Features 
// 		if (map.town !== undefined) {
// 			var rimInsideStroke = document.createElementNS('http://www.w3.org/2000/svg','circle');
// 			sectionGroup.appendChild(rimInsideStroke);
// 			rimInsideStroke.setAttribute('cx',map.town.x);
// 			rimInsideStroke.setAttribute('cy',map.town.y);
// 			rimInsideStroke.setAttribute('r',map.town.r);
// 			rimInsideStroke.setAttribute('fill','black');
// 			rimInsideStroke.setAttribute('opacity',0.2);
// 		};
		for (var building of map.buildings) {
// 			var foundation = document.createElementNS('http://www.w3.org/2000/svg','circle');
// 			sectionGroup.appendChild(foundation);
// 			foundation.setAttribute('cx',building.x);
// 			foundation.setAttribute('cy',building.y);
// 			foundation.setAttribute('r',building.r);
// 			foundation.setAttribute('fill',map.backgroundColor);
			var buildingUse = document.createElementNS('http://www.w3.org/2000/svg','use');
			sectionGroup.appendChild(buildingUse);
			buildingUse.setAttribute('x',building.x);
			buildingUse.setAttribute('y',building.y);
			buildingUse.setAttribute('transform','rotate('+view.r2d(building.rotation)+' '+building.x+' '+building.y+')');
			view.setHref(buildingUse,building.sprite);
			var shaderUse = document.createElementNS('http://www.w3.org/2000/svg','use');
			sectionGroup.appendChild(shaderUse);
			shaderUse.setAttribute('x',building.x);
			shaderUse.setAttribute('y',building.y);
			shaderUse.setAttribute('clip-path','url(#'+building.id+'ClipPath'+')');
			if (building.rotation < Math.PI) {
				shaderUse.setAttribute('transform','rotate('+view.r2d(building.rotation)+' '+building.x+' '+building.y+') translate('+building.x+' '+building.y+') translate('+(-1*building.x)+' '+(-1*building.y)+')');
			} else {
				shaderUse.setAttribute('transform','rotate('+view.r2d(building.rotation)+' '+building.x+' '+building.y+') translate('+building.x+' '+building.y+') scale(-1,1) translate('+(-1*building.x)+' '+(-1*building.y)+')');
			};
			view.setHref(shaderUse,building.sprite+'Shader');
			var opacity = building.rotation;
			if (building.rotation > Math.PI) {
				opacity = building.rotation - Math.PI;
			};
			opacity = (Math.PI/2 - Math.abs(opacity - Math.PI/2))/(Math.PI/2);
			shaderUse.setAttribute('opacity',opacity);
		};
		for (var mooringTower of map.mooringTowers) {
			var towerGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
			sectionGroup.appendChild(towerGroup);
			var foundation = document.createElementNS('http://www.w3.org/2000/svg','use');
			foundation.setAttribute('x',mooringTower.x);
			foundation.setAttribute('y',mooringTower.y);
			foundation.setAttribute('fill',map.backgroundColor);
			foundation.setAttribute('transform','translate('+(mooringTower.x)+' '+(mooringTower.y)+') scale(0.06) translate('+(mooringTower.x*-1)+' '+(mooringTower.y*-1)+')');
			view.setHref(foundation,'tileHex');
			towerGroup.appendChild(foundation);
			var mooringUse = document.createElementNS('http://www.w3.org/2000/svg','use');
			mooringUse.setAttribute('x',mooringTower.x);
			mooringUse.setAttribute('y',mooringTower.y);
			mooringUse.setAttribute('fill',mooringTower.fill);
			view.setHref(mooringUse,'mooringTower');
			towerGroup.appendChild(mooringUse);
			towerGroup.setAttribute('transform','rotate('+view.r2d(mooringTower.rotation)+' '+(mooringTower.x)+','+(mooringTower.y)+')');
			var mooringTargetUse = document.createElementNS('http://www.w3.org/2000/svg','use');
			mooringTargetUse.setAttribute('x',mooringTower.x);
			mooringTargetUse.setAttribute('y',mooringTower.y);
			mooringTargetUse.setAttribute('fill',mooringTower.fill);
			view.setHref(mooringTargetUse,'mooringTarget');
			towerGroup.appendChild(mooringTargetUse);
			mooringTargetUse.id = mooringTower.id+'Target';
			var targetReveal = document.createElementNS('http://www.w3.org/2000/svg','animate');
			targetReveal.id = 'targetReveal'+mooringTower.id;
			targetReveal.setAttribute('attributeName','opacity');
			targetReveal.setAttribute('attributeType','XML');
			targetReveal.setAttribute('from','0');
			targetReveal.setAttribute('to','1');
			targetReveal.setAttribute('dur','0.5s');
			targetReveal.setAttribute('begin','indefinite');
			targetReveal.setAttribute('fill','freeze');
			mooringTargetUse.appendChild(targetReveal);
			var targetFade = document.createElementNS('http://www.w3.org/2000/svg','animate');
			targetFade.id = 'targetFade'+mooringTower.id;
			targetFade.setAttribute('attributeName','opacity');
			targetFade.setAttribute('attributeType','XML');
			targetFade.setAttribute('from','1');
			targetFade.setAttribute('to','0');
			targetFade.setAttribute('dur','0.7s');
			targetFade.setAttribute('begin','indefinite');
			targetFade.setAttribute('fill','freeze');
			mooringTargetUse.appendChild(targetFade);
		};
		if (map.town !== undefined) {
			var townLabelShadow = document.createElementNS('http://www.w3.org/2000/svg','text');
			sectionGroup.appendChild(townLabelShadow);
			townLabelShadow.setAttribute('x',map.town.x+0.75);
			townLabelShadow.setAttribute('y',map.town.y+0.75);
			townLabelShadow.setAttribute('text-anchor','middle');
			townLabelShadow.setAttribute('font-size',6);
			townLabelShadow.innerHTML = map.town.name;
			var townLabel = document.createElementNS('http://www.w3.org/2000/svg','text');
			sectionGroup.appendChild(townLabel);
			townLabel.setAttribute('x',map.town.x);
			townLabel.setAttribute('y',map.town.y);
			townLabel.setAttribute('text-anchor','middle');
			townLabel.setAttribute('font-size',6);
			townLabel.setAttribute('fill','white');
			townLabel.setAttribute('stroke','black');
			townLabel.setAttribute('paint-order','stroke');
			townLabel.innerHTML = map.town.name;
		};

		// Landmarks
// 		for (var landmark of map.landmarks) {
// 			var landmarkUse = document.createElementNS('http://www.w3.org/2000/svg','use');
// 			landmarkUse.setAttribute('x',landmark.x);
// 			landmarkUse.setAttribute('y',landmark.y);
// 			landmarkUse.setAttribute('fill',landmark.fill);
// 			view.setHref(landmarkUse,landmark.glyph);
// 			sectionGroup.appendChild(landmarkUse);
// 		};
		
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
		rumbleAnimation.setAttribute('to','1');
		rumbleAnimation.setAttribute('dur','0.1s');
		rumbleAnimation.setAttribute('begin','indefinite');
		var rumbleAnimation = document.createElementNS('http://www.w3.org/2000/svg','animateTransform');
		rumbleGroup.appendChild(rumbleAnimation);
		rumbleAnimation.id = 'rumbleAnimation2';
		rumbleAnimation.setAttribute('attributeName','transform');
		rumbleAnimation.setAttribute('attributeType','XML');
		rumbleAnimation.setAttribute('type','rotate');
		rumbleAnimation.setAttribute('from','1');
		rumbleAnimation.setAttribute('to','0');
		rumbleAnimation.setAttribute('dur','0.1s');
		rumbleAnimation.setAttribute('begin','rumbleAnimation.end');
		var rumbleAnimation = document.createElementNS('http://www.w3.org/2000/svg','animateTransform');
		rumbleGroup.appendChild(rumbleAnimation);
		rumbleAnimation.id = 'rumbleAnimation3';
		rumbleAnimation.setAttribute('attributeName','transform');
		rumbleAnimation.setAttribute('attributeType','XML');
		rumbleAnimation.setAttribute('type','rotate');
		rumbleAnimation.setAttribute('from','0');
		rumbleAnimation.setAttribute('to','1');
		rumbleAnimation.setAttribute('dur','0.1s');
		rumbleAnimation.setAttribute('begin','rumbleAnimation2.end');
		var rumbleAnimation = document.createElementNS('http://www.w3.org/2000/svg','animateTransform');
		rumbleGroup.appendChild(rumbleAnimation);
		rumbleAnimation.id = 'rumbleAnimation4';
		rumbleAnimation.setAttribute('attributeName','transform');
		rumbleAnimation.setAttribute('attributeType','XML');
		rumbleAnimation.setAttribute('type','rotate');
		rumbleAnimation.setAttribute('from','1');
		rumbleAnimation.setAttribute('to','0');
		rumbleAnimation.setAttribute('dur','0.1s');
		rumbleAnimation.setAttribute('begin','rumbleAnimation3.end');
		
		var navMarkersGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
		navMarkersGroup.id = 'navMarkersGroup';
		rumbleGroup.appendChild(navMarkersGroup);
		
		var controlsGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
		controlsGroup.id = 'controlsGroup';
		rumbleGroup.appendChild(controlsGroup);
		var hideAnimation = document.createElementNS('http://www.w3.org/2000/svg','animateTransform');
		hideAnimation.id = 'controlsHideAnimation';
		hideAnimation.setAttribute('attributeName','transform');
		hideAnimation.setAttribute('attributeType','XML');
		hideAnimation.setAttribute('type','translate');
		hideAnimation.setAttribute('from','0 0');
		hideAnimation.setAttribute('to','0 100');
		hideAnimation.setAttribute('dur','1s');
		hideAnimation.setAttribute('begin','indefinite');
		hideAnimation.setAttribute('fill','freeze');
		controlsGroup.appendChild(hideAnimation);
		var revealAnimation = document.createElementNS('http://www.w3.org/2000/svg','animateTransform');
		revealAnimation.id = 'controlsRevealAnimation';
		revealAnimation.setAttribute('attributeName','transform');
		revealAnimation.setAttribute('attributeType','XML');
		revealAnimation.setAttribute('type','translate');
		revealAnimation.setAttribute('from','0 100');
		revealAnimation.setAttribute('to','0 0');
		revealAnimation.setAttribute('dur','1s');
		revealAnimation.setAttribute('begin','indefinite');
		revealAnimation.setAttribute('fill','freeze');
		controlsGroup.appendChild(revealAnimation);
		
		var eotGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
		controlsGroup.appendChild(eotGroup);
		var eotControlsGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
		eotGroup.setAttribute('transform','translate(-1.9 -0.5) rotate(2 100 62)');
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
			var text = document.createElementNS('http://www.w3.org/2000/svg','text');
			text.setAttribute('x',93);
			text.setAttribute('y',7 + i*7);
			text.setAttribute('font-size',2);
			text.setAttribute('paint-order','stroke');
			text.setAttribute('text-anchor','middle');
			text.innerHTML = speedNames[i];
			eotGroup.appendChild(text);
			var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
			rect.setAttribute('x',83);
			rect.setAttribute('y',2 + i*7);
			rect.setAttribute('width',20);
			rect.setAttribute('height',7);
			rect.setAttribute('fill','green');
			rect.setAttribute('stroke','none');
			rect.setAttribute('opacity',0);
			rect.addEventListener('mouseenter',handlers.eotEnter.bind(this,i));
			rect.addEventListener('mouseleave',handlers.eotLeave);
			eotControlsGroup.appendChild(rect);
		};
		var eotBracket = document.createElementNS('http://www.w3.org/2000/svg','use');
		eotBracket.id = 'uiEOTBracket';
		eotGroup.appendChild(eotBracket);
		eotBracket.setAttribute('x',85);
		eotBracket.setAttribute('y',34);
		view.setHref(eotBracket,'eotBracket');
		eotGroup.appendChild(eotControlsGroup);

		var wheel = document.createElementNS('http://www.w3.org/2000/svg','use');
		view.setHref(wheel,'shipsWheel');
		wheel.id = 'uiWheel';
		controlsGroup.appendChild(wheel);
		wheel.setAttribute('y',62);
		wheel.setAttribute('transform','translate(0 62) rotate('+view.r2d(ship.rudder)+') translate(0 -62)');
		var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		controlsGroup.appendChild(rect);
		rect.setAttribute('x',0);
		rect.setAttribute('y',30);
		rect.setAttribute('width',35);
		rect.setAttribute('height',35);
		rect.setAttribute('fill','lime');
		rect.setAttribute('opacity',0);
		rect.addEventListener('mouseenter',handlers.wheelEnter.bind(this,'right'));
		rect.addEventListener('mouseleave',handlers.wheelLeave);
		var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		controlsGroup.appendChild(rect);
		rect.setAttribute('x',-35);
		rect.setAttribute('y',30);
		rect.setAttribute('width',35);
		rect.setAttribute('height',35);
		rect.setAttribute('fill','lime');
		rect.setAttribute('opacity',0);
		rect.addEventListener('mouseenter',handlers.wheelEnter.bind(this,'left'));
		rect.addEventListener('mouseleave',handlers.wheelLeave);
		
		var airspeedCasingRect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		controlsGroup.appendChild(airspeedCasingRect);
		airspeedCasingRect.setAttribute('x',67);
		airspeedCasingRect.setAttribute('y',55);
		airspeedCasingRect.setAttribute('rx',2);
		airspeedCasingRect.setAttribute('ry',2);
		airspeedCasingRect.setAttribute('width',20);
		airspeedCasingRect.setAttribute('height',20);
		airspeedCasingRect.setAttribute('fill','saddlebrown');
		airspeedCasingRect.setAttribute('stroke','black');
		var airspeedRect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		controlsGroup.appendChild(airspeedRect);
		airspeedRect.setAttribute('x',69);
		airspeedRect.setAttribute('y',57.5);
		airspeedRect.setAttribute('width',16);
		airspeedRect.setAttribute('height',3.5);
		airspeedRect.setAttribute('fill','lemonchiffon');
		airspeedRect.setAttribute('stroke','black');
		airspeedRect.setAttribute('stroke-width',0.5);
		var airspeedText = document.createElementNS('http://www.w3.org/2000/svg','text');
		controlsGroup.appendChild(airspeedText);
		airspeedText.id = 'uiAirspeed';
		airspeedText.setAttribute('x',83);
		airspeedText.setAttribute('y',60);
		airspeedText.setAttribute('font-size',2);
		airspeedText.setAttribute('text-anchor','end');
		
		var headingCasingRect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		controlsGroup.appendChild(headingCasingRect);
		headingCasingRect.setAttribute('x',28);
		headingCasingRect.setAttribute('y',50);
		headingCasingRect.setAttribute('rx',2);
		headingCasingRect.setAttribute('ry',2);
		headingCasingRect.setAttribute('width',14);
		headingCasingRect.setAttribute('height',20);
		headingCasingRect.setAttribute('fill','saddlebrown');
		headingCasingRect.setAttribute('stroke','black');
		var headingRect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		controlsGroup.appendChild(headingRect);
		headingRect.setAttribute('x',30);
		headingRect.setAttribute('y',52);
		headingRect.setAttribute('width',10);
		headingRect.setAttribute('height',9.25);
		headingRect.setAttribute('fill','lightgoldenrodyellow');
		headingRect.setAttribute('stroke','black');
		headingRect.setAttribute('stroke-width',0.5);
		var headingText = document.createElementNS('http://www.w3.org/2000/svg','text');
		controlsGroup.appendChild(headingText);
		headingText.id = 'uiHeadingCardinal';
		headingText.setAttribute('x',35);
		headingText.setAttribute('y',57);
		headingText.setAttribute('font-size',4);
		headingText.setAttribute('text-anchor','middle');
		var headingText = document.createElementNS('http://www.w3.org/2000/svg','text');
		controlsGroup.appendChild(headingText);
		headingText.id = 'uiHeading';
		headingText.setAttribute('x',35);
		headingText.setAttribute('y',60);
		headingText.setAttribute('font-size',2);
		headingText.setAttribute('text-anchor','middle');
		
		var mapGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
		rumbleGroup.appendChild(mapGroup);
		mapGroup.id = 'mapGroup';
		mapGroup.addEventListener('click',handlers.toggleMapPane);
		var mapBoard = document.createElementNS('http://www.w3.org/2000/svg','rect')
		mapGroup.appendChild(mapBoard);
		mapBoard.setAttribute('fill','saddlebrown');
		mapBoard.setAttribute('stroke','black');
		mapBoard.setAttribute('stroke-width',0.5);
		mapBoard.setAttribute('x',-101);
		mapBoard.setAttribute('y',-63);
		mapBoard.setAttribute('width',40);
		mapBoard.setAttribute('height',40);
		var mapBG = document.createElementNS('http://www.w3.org/2000/svg','rect');
		mapGroup.appendChild(mapBG);
		mapBG.setAttribute('fill','cornsilk');
		mapBG.setAttribute('stroke','black');
		mapBG.setAttribute('stroke-width',0.5);
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
		var mapTileGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
		mapTileGroup.id = 'mapTileGroup';
		mapSVG.appendChild(mapTileGroup);
		var mapLegendsGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
		mapLegendsGroup.id = 'mapLegendsGroup';
		mapLegendsGroup.setAttribute('opacity',0);
		mapSVG.appendChild(mapLegendsGroup);
		var circle = document.createElementNS('http://www.w3.org/2000/svg','circle');
		mapGroup.appendChild(circle);
		circle.setAttribute('cx',-98 + 35/2);
		circle.setAttribute('cy',-60 + 35/2);
		circle.setAttribute('r',0.25);
		circle.setAttribute('fill','red');
		circle.setAttribute('stroke','black');
		circle.setAttribute('stroke-width',0.25);
		circle.setAttribute('paint-order','stroke');
		var maximizeMap = document.createElementNS('http://www.w3.org/2000/svg','animateTransform');
		maximizeMap.id = 'maximizeMap';
		maximizeMap.setAttribute('attributeName','transform');
		maximizeMap.setAttribute('attributeType','XML');
		maximizeMap.setAttribute('type','scale');
		maximizeMap.setAttribute('from','1');
		maximizeMap.setAttribute('to','2.5');
		maximizeMap.setAttribute('dur','0.5s');
		maximizeMap.setAttribute('begin','indefinite');
		maximizeMap.setAttribute('fill','freeze');
		maximizeMap.setAttribute('accumulate','sum');
		maximizeMap.setAttribute('additive','sum');
		mapGroup.appendChild(maximizeMap);
		var maximizeMapSlide = document.createElementNS('http://www.w3.org/2000/svg','animateTransform');
		maximizeMapSlide.id = 'maximizeMapSlide';
		maximizeMapSlide.setAttribute('attributeName','transform');
		maximizeMapSlide.setAttribute('attributeType','XML');
		maximizeMapSlide.setAttribute('type','translate');
		maximizeMapSlide.setAttribute('from','0 0');
		maximizeMapSlide.setAttribute('to','62 39');
		maximizeMapSlide.setAttribute('dur','0.5s');
		maximizeMapSlide.setAttribute('begin','indefinite');
		maximizeMapSlide.setAttribute('fill','freeze');
		maximizeMapSlide.setAttribute('accumulate','sum');
		maximizeMapSlide.setAttribute('additive','sum');
		mapGroup.appendChild(maximizeMapSlide);
		var minimizeMap = document.createElementNS('http://www.w3.org/2000/svg','animateTransform');
		minimizeMap.id = 'minimizeMap';
		minimizeMap.setAttribute('attributeName','transform');
		minimizeMap.setAttribute('attributeType','XML');
		minimizeMap.setAttribute('type','scale');
		minimizeMap.setAttribute('from','1');
		minimizeMap.setAttribute('to','0.4');
		minimizeMap.setAttribute('dur','0.5s');
		minimizeMap.setAttribute('begin','indefinite');
		minimizeMap.setAttribute('fill','freeze');
		minimizeMap.setAttribute('accumulate','sum');
		minimizeMap.setAttribute('additive','sum');
		mapGroup.appendChild(minimizeMap);
		var minimizeMapSlide = document.createElementNS('http://www.w3.org/2000/svg','animateTransform');
		minimizeMapSlide.id = 'minimizeMapSlide';
		minimizeMapSlide.setAttribute('attributeName','transform');
		minimizeMapSlide.setAttribute('attributeType','XML');
		minimizeMapSlide.setAttribute('type','translate');
		minimizeMapSlide.setAttribute('from','0 0');
		minimizeMapSlide.setAttribute('to','-155 -97.5');
		minimizeMapSlide.setAttribute('dur','0.5s');
		minimizeMapSlide.setAttribute('begin','indefinite');
		minimizeMapSlide.setAttribute('fill','freeze');
		minimizeMapSlide.setAttribute('accumulate','sum');
		minimizeMapSlide.setAttribute('additive','sum');
		mapGroup.appendChild(minimizeMapSlide);
		var clearMapTransforms = document.createElementNS('http://www.w3.org/2000/svg','animateTransform');
		clearMapTransforms.id = 'clearMapTransforms';
		clearMapTransforms.setAttribute('attributeName','transform');
		clearMapTransforms.setAttribute('attributeType','XML');
		clearMapTransforms.setAttribute('type','translate');
		clearMapTransforms.setAttribute('from','0 0');
		clearMapTransforms.setAttribute('to','0 0');
		clearMapTransforms.setAttribute('dur','0.1s');
		clearMapTransforms.setAttribute('begin','minimizeMapSlide.end');
		clearMapTransforms.setAttribute('fill','freeze');
		mapGroup.appendChild(clearMapTransforms);
		
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
		
		var gaugesGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
		controlsGroup.appendChild(gaugesGroup);
		gaugesGroup.setAttribute('transform','rotate(-2 -100 62)');
		var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		rect.setAttribute('x',-101);
		rect.setAttribute('y',30);
		rect.setAttribute('width',19);
		rect.setAttribute('height',35);
		rect.setAttribute('fill','saddlebrown');
		rect.setAttribute('stroke','black');
		rect.setAttribute('rx',1);
		rect.setAttribute('ry',1);
		gaugesGroup.appendChild(rect);
		var ids = ['provisionsGauge','chargeGauge','fuelGauge'];
		for (var i=0;i<3;i++) {
			var group = document.createElementNS('http://www.w3.org/2000/svg','g');
			gaugesGroup.appendChild(group);
			group.setAttribute('fill','lightslategray');
			group.setAttribute('stroke','black');
			group.setAttribute('stroke-width',0.5);
			var circle = document.createElementNS('http://www.w3.org/2000/svg','circle');
			group.appendChild(circle);
			circle.setAttribute('cx',-98 + i * 5 + 1.5);
			circle.setAttribute('cy',33);
			circle.setAttribute('r',1);
			var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
			rect.setAttribute('x',-98 + i * 5);
			rect.setAttribute('y',33);
			rect.setAttribute('width',3);
			rect.setAttribute('height',25);
			rect.setAttribute('rx',1.5);
			rect.setAttribute('ry',6);
			group.appendChild(rect);
			var circle = document.createElementNS('http://www.w3.org/2000/svg','circle');
			group.appendChild(circle);
			circle.setAttribute('cx',-98 + i * 5 + 1.5);
			circle.setAttribute('cy',58);
			circle.setAttribute('r',1);
			var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
			rect.setAttribute('x',-98 + i * 5 + 1.25);
			rect.setAttribute('y',32.5);
			rect.setAttribute('width',0.5);
			rect.setAttribute('height',26);
			rect.setAttribute('stroke','none');
			group.appendChild(rect);
			var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
			rect.id = ids[i];
			rect.setAttribute('x',-98 + i * 5 + 0.75);
			rect.setAttribute('y',38);
			rect.setAttribute('width',1.5);
			rect.setAttribute('height',15);
			rect.setAttribute('rx',0.5);
			rect.setAttribute('ry',0.5);
			rect.setAttribute('stroke','none');
			rect.setAttribute('fill','lime');
			rect.setAttribute('opacity',0.8);
			rect.setAttribute('transform','rotate(180 '+(-98 + i * 5 + 1.5)+' 45.5)');
			group.appendChild(rect);
			var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
			rect.setAttribute('x',-98 + i * 5 - 0.5);
			rect.setAttribute('y',36);
			rect.setAttribute('width',4);
			rect.setAttribute('height',1);
			rect.setAttribute('fill','gold');
			group.appendChild(rect);
			var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
			rect.setAttribute('x',-98 + i * 5 - 0.5);
			rect.setAttribute('y',54);
			rect.setAttribute('width',4);
			rect.setAttribute('height',1);
			rect.setAttribute('fill','gold');
			group.appendChild(rect);
			for (var l=0;l<5;l++) {
				var line = document.createElementNS('http://www.w3.org/2000/svg','line')
				group.appendChild(line);
				line.setAttribute('x1',-98 + i * 5 + 1.5);
				line.setAttribute('y1',38 + l * 15/4);
				line.setAttribute('x2',-98 + i * 5 + 3);
				line.setAttribute('y2',38 + l * 15/4);
				line.setAttribute('stroke-width',0.25);
			};
			var text = document.createElementNS('http://www.w3.org/2000/svg','text');
			group.appendChild(text);
			text.setAttribute('x',-98 + i * 5 + 1.5);
			text.setAttribute('y',61.5);
			text.setAttribute('font-size',2.5);
			text.setAttribute('text-anchor','middle');
			text.setAttribute('fill','gold');
			text.setAttribute('paint-order','stroke');
			text.setAttribute('stroke-width',1);
			text.innerHTML = ids[i].charAt(0);
		};
		
		var soundGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
		rumbleGroup.appendChild(soundGroup);
		soundGroup.addEventListener('mouseenter',view.revealSoundControls);
		soundGroup.addEventListener('mouseleave',view.hideSoundControls);
		
		var soundControls = document.createElementNS('http://www.w3.org/2000/svg','g');
		soundGroup.appendChild(soundControls);
		var soundControlsReveal = document.createElementNS('http://www.w3.org/2000/svg','animateTransform');
		soundControls.appendChild(soundControlsReveal);
		soundControlsReveal.id = 'soundControlsReveal';
		soundControlsReveal.setAttribute('attributeName','transform');
		soundControlsReveal.setAttribute('attributeType','XML');
		soundControlsReveal.setAttribute('type','translate');
		soundControlsReveal.setAttribute('from','0');
		soundControlsReveal.setAttribute('to','-50');
		soundControlsReveal.setAttribute('dur','0.2s');
		soundControlsReveal.setAttribute('begin','indefinite');
		soundControlsReveal.setAttribute('fill','freeze');
		var soundControlsHide = document.createElementNS('http://www.w3.org/2000/svg','animateTransform');
		soundControls.appendChild(soundControlsHide);
		soundControlsHide.id = 'soundControlsHide';
		soundControlsHide.setAttribute('attributeName','transform');
		soundControlsHide.setAttribute('attributeType','XML');
		soundControlsHide.setAttribute('type','translate');
		soundControlsHide.setAttribute('from','-50');
		soundControlsHide.setAttribute('to','0');
		soundControlsHide.setAttribute('dur','0.2s');
		soundControlsHide.setAttribute('begin','indefinite');
		soundControlsHide.setAttribute('fill','freeze');
		var soundPanel = document.createElementNS('http://www.w3.org/2000/svg','rect');
		soundControls.appendChild(soundPanel);
		soundPanel.setAttribute('x',106);
		soundPanel.setAttribute('y',-57);
		soundPanel.setAttribute('width',55);
		soundPanel.setAttribute('height',10);
		soundPanel.setAttribute('fill','saddlebrown');
		soundPanel.setAttribute('stroke','black');
		soundPanel.setAttribute('stroke-width',0.5);
		var soundButtonLabels = ['Go','Sk','+','-','X'];
		var soundButtonsArray = [];
		for (var i=0;i<5;i++) {
			var buttonGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
			soundControls.appendChild(buttonGroup);
			soundButtonsArray.push(buttonGroup);
			var button = document.createElementNS('http://www.w3.org/2000/svg','rect');
			buttonGroup.appendChild(button);
			button.setAttribute('x',109 + i * 8);
			button.setAttribute('y',-55);
			button.setAttribute('width',6);
			button.setAttribute('height',6);
			button.setAttribute('fill','gainsboro');
			button.setAttribute('stroke','black');
			button.setAttribute('stroke-width',0.5);
		}
		soundButtonsArray[0].addEventListener('click',handlers.soundtrackPlayPause);
		soundButtonsArray[1].addEventListener('click',handlers.soundtrackSkip);
		soundButtonsArray[2].addEventListener('click',handlers.soundtrackVolumeUp);
		soundButtonsArray[3].addEventListener('click',handlers.soundtrackVolumeDown);
		soundButtonsArray[4].addEventListener('click',handlers.soundtrackMute);
		
		var playShape = document.createElementNS('http://www.w3.org/2000/svg','path');
		soundButtonsArray[0].appendChild(playShape);
		playShape.setAttribute('d','M111,-54 v4 l2 -2 l-2 -2');
		playShape.setAttribute('opacity',0);
		playShape.id = 'soundControlsPlayShape';
		
		var pauseShape = document.createElementNS('http://www.w3.org/2000/svg','path');
		soundButtonsArray[0].appendChild(pauseShape);
		pauseShape.setAttribute('d','M110.5,-54 v4 h1 v-4 h-1 m2 0 v4 h1 v-4 h-1');
		pauseShape.id = 'soundControlsPauseShape';
		
		var skipShape = document.createElementNS('http://www.w3.org/2000/svg','path');
		soundButtonsArray[1].appendChild(skipShape);
		skipShape.setAttribute('d','M118,-54 v4 l2 -2 v2 h1 v-4 h-1 v2 l-2 -2');
		
		var volumeUpText = document.createElementNS('http://www.w3.org/2000/svg','text');
		soundButtonsArray[2].appendChild(volumeUpText);
		volumeUpText.innerHTML = "+";
		volumeUpText.setAttribute('x',128);
		volumeUpText.setAttribute('y',-50);
		volumeUpText.setAttribute('text-anchor','middle');
		volumeUpText.setAttribute('font-size',6);
		
		var volumeDownText = document.createElementNS('http://www.w3.org/2000/svg','text');
		soundButtonsArray[3].appendChild(volumeDownText);
		volumeDownText.innerHTML = "-";
		volumeDownText.setAttribute('x',136);
		volumeDownText.setAttribute('y',-50);
		volumeDownText.setAttribute('text-anchor','middle');
		volumeDownText.setAttribute('font-size',6);
		
		var volumeMuteText = document.createElementNS('http://www.w3.org/2000/svg','text');
		soundButtonsArray[4].appendChild(volumeMuteText);
		volumeMuteText.innerHTML = "&#215; ";
		volumeMuteText.setAttribute('x',144);
		volumeMuteText.setAttribute('y',-50);
		volumeMuteText.setAttribute('text-anchor','middle');
		volumeMuteText.setAttribute('font-size',6);
		volumeMuteText.setAttribute('fill','darkred');
		
		var voicepipe = document.createElementNS('http://www.w3.org/2000/svg','path');
		soundGroup.appendChild(voicepipe);
		voicepipe.setAttribute('fill','grey');
		voicepipe.setAttribute('stroke','black');
		voicepipe.setAttribute('stroke-width',0.5);
		voicepipe.setAttribute('stroke-linejoin','round');
		var d = 'M93.5,-61 h1 l2,2 ';
		d += 'h0.25 q 1,0 1,-1 v-10 h2 v11 q 0 2 -2 2 h-1.25';
		d += ' l-2,2 h-1 z';
		voicepipe.setAttribute('d',d);
		var funnel = document.createElementNS('http://www.w3.org/2000/svg','ellipse');
		soundGroup.appendChild(funnel);
		funnel.setAttribute('cx',93.5);
		funnel.setAttribute('cy',-58);
		funnel.setAttribute('rx',1.5);
		funnel.setAttribute('ry',3);
		funnel.setAttribute('stroke','black');
		funnel.setAttribute('stroke-width',0.5);
		funnel.setAttribute('fill','#444');
		var songCreditLink = document.createElementNS('http://www.w3.org/2000/svg','a');
		soundGroup.appendChild(songCreditLink);
		songCreditLink.id = 'songCreditLink';
		songCreditLink.setAttribute('target','songcredit');
		songCreditLink.setAttribute('href','http://google.com');
		songCreditLink.setAttribute('opacity',0);
		var songNameText = document.createElementNS('http://www.w3.org/2000/svg','text');
		songCreditLink.appendChild(songNameText);
		songNameText.id = 'songNameText';
		songNameText.setAttribute('x',91);
		songNameText.setAttribute('y',-58);
		songNameText.setAttribute('text-anchor','end');
		songNameText.setAttribute('font-size',2.5);
		songNameText.setAttribute('stroke','white');
		songNameText.setAttribute('stroke-width',0.5);
		songNameText.setAttribute('paint-order','stroke');
		songNameText.innerHTML = 'Test Value Song Name';
		var songCreditText = document.createElementNS('http://www.w3.org/2000/svg','text');
		songCreditLink.appendChild(songCreditText);
		songCreditText.id = 'songCreditText';
		songCreditText.setAttribute('x',91);
		songCreditText.setAttribute('y',-56.25);
		songCreditText.setAttribute('text-anchor','end');
		songCreditText.setAttribute('font-size',1.75);
		songCreditText.setAttribute('stroke','white');
		songCreditText.setAttribute('stroke-width',0.5);
		songCreditText.setAttribute('paint-order','stroke');
		songCreditText.innerHTML = 'Test Value Song Credit';
		var songReveal = document.createElementNS('http://www.w3.org/2000/svg','animate');
		songCreditLink.appendChild(songReveal);
		songReveal.id = 'songReveal';
		songReveal.setAttribute('attributeName','opacity');
		songReveal.setAttribute('attributeType','XML');
		songReveal.setAttribute('from','0');
		songReveal.setAttribute('to','1');
		songReveal.setAttribute('dur','0.2s');
		songReveal.setAttribute('begin','indefinite');
		songReveal.setAttribute('fill','freeze');
		var songFade = document.createElementNS('http://www.w3.org/2000/svg','animate');
		songCreditLink.appendChild(songFade);
		songFade.id = 'songFade';
		songFade.setAttribute('attributeName','opacity');
		songFade.setAttribute('attributeType','XML');
		songFade.setAttribute('from','1');
		songFade.setAttribute('to','0');
		songFade.setAttribute('dur','5s');
		songFade.setAttribute('begin','indefinite');
		songFade.setAttribute('fill','freeze');
		
		var townGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
		townGroup.id = 'townGroup';
		rumbleGroup.appendChild(townGroup);
		var tabsGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
		tabsGroup.id = 'tabsGroup';
		townGroup.appendChild(tabsGroup);
		townGroup.setAttribute('transform','translate(0,100)');
		var hideAnimation = document.createElementNS('http://www.w3.org/2000/svg','animateTransform');
		hideAnimation.id = 'townHideAnimation';
		hideAnimation.setAttribute('attributeName','transform');
		hideAnimation.setAttribute('attributeType','XML');
		hideAnimation.setAttribute('type','translate');
		hideAnimation.setAttribute('from','0 0');
		hideAnimation.setAttribute('to','0 100');
		hideAnimation.setAttribute('dur','1s');
		hideAnimation.setAttribute('begin','indefinite');
		hideAnimation.setAttribute('fill','freeze');
		townGroup.appendChild(hideAnimation);
		var revealAnimation = document.createElementNS('http://www.w3.org/2000/svg','animateTransform');
		revealAnimation.id = 'townRevealAnimation';
		revealAnimation.setAttribute('attributeName','transform');
		revealAnimation.setAttribute('attributeType','XML');
		revealAnimation.setAttribute('type','translate');
		revealAnimation.setAttribute('from','0 100');
		revealAnimation.setAttribute('to','0 0');
		revealAnimation.setAttribute('dur','1s');
		revealAnimation.setAttribute('begin','indefinite');
		revealAnimation.setAttribute('fill','freeze');
		townGroup.appendChild(revealAnimation);
		
		var purseGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
		townGroup.appendChild(purseGroup);
		purseGroup.id = 'purseGroup';
		purseGroup.setAttribute('stroke-width',0.5);
		purseGroup.setAttribute('stroke','black');
		var ellipse = document.createElementNS('http://www.w3.org/2000/svg','ellipse');
		ellipse.setAttribute('cx',95.5);
		ellipse.setAttribute('cy',55);
		ellipse.setAttribute('rx',4);
		ellipse.setAttribute('ry',5);
		ellipse.setAttribute('fill','gold');
		purseGroup.appendChild(ellipse);
		var ellipse = document.createElementNS('http://www.w3.org/2000/svg','ellipse');
		ellipse.setAttribute('cx',94);
		ellipse.setAttribute('cy',55);
		ellipse.setAttribute('rx',4);
		ellipse.setAttribute('ry',5);
		ellipse.setAttribute('fill','gold');
		purseGroup.appendChild(ellipse);
		var line = document.createElementNS('http://www.w3.org/2000/svg','line');
		line.setAttribute('x1',94);
		line.setAttribute('y1',50);
		line.setAttribute('x2',95.5);
		line.setAttribute('y2',50);
		line.setAttribute('fill','gold');
		purseGroup.appendChild(line);
		var line = document.createElementNS('http://www.w3.org/2000/svg','line');
		line.setAttribute('x1',94);
		line.setAttribute('y1',60);
		line.setAttribute('x2',95.5);
		line.setAttribute('y2',60);
		line.setAttribute('fill','gold');
		purseGroup.appendChild(line);
		var text = document.createElementNS('http://www.w3.org/2000/svg','text');
		text.setAttribute('x',94);
		text.setAttribute('y',55.5);
		text.setAttribute('text-anchor','middle');
		text.setAttribute('font-size',2);
		text.setAttribute('fill','black');
		text.setAttribute('stroke','gold');
		text.setAttribute('paint-order','stroke');
		purseGroup.appendChild(text);
		text.id = 'purseText';
		
		var crewGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
		uiGroup.appendChild(crewGroup);
		crewGroup.id='crewGroup';
		crewGroup.setAttribute('transform','translate(-120 0)');
		var crewGroupReveal = document.createElementNS('http://www.w3.org/2000/svg','animateTransform');
		crewGroupReveal.id = 'crewGroupReveal';
		crewGroupReveal.setAttribute('attributeType','XML');
		crewGroupReveal.setAttribute('attributeName','transform');
		crewGroupReveal.setAttribute('type','translate');
		crewGroupReveal.setAttribute('from','-120 0');
		crewGroupReveal.setAttribute('to','0 0');
		crewGroupReveal.setAttribute('dur','0.3s');
		crewGroupReveal.setAttribute('begin','indefinite');
		crewGroupReveal.setAttribute('fill','freeze');
		crewGroup.appendChild(crewGroupReveal);
		var crewGroupHide = document.createElementNS('http://www.w3.org/2000/svg','animateTransform');
		crewGroupHide.id = 'crewGroupHide';
		crewGroupHide.setAttribute('attributeType','XML');
		crewGroupHide.setAttribute('attributeName','transform');
		crewGroupHide.setAttribute('type','translate');
		crewGroupHide.setAttribute('from','-0 0');
		crewGroupHide.setAttribute('to','-120 0');
		crewGroupHide.setAttribute('dur','0.3s');
		crewGroupHide.setAttribute('begin','indefinite');
		crewGroupHide.setAttribute('fill','freeze');
		crewGroup.appendChild(crewGroupHide);
		var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		crewGroup.appendChild(rect);
		rect.setAttribute('x',-105);
		rect.setAttribute('y',-50);
		rect.setAttribute('width',120);
		rect.setAttribute('height',100);
		rect.setAttribute('fill','saddlebrown');
		rect.setAttribute('stroke','black');
		rect.setAttribute('stroke-width',0.5);
		var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		crewGroup.appendChild(rect);
		rect.setAttribute('x',12.5);
		rect.setAttribute('y',-5);
		rect.setAttribute('rx',0.5);
		rect.setAttribute('ry',0.5);
		rect.setAttribute('width',1);
		rect.setAttribute('height',10);
		rect.setAttribute('fill','black');
		rect.setAttribute('stroke','black');
		rect.setAttribute('stroke-width',0.5);
		rect.setAttribute('opacity',0.5);
		var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		crewGroup.appendChild(rect);
		rect.setAttribute('x',10);
		rect.setAttribute('y',-50);
		rect.setAttribute('width',5);
		rect.setAttribute('height',100);
		rect.setAttribute('fill','lime');
		rect.setAttribute('opacity',0);
		rect.addEventListener('click',view.minimizeCrewPane);
		var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		crewGroup.appendChild(rect);
		rect.setAttribute('x',-50);
		rect.setAttribute('y',-48);
		rect.setAttribute('width',60);
		rect.setAttribute('height',96);
		rect.setAttribute('fill','lemonchiffon');
		rect.setAttribute('stroke','black');
		rect.setAttribute('stroke-width',0.5);
		var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		crewGroup.appendChild(rect);
		rect.setAttribute('x',-92);
		rect.setAttribute('y',-48);
		rect.setAttribute('width',40);
		rect.setAttribute('height',96);
		rect.setAttribute('fill','lemonchiffon');
		rect.setAttribute('stroke','black');
		rect.setAttribute('stroke-width',0.5);
		var crewListGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
		crewGroup.appendChild(crewListGroup);
		crewListGroup.id='crewListGroup';
		var crewWindowGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
		crewGroup.appendChild(crewWindowGroup);
		crewWindowGroup.id='crewWindowGroup';
		
		var eventsGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
		uiGroup.appendChild(eventsGroup);
		eventsGroup.id = 'eventsGroup';
	},
	
	buildTownUI: function(town) {
		var tabsGroup = document.getElementById('tabsGroup');
		tabsGroup.innerHTML = '';
		var tabs = town.amenities;
		var tabMargin = 5;
		var tabWidth = (180 - tabMargin*(tabs.length-1))/tabs.length;
		var tabNodes = [];
		for (var b in tabs) {
			var tabGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
			tabsGroup.appendChild(tabGroup);
			tabGroup.id = 'townTab'+b;
			var tabTopGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
			tabGroup.appendChild(tabTopGroup);
			tabTopGroup.addEventListener('click',view.toggleTownTab.bind(this,b));
			var tab = document.createElementNS('http://www.w3.org/2000/svg','rect');
			tabTopGroup.appendChild(tab);
			tab.setAttribute('x',-90 + b * (tabWidth+tabMargin));
			tab.setAttribute('width',tabWidth);
			tab.setAttribute('y',50);
			tab.setAttribute('height',60);
			tab.setAttribute('rx',3);
			tab.setAttribute('ry',3);
			tab.setAttribute('fill','goldenrod');
			tab.setAttribute('stroke','darkgoldenrod');
			var text = document.createElementNS('http://www.w3.org/2000/svg','text');
			tabTopGroup.appendChild(text);
			text.setAttribute('x',-90 + b * (tabWidth+tabMargin) + tabWidth/2);
			text.setAttribute('y',57);
			text.setAttribute('text-anchor','middle');
			text.setAttribute('font-size',5);
			text.innerHTML = tabs[b].name;
			var pane = document.createElementNS('http://www.w3.org/2000/svg','rect');
			tabGroup.appendChild(pane);
			pane.setAttribute('x',-90);
			pane.setAttribute('width',180);
			pane.setAttribute('y',62);
			pane.setAttribute('height',100);
			pane.setAttribute('stroke','darkgoldenrod');
			pane.setAttribute('fill','goldenrod');
			var hideAnimation = document.createElementNS('http://www.w3.org/2000/svg','animateTransform');
			hideAnimation.id = 'townTab'+b+'HideAnimation';
			hideAnimation.setAttribute('attributeName','transform');
			hideAnimation.setAttribute('attributeType','XML');
			hideAnimation.setAttribute('type','translate');
			hideAnimation.setAttribute('from','0 -100');
			hideAnimation.setAttribute('to','0 0');
			hideAnimation.setAttribute('dur','0.3s');
			hideAnimation.setAttribute('begin','indefinite');
			hideAnimation.setAttribute('fill','freeze');
			tabGroup.appendChild(hideAnimation);
			var revealAnimation = document.createElementNS('http://www.w3.org/2000/svg','animateTransform');
			revealAnimation.id = 'townTab'+b+'RevealAnimation';
			revealAnimation.setAttribute('attributeName','transform');
			revealAnimation.setAttribute('attributeType','XML');
			revealAnimation.setAttribute('type','translate');
			revealAnimation.setAttribute('from','0 0');
			revealAnimation.setAttribute('to','0 -100');
			revealAnimation.setAttribute('dur','0.3s');
			revealAnimation.setAttribute('begin','indefinite');
			revealAnimation.setAttribute('fill','freeze');
			tabGroup.appendChild(revealAnimation);
		
			var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
			rect.setAttribute('x',-87.5);
			rect.setAttribute('y',65);
			rect.setAttribute('width',175);
			rect.setAttribute('height',90);
			rect.setAttribute('fill','lemonchiffon');
			rect.setAttribute('stroke','black');
			tabGroup.appendChild(rect);
			
			var contentGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
			tabGroup.appendChild(contentGroup);
			contentGroup.id = 'townTab'+b+'Content';
			
			if (tabs[b].name == 'Tavern') {
				contentGroup.appendChild(view.buildTavernUI(tabs[b]));
			} else if (tabs[b].name == 'Wharf') {
				contentGroup.appendChild(view.buildWharfUI(tabs[b]));
			} else if (tabs[b].name == 'Shipyard') {
				contentGroup.appendChild(view.buildShipyardUI(tabs[b]));
			} else if (tabs[b].name == 'Hopsital') {
				contentGroup.appendChild(view.buildHospitalUI(tabs[b]));
			} else if (tabs[b].name == 'Temple') {
				contentGroup.appendChild(view.buildTempleUI(tabs[b]));
			};
		};
		
	},
	
	buildTavernUI: function(tavern) {
		var paneGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
		paneGroup.setAttribute('transform','translate(0,100)');
		
		// Pane Bounds: x -85 to 85, y -33 to 50 (corrected)
		
		var rumorBacking = document.createElementNS('http://www.w3.org/2000/svg','rect');
		paneGroup.appendChild(rumorBacking);
		rumorBacking.setAttribute('x',-78);
		rumorBacking.setAttribute('y',-30);
		rumorBacking.setAttribute('width',76);
		rumorBacking.setAttribute('height',75);
		rumorBacking.setAttribute('stroke','goldenrod');
		rumorBacking.setAttribute('fill','lemonchiffon');
		
		var foreignObject = document.createElementNS('http://www.w3.org/2000/svg','foreignObject');
		paneGroup.appendChild(foreignObject);
		foreignObject.setAttribute('x',-75);
		foreignObject.setAttribute('y',-20);
		foreignObject.setAttribute('width',70);
		foreignObject.setAttribute('height',63);
		
		var div = document.createElement('div');
		foreignObject.appendChild(div);
		div.id = 'rumorsDiv';
		
		var rumorCover = document.createElementNS('http://www.w3.org/2000/svg','rect');
		paneGroup.appendChild(rumorCover);
		rumorCover.setAttribute('x',-78);
		rumorCover.setAttribute('y',-30);
		rumorCover.setAttribute('width',76);
		rumorCover.setAttribute('height',75);
		rumorCover.setAttribute('stroke','lemonchiffon');
		rumorCover.setAttribute('stroke-width',2);
		rumorCover.setAttribute('fill','lemonchiffon');
		var rumorCoverRollup = document.createElementNS('http://www.w3.org/2000/svg','animate');
		rumorCover.appendChild(rumorCoverRollup);
		rumorCoverRollup.id = 'rumorCoverRollup';
		rumorCoverRollup.setAttribute('attributeType','XML');
		rumorCoverRollup.setAttribute('attributeName','height');
		rumorCoverRollup.setAttribute('from',75);
		rumorCoverRollup.setAttribute('to',2);
		rumorCoverRollup.setAttribute('dur',0.7);
		rumorCoverRollup.setAttribute('fill','freeze');
		rumorCoverRollup.setAttribute('begin','indefinite');
		
		var buyRoundButton = document.createElementNS('http://www.w3.org/2000/svg','g');
		paneGroup.appendChild(buyRoundButton);
		var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		buyRoundButton.appendChild(rect);
		rect.setAttribute('x',-80);
		rect.setAttribute('y',38);
		rect.setAttribute('rx',5);
		rect.setAttribute('ry',5);
		rect.setAttribute('width',80);
		rect.setAttribute('height',10);
		rect.setAttribute('fill','goldenrod');
		rect.setAttribute('stroke','black');
		var text = document.createElementNS('http://www.w3.org/2000/svg','text');
		buyRoundButton.appendChild(text);
		text.setAttribute('x',-66);
		text.setAttribute('y',44);
		text.setAttribute('font-size',3.25);
		text.innerHTML = "First Round's On Me, 'Mateys! ($10)";
		var mugUse = document.createElementNS('http://www.w3.org/2000/svg','use');
		buyRoundButton.appendChild(mugUse);
		view.setHref(mugUse,'mug');
		mugUse.setAttribute('x',-74);
		mugUse.setAttribute('y',43);
		var buyRoundRise = document.createElementNS('http://www.w3.org/2000/svg','animateTransform');
		buyRoundButton.appendChild(buyRoundRise);
		buyRoundRise.id = 'buyRoundRise';
		buyRoundRise.setAttribute('attributeType','XML');
		buyRoundRise.setAttribute('attributeName','transform');
		buyRoundRise.setAttribute('type','translate');
		buyRoundRise.setAttribute('from','0 0');
		buyRoundRise.setAttribute('to','0 -71');
		buyRoundRise.setAttribute('dur',0.7);
		buyRoundRise.setAttribute('fill','freeze');
		buyRoundRise.setAttribute('begin','indefinite');
		buyRoundButton.addEventListener('click',handlers.firstRound);
		var mugTip = document.createElementNS('http://www.w3.org/2000/svg','animateTransform');
		mugUse.appendChild(mugTip);
		mugTip.id = 'mugTip';
		mugTip.setAttribute('attributeType','XML');
		mugTip.setAttribute('attributeName','transform');
		mugTip.setAttribute('type','rotate');
		mugTip.setAttribute('from','0 -74 43');
		mugTip.setAttribute('to','30 -74 43');
		mugTip.setAttribute('dur',0.7);
		mugTip.setAttribute('fill','freeze');
		mugTip.setAttribute('begin','indefinite');
		
		var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		paneGroup.appendChild(rect);
		rect.setAttribute('x',8);
		rect.setAttribute('y',-30);
		rect.setAttribute('width',74);
		rect.setAttribute('height',75);
		rect.setAttribute('fill','none');
		rect.setAttribute('stroke','goldenrod');
		
		var recruitGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
		paneGroup.appendChild(recruitGroup);
		recruitGroup.id = 'recruitGroup';
		view.updateRecruitment(tavern,recruitGroup);
		
		view.panes.rumorsRevealed = false;
		
		return paneGroup;
	},
	
	updateRecruitment: function(tavern,node) {
		if (node == undefined) {
			var recruitGroup = document.getElementById('recruitGroup');
		} else {
			var recruitGroup = node;
		};
		
		recruitGroup.innerHTML = '';
		
		if (tavern.atTheBar == undefined) {
			recruitGroup.setAttribute('opacity',0.5);
			var text = document.createElementNS('http://www.w3.org/2000/svg','text');
			recruitGroup.appendChild(text);
			text.setAttribute('x',45);
			text.setAttribute('y',-20);
			text.setAttribute('font-size',2);
			text.setAttribute('text-anchor','middle');
			text.innerHTML = "No one seems to be looking for work.";
		} else {
			var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
			recruitGroup.appendChild(rect);
			rect.setAttribute('x',52);
			rect.setAttribute('y',-28);
			rect.setAttribute('width',28);
			rect.setAttribute('height',28);
			rect.setAttribute('fill','brown');
			rect.setAttribute('stroke','black');
			rect.setAttribute('stroke-width',0.25);
		
			tavern.atTheBar.npc.traitPose();
			var pic = tavern.atTheBar.npc.body.draw(500,750,'head');
			recruitGroup.appendChild(pic);
			pic.setAttribute('x',52);
			pic.setAttribute('y',-28);
			pic.setAttribute('width',28);
			pic.setAttribute('height',28);
		
			if (Object.keys(tavern.atTheBar.revelations).length == 0) {
				var text = document.createElementNS('http://www.w3.org/2000/svg','text');
				recruitGroup.appendChild(text);
				text.innerHTML = "An intriguing figure sits at the bar as if waiting.";
				text.setAttribute('x',45);
				text.setAttribute('y',12);
				text.setAttribute('font-size',2);
				text.setAttribute('text-anchor','middle');
				var buyDrinkButton = view.buildButton(['May I Buy You','a Drink? ($2)'],35,38,40,0.5);	
				recruitGroup.appendChild(buyDrinkButton);
				buyDrinkButton.addEventListener('click',handlers.atTheBarDrink.bind(this,tavern));
			} else if (tavern.atTheBar.lastDialogue !== undefined) {
				var fo = document.createElementNS('http://www.w3.org/2000/svg','foreignObject');
				recruitGroup.appendChild(fo);
				fo.setAttribute('x',12);
				fo.setAttribute('y',18);
				fo.setAttribute('width',67)
				fo.setAttribute('height',18);
				var dialogueDiv = document.createElement('div');
				dialogueDiv.id = 'dialogueDiv';
				fo.appendChild(dialogueDiv);
				dialogueDiv.innerHTML = '"'+tavern.atTheBar.lastDialogue+'"';
			};
		
			if (tavern.atTheBar.type == 'recruitable' && Object.keys(tavern.atTheBar.revelations).length > 0) {
				if (tavern.atTheBar.revelations.name) {
					var crewmateFirstName = document.createElementNS('http://www.w3.org/2000/svg','text');
					crewmateFirstName.setAttribute('x',12);
					crewmateFirstName.setAttribute('y',-6);
					crewmateFirstName.setAttribute('font-size',5);
					crewmateFirstName.innerHTML = tavern.atTheBar.npc.name.split(' ')[0];
					crewmateFirstName.setAttribute('stroke','lemonchiffon');
					crewmateFirstName.setAttribute('stroke-linejoin','round');
					crewmateFirstName.setAttribute('paint-order','stroke');
					recruitGroup.appendChild(crewmateFirstName);
					var crewmateSurname = document.createElementNS('http://www.w3.org/2000/svg','text');
					crewmateSurname.setAttribute('x',12);
					crewmateSurname.setAttribute('y',-1);
					crewmateSurname.setAttribute('font-size',5);
					crewmateSurname.innerHTML = tavern.atTheBar.npc.name.split(' ')[1];
					crewmateSurname.setAttribute('stroke','lemonchiffon');
					crewmateSurname.setAttribute('stroke-linejoin','round');
					crewmateSurname.setAttribute('paint-order','stroke');
					recruitGroup.appendChild(crewmateSurname);
				};
				var traitList = Object.keys(tavern.atTheBar.npc.traits);
				var string = '';
				for (var i in traitList) {
					if (tavern.atTheBar.revelations[traitList[i]]) {
						string += traitList[i];
					} else {
						string += "???";
					};
					if (i < traitList.length-1) {
						string += " ~ ";
					};
				};
				var text = document.createElementNS('http://www.w3.org/2000/svg','text');
				recruitGroup.appendChild(text);
				text.innerHTML = string;
				text.setAttribute('x',45);
				text.setAttribute('y',4);
				text.setAttribute('font-size',3);
				text.setAttribute('text-anchor','middle');
			
				var num, x=26, y=8;
				for (var statName in tavern.atTheBar.npc.stats) {
					if (tavern.atTheBar.revelations[statName]) {
						num = tavern.atTheBar.npc.stats[statName];
					} else {
						num = "???";
					};
					var text = document.createElementNS('http://www.w3.org/2000/svg','text');
					recruitGroup.appendChild(text);
					text.innerHTML = statName + ":";
					text.setAttribute('x',x-0.5);
					text.setAttribute('y',y);
					text.setAttribute('font-size',2);
					text.setAttribute('text-anchor','end');
					var text = document.createElementNS('http://www.w3.org/2000/svg','text');
					recruitGroup.appendChild(text);
					text.innerHTML = num;
					text.setAttribute('x',x+0.5);
					text.setAttribute('y',y);
					text.setAttribute('font-size',2);
					text.setAttribute('text-anchor','start');
					if (x==70) {x=26,y+=4} else {x+=22};
				};
		
				var anotherRoundButton = view.buildButton(["Let's Have",'Another ($2)'],12,38,40,0.5);	
				recruitGroup.appendChild(anotherRoundButton);
				anotherRoundButton.addEventListener('click',handlers.atTheBarAnother.bind(this,tavern));
		
				var chatButton = view.buildButton('Chat',35,38,40,0.5);	
				recruitGroup.appendChild(chatButton);
				chatButton.addEventListener('click',handlers.atTheBarChat.bind(this,tavern));
		
				var hireCost = tavern.atTheBar.npc.hireCost(tavern);
				var recruitButton = view.buildButton('Hire ($'+hireCost+')',58,38,40,0.5);
				recruitGroup.appendChild(recruitButton);
				recruitButton.addEventListener('click',handlers.atTheBarHire.bind(this,tavern));
			};
		};	
	},
	
	revealRumors: function() {
		var rumorsDiv = document.getElementById('rumorsDiv');
		rumorsDiv.innerHTML = '';
		var headerP = document.createElement('p');
		rumorsDiv.appendChild(headerP);
		headerP.innerHTML = "Once tongues are lubricated, talk begins to flow:";
		for (var i=0;i<4;i++) {
			var rumorP = document.createElement('p');
			rumorP.className = 'rumorP';
			rumorsDiv.appendChild(rumorP);
			rumorP.innerHTML = game.rumor();
		};
		document.getElementById('rumorCoverRollup').beginElement();
		document.getElementById('buyRoundRise').beginElement();
		document.getElementById('mugTip').beginElement();
		view.panes.rumorsRevealed = true;
	},
	
	buildWharfUI: function(wharf) {
		var paneGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
		paneGroup.setAttribute('transform','translate(0,100)');
		
		// Pane Bounds: x -85 to 85, y -33 to 50 (corrected)
		
		// Local Wares
		var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		paneGroup.appendChild(rect);
		rect.setAttribute('x',-82);
		rect.setAttribute('y',-30);
		rect.setAttribute('width',74);
		rect.setAttribute('height',75);
		rect.setAttribute('fill','none');
		rect.setAttribute('stroke','goldenrod');
		
		var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		paneGroup.appendChild(rect);
		rect.setAttribute('x',-82);
		rect.setAttribute('y',-30);
		rect.setAttribute('width',74);
		rect.setAttribute('height',5);
		rect.setAttribute('fill','goldenrod');
		rect.setAttribute('stroke','goldenrod');
		
		var text = document.createElementNS('http://www.w3.org/2000/svg','text');
		paneGroup.appendChild(text);
		text.setAttribute('x',-80);
		text.setAttribute('y',-26.5);
		text.setAttribute('font-size',3);
		text.innerHTML = "Local Wares";
		
		var row = -1;
		for (var commodityKey in wharf.localWares) {
			commodity = wharf.localWares[commodityKey];
			if (commodity.available > 0) {
			
				var canLoad = game.p1ship.availableCargoSpace() >= 1 && game.p1ship.availableCargoLift() >= game.commodities[commodityKey].weight;
			
				row++;
				var wareGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
				paneGroup.appendChild(wareGroup);
		
				var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
				wareGroup.appendChild(rect);
				rect.setAttribute('x',-82);
				rect.setAttribute('y',-30 + 5 + row * 10);
				rect.setAttribute('width',74);
				rect.setAttribute('height',10);
				rect.setAttribute('fill','lemonchiffon');
				rect.setAttribute('stroke','goldenrod');
		
				var text = document.createElementNS('http://www.w3.org/2000/svg','text');
				wareGroup.appendChild(text);
				text.setAttribute('x',-80);
				text.setAttribute('y',-26.5 + 6 + row * 10);
				text.setAttribute('font-size',4);
				text.innerHTML = game.commodities[commodity.key].displayName;
		
				var text = document.createElementNS('http://www.w3.org/2000/svg','text');
				wareGroup.appendChild(text);
				text.setAttribute('x',-75);
				text.setAttribute('y',-26.5 + 9 + row * 10);
				text.setAttribute('font-size',2.5);
				text.innerHTML = "in " + game.commodities[commodity.key].weight + "-ton crates";
		
				var text = document.createElementNS('http://www.w3.org/2000/svg','text');
				wareGroup.appendChild(text);
				text.setAttribute('x',-40);
				text.setAttribute('y',-26.5 + 7 + row * 10);
				text.setAttribute('font-size',2);
				text.setAttribute('text-anchor','middle');
				text.innerHTML = ['Incredible','Excellent','Good','Fair','Unfortunate','Bad','Terrible'][7 * (commodity.demand - 0.5) << 0];
		
				var text = document.createElementNS('http://www.w3.org/2000/svg','text');
				wareGroup.appendChild(text);
				text.setAttribute('x',-40);
				text.setAttribute('y',-26.5 + 9 + row * 10);
				text.setAttribute('font-size',2);
				text.setAttribute('text-anchor','middle');
				text.innerHTML = "Price";
				
				var cost = game.localPrice(commodityKey);
				var canAfford = game.p1ship.coin > cost;
				var buyButton = view.buildButton('Buy for $'+Math.floor(cost*game.p1ship.discount('commodity')),-28,-30 + 7.5 + row * 10,30,0.5);
				wareGroup.appendChild(buyButton);
				if (canLoad && canAfford) {
					buyButton.addEventListener('click',handlers.buyCommodity.bind(this,commodityKey));
				} else {
					buyButton.setAttribute('opacity',0.2);
				};
			};
		};
		
		var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		paneGroup.appendChild(rect);
		rect.setAttribute('x',-82);
		rect.setAttribute('y',40);
		rect.setAttribute('width',74);
		rect.setAttribute('height',5);
		rect.setAttribute('fill','goldenrod');
		rect.setAttribute('stroke','goldenrod');
		
		var reprovisionCost = game.reprovisionCost();
		var refuelCost = game.refuelCost();
		var rechargeCost = game.rechargeCost();
		
		var reprovisionButton = view.buildButton('Reprovision for $'+reprovisionCost,-79,40,42,0.5);
		paneGroup.appendChild(reprovisionButton);
		if (reprovisionCost > 0) {
			reprovisionButton.addEventListener('click',handlers.reprovision);
		} else {
			reprovisionButton.setAttribute('opacity',0);
		};
		
		var refuelButton = view.buildButton('Refuel for $'+refuelCost,-55,40,42,0.5);
		paneGroup.appendChild(refuelButton);
		if (refuelCost > 0) {
			refuelButton.addEventListener('click',handlers.refuel);
		} else {
			refuelButton.setAttribute('opacity',0);
		};
		
		var rechargeButton = view.buildButton('Recharge for $'+rechargeCost,-31,40,42,0.5);
		paneGroup.appendChild(rechargeButton);
		if (rechargeCost > 0) {
			rechargeButton.addEventListener('click',handlers.recharge);
		} else {
			rechargeButton.setAttribute('opacity',0);
		};
		
		// Cargo
		
		var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		paneGroup.appendChild(rect);
		rect.setAttribute('x',8);
		rect.setAttribute('y',-30);
		rect.setAttribute('width',74);
		rect.setAttribute('height',75);
		rect.setAttribute('fill','none');
		rect.setAttribute('stroke','goldenrod');
		
		var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		paneGroup.appendChild(rect);
		rect.setAttribute('x',8);
		rect.setAttribute('y',-30);
		rect.setAttribute('width',74);
		rect.setAttribute('height',5);
		rect.setAttribute('fill','goldenrod');
		rect.setAttribute('stroke','goldenrod');
		
		var text = document.createElementNS('http://www.w3.org/2000/svg','text');
		paneGroup.appendChild(text);
		text.setAttribute('x',10);
		text.setAttribute('y',-26.5);
		text.setAttribute('font-size',3);
		text.innerHTML = "Your Cargo";
		
		var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		paneGroup.appendChild(rect);
		rect.setAttribute('x',8);
		rect.setAttribute('y',40);
		rect.setAttribute('width',74);
		rect.setAttribute('height',5);
		rect.setAttribute('fill','goldenrod');
		rect.setAttribute('stroke','goldenrod');
		
		var text = document.createElementNS('http://www.w3.org/2000/svg','text');
		paneGroup.appendChild(text);
		text.setAttribute('x',80);
		text.setAttribute('y',44);
		text.setAttribute('font-size',3);
		text.setAttribute('text-anchor','end');
		var berth = 'berth';
		if (game.p1ship.availableCargoSpace()>1) {berths = 'berths'};
		text.innerHTML = game.p1ship.availableCargoLift()+" tons and "+game.p1ship.availableCargoSpace()+" "+berth+" available";
		
		var row = -1;
		for (var commodityKey in game.p1ship.cargo) {
			if (game.p1ship.cargo[commodityKey] >= 1) {
				row++;
				var wareGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
				paneGroup.appendChild(wareGroup);
		
				var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
				wareGroup.appendChild(rect);
				rect.setAttribute('x',8);
				rect.setAttribute('y',-30 + 5 + row * 10);
				rect.setAttribute('width',74);
				rect.setAttribute('height',10);
				rect.setAttribute('fill','lemonchiffon');
				rect.setAttribute('stroke','goldenrod');
		
				var text = document.createElementNS('http://www.w3.org/2000/svg','text');
				wareGroup.appendChild(text);
				text.setAttribute('x',10);
				text.setAttribute('y',-26.5 + 6 + row * 10);
				text.setAttribute('font-size',4);
				text.innerHTML = game.commodities[commodityKey].displayName;
		
				var text = document.createElementNS('http://www.w3.org/2000/svg','text');
				wareGroup.appendChild(text);
				text.setAttribute('x',15);
				text.setAttribute('y',-26.5 + 9 + row * 10);
				text.setAttribute('font-size',2.5);
				text.innerHTML = Math.floor(game.p1ship.cargo[commodityKey]) + " " + game.commodities[commodityKey].weight + "-ton crates";
		
				var text = document.createElementNS('http://www.w3.org/2000/svg','text');
				wareGroup.appendChild(text);
				text.setAttribute('x',50);
				text.setAttribute('y',-26.5 + 7 + row * 10);
				text.setAttribute('font-size',2);
				text.setAttribute('text-anchor','middle');
				text.innerHTML = ['Incredible','Excellent','Good','Fair','Unfortunate','Bad','Terrible'][7 * (1 - wharf.localWares[commodityKey].demand + 0.5) << 0];
		
				var text = document.createElementNS('http://www.w3.org/2000/svg','text');
				wareGroup.appendChild(text);
				text.setAttribute('x',50);
				text.setAttribute('y',-26.5 + 9 + row * 10);
				text.setAttribute('font-size',2);
				text.setAttribute('text-anchor','middle');
				text.innerHTML = "Price";
				
				if (wharf.localWares[commodityKey].available > 0) {
				} else {
					var cost = game.localPrice(commodityKey);
					var sellButton = view.buildButton('Sell for $'+cost,62,-30 + 7.5 + row * 10,30,0.5);
					wareGroup.appendChild(sellButton);
					sellButton.addEventListener('click',handlers.sellCommodity.bind(this,commodityKey));
				};
				
			};
		};
		
		return paneGroup;
	},
	
	updateWharfUI: function() {
		if (game.p1ship.currentMap().town !== undefined) {
			var wharfTab = document.getElementById('townTab1Content');
			wharfTab.innerHTML = '';
			wharfTab.appendChild(view.buildWharfUI(game.p1ship.currentMap().town.amenities[1]));
		};
	},
	
	buildShipyardUI: function(shipyard) {
		var ship = game.p1ship;
		var paneGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
		paneGroup.setAttribute('transform','translate(0,100)');
		
		// Pane Bounds: x -85 to 85, y -33 to 50 (corrected)
	
		var externalLabel = document.createElementNS('http://www.w3.org/2000/svg','text');
		paneGroup.appendChild(externalLabel);
		externalLabel.setAttribute('x',-25);
		externalLabel.setAttribute('y',-28);
		externalLabel.setAttribute('font-size',2.75);
		externalLabel.setAttribute('fill','goldenrod');
// 		externalLabel.setAttribute('opacity',0.5);
		externalLabel.innerHTML = 'External Schematic';
		
		var internalLabel = document.createElementNS('http://www.w3.org/2000/svg','text');
		paneGroup.appendChild(internalLabel);
		internalLabel.setAttribute('x',-25 - 50);
		internalLabel.setAttribute('y',-28);
		internalLabel.setAttribute('font-size',2.75);
		internalLabel.setAttribute('fill','goldenrod');
// 		internalLabel.setAttribute('opacity',0.4);
		internalLabel.innerHTML = 'Internal Schematic';
		
		var schematicScale = 4;
		
		var topViewGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
		paneGroup.appendChild(topViewGroup);
		topViewGroup.setAttribute('transform','scale('+schematicScale+')');
	
		var shipUse = document.createElementNS('http://www.w3.org/2000/svg','use');
		shipUse.setAttribute('x',0);
		shipUse.setAttribute('y',0);
		view.setHref(shipUse,ship.sprite);
		topViewGroup.appendChild(shipUse);
		
		var interfaceArray = {};
		
		if (ship.components.keel) {
			var hullCenters = view.getHullCenters(ship);
			for (var h=0;h<ship.components.keel.stats.hulls;h++) {
				if (ship.components['hull'+h]) {
					var targetUse = document.createElementNS('http://www.w3.org/2000/svg','use');
					targetUse.setAttribute('x',hullCenters[h].x);
					targetUse.setAttribute('y',hullCenters[h].y - game.p1ship.components['hull'+h].length/2);
					view.setHref(targetUse,'componentTarget');
					topViewGroup.appendChild(targetUse);
					targetUse.id = 'componentTarget_hull'+h;
					interfaceArray['hull'+h] = targetUse;
					for (var e=0;e<ship.components['hull'+h].stats.externalSlots;e++) {
						var targetUse = document.createElementNS('http://www.w3.org/2000/svg','use');
						var componentPosition = view.getComponentPosition(ship,h,'external',e);
						targetUse.setAttribute('x',componentPosition.x);
						targetUse.setAttribute('y',componentPosition.y);
						view.setHref(targetUse,'componentTarget');
						topViewGroup.appendChild(targetUse);
						targetUse.id = 'componentTarget_hull'+h+'ext'+e;
						interfaceArray['hull'+h+'ext'+e] = targetUse;
					};
					for (var t=0;t<ship.components['hull'+h].stats.topSlots;t++) {
						var targetUse = document.createElementNS('http://www.w3.org/2000/svg','use');
						var componentPosition = view.getComponentPosition(ship,h,'top',t);
						targetUse.setAttribute('x',componentPosition.x);
						targetUse.setAttribute('y',componentPosition.y);
						view.setHref(targetUse,'componentTarget');
						topViewGroup.appendChild(targetUse);
						targetUse.id = 'componentTarget_hull'+h+'top'+t;
						interfaceArray['hull'+h+'top'+t] = targetUse;
					};
				} else {
					var point = {x:-25,y:(h+1)*10};
					var text = document.createElementNS('http://www.w3.org/2000/svg','text');
					paneGroup.appendChild(text);
					text.setAttribute('x',point.x);
					text.setAttribute('y',point.y);
					text.setAttribute('font-size',2);
					text.setAttribute('text-anchor','middle');
					text.setAttribute('stroke-width',1);
					text.setAttribute('stroke','lemonchiffon');
					text.setAttribute('paint-order','stroke');
					text.innerHTML = 'Hull';
					var text = document.createElementNS('http://www.w3.org/2000/svg','text');
					paneGroup.appendChild(text);
					text.setAttribute('x',point.x);
					text.setAttribute('y',point.y+2);
					text.setAttribute('font-size',2);
					text.setAttribute('text-anchor','middle');
					text.setAttribute('stroke-width',1);
					text.setAttribute('stroke','lemonchiffon');
					text.setAttribute('paint-order','stroke');
					text.innerHTML = '#'+(h+1);
					var targetUse = document.createElementNS('http://www.w3.org/2000/svg','use');
					targetUse.setAttribute('x',point.x);
					targetUse.setAttribute('y',point.y);
					targetUse.setAttribute('transform','translate('+point.x+' '+point.y+') scale('+schematicScale+') translate('+(-1*point.x)+' '+(-1*point.y)+')');
					view.setHref(targetUse,'componentTarget');
					paneGroup.appendChild(targetUse);
					targetUse.id = 'componentTarget_hull'+h;
					interfaceArray['hull'+h] = targetUse;
				};
			};
		
			var internalViewGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
			paneGroup.appendChild(internalViewGroup);
			internalViewGroup.setAttribute('transform','translate(-50) scale('+schematicScale+')');
		
			for (var h=0;h<ship.components.keel.stats.hulls;h++) {
				if (ship.components['hull'+h]) {
					var x = hullCenters[h].x;
					var y = hullCenters[h].y;
					var hullGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
					internalViewGroup.appendChild(hullGroup);
					var hullShape = view.buildHull(ship.components['hull'+h]);
					hullShape.setAttribute('x',x);
					hullShape.setAttribute('y',y);
					hullGroup.appendChild(hullShape);
					for (var i=0;i<ship.components['hull'+h].stats.internalSlots;i++) {
						var hullLength = ship.components['hull'+h].length;
						var targetUse = document.createElementNS('http://www.w3.org/2000/svg','use');
						targetUse.setAttribute('x',x);
						targetUse.setAttribute('y',y - hullLength/2 + (i+0.5)*(hullLength / ship.components['hull'+h].stats.internalSlots));
						view.setHref(targetUse,'componentTarget');
						hullGroup.appendChild(targetUse);
						targetUse.id = 'componentTarget_hull'+h+'int'+i;
						interfaceArray['hull'+h+'int'+i] = targetUse;
					};
				};
			};
		};
		
		var keelCoords = {x:-25,y:0};
		var text = document.createElementNS('http://www.w3.org/2000/svg','text');
		paneGroup.appendChild(text);
		text.setAttribute('x',keelCoords.x);
		text.setAttribute('y',keelCoords.y+1);
		text.setAttribute('font-size',2);
		text.setAttribute('text-anchor','middle');
		text.setAttribute('stroke-width',1);
		text.setAttribute('stroke','lemonchiffon');
		text.setAttribute('paint-order','stroke');
		text.innerHTML = 'Keel';
		var targetUse = document.createElementNS('http://www.w3.org/2000/svg','use');
		targetUse.setAttribute('x',keelCoords.x);
		targetUse.setAttribute('y',keelCoords.y);
		targetUse.setAttribute('transform','translate('+keelCoords.x+' '+keelCoords.y+') scale('+schematicScale+') translate('+(-1*keelCoords.x)+' '+(-1*keelCoords.y)+')');
		view.setHref(targetUse,'componentTarget');
		paneGroup.appendChild(targetUse);
		targetUse.id = 'componentTarget_keel';
		interfaceArray.keel = targetUse;
		
		for (var slot in interfaceArray) {
			interfaceArray[slot].setAttribute('stroke','cyan');
			interfaceArray[slot].addEventListener('mouseenter',handlers.slotHover.bind(this,slot));
			interfaceArray[slot].addEventListener('mouseleave',view.clearComponentDisplay);
			interfaceArray[slot].addEventListener('click',handlers.slotClick.bind(this,slot));
		};
		view.panes.shipyardTargets = interfaceArray;
		
		// Buttons
		var buttonGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
		paneGroup.appendChild(buttonGroup);
		buttonGroup.id = 'shipyardButtonGroup';
		var repairButton = view.buildButton('Repair',34,-13,20,0.5);
		buttonGroup.appendChild(repairButton);
		repairButton.addEventListener('click',handlers.repairComponent);
		var moveButton = view.buildButton('Move',46,-13,20,0.5);
		buttonGroup.appendChild(moveButton);
		moveButton.addEventListener('click',handlers.moveComponent);
		var paintButton = view.buildButton('Paint',58,-13,20,0.5);
		buttonGroup.appendChild(paintButton);
		paintButton.addEventListener('click',view.revealPaintColors);
		var sellButton = view.buildButton('Sell',70,-13,20,0.5);
		buttonGroup.appendChild(sellButton);
		sellButton.addEventListener('click',handlers.sellComponent);
		
		var buttonCover = document.createElementNS('http://www.w3.org/2000/svg','g');
		buttonGroup.appendChild(buttonCover);
		var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		buttonCover.appendChild(rect);
		rect.setAttribute('x',33)
		rect.setAttribute('y',-15);
		rect.setAttribute('width',50);
		rect.setAttribute('height',8);
		rect.setAttribute('fill','lemonchiffon');
		rect.setAttribute('stroke','goldenrod');
		rect.setAttribute('stroke-width',0.25);
		
		var buttonCoverLift = document.createElementNS('http://www.w3.org/2000/svg','animateTransform');
		buttonCoverLift.id = 'buttonCoverLift';
		buttonCoverLift.setAttribute('attributeName','transform');
		buttonCoverLift.setAttribute('attributeType','XML');
		buttonCoverLift.setAttribute('type','translate');
		buttonCoverLift.setAttribute('from','0 0');
		buttonCoverLift.setAttribute('to','0 -8');
		buttonCoverLift.setAttribute('dur','0.5s');
		buttonCoverLift.setAttribute('begin','indefinite');
		buttonCoverLift.setAttribute('fill','freeze');
		buttonCover.appendChild(buttonCoverLift);
		var buttonCoverLower = document.createElementNS('http://www.w3.org/2000/svg','animateTransform');
		buttonCoverLower.id = 'buttonCoverLower';
		buttonCoverLower.setAttribute('attributeName','transform');
		buttonCoverLower.setAttribute('attributeType','XML');
		buttonCoverLower.setAttribute('type','translate');
		buttonCoverLower.setAttribute('from','0 -8');
		buttonCoverLower.setAttribute('to','0 0');
		buttonCoverLower.setAttribute('dur','0.5s');
		buttonCoverLower.setAttribute('begin','indefinite');
		buttonCoverLower.setAttribute('fill','freeze');
		buttonCover.appendChild(buttonCoverLower);

		// Selected Component
		var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		paneGroup.appendChild(rect);
		rect.setAttribute('x',33)
		rect.setAttribute('y',-33);
		rect.setAttribute('width',50);
		rect.setAttribute('height',19);
		rect.setAttribute('fill','lemonchiffon');
		rect.setAttribute('stroke','goldenrod');
		rect.setAttribute('stroke-width',0.25);
		
		var selectedComponentGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
		paneGroup.appendChild(selectedComponentGroup);
		selectedComponentGroup.id = 'selectedComponentGroup';
				
		// For Sale
		var text = document.createElementNS('http://www.w3.org/2000/svg','text');
		paneGroup.appendChild(text);
		text.setAttribute('x',33);
		text.setAttribute('y',-4);
		text.setAttribute('font-size',3);
		text.innerHTML = 'Components For Sale';
		var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		paneGroup.appendChild(rect);
		rect.setAttribute('x',33);
		rect.setAttribute('y',-3);
		rect.setAttribute('width',50);
		rect.setAttribute('height',50);
		rect.setAttribute('fill','lemonchiffon');
		rect.setAttribute('stroke','goldenrod');
		rect.setAttribute('stroke-width',0.5);
		row = 0;
		var rowHeight = 50 / shipyard.stock.length;
		for (var component of shipyard.stock) {
			var componentGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
			paneGroup.appendChild(componentGroup);
			componentGroup.addEventListener('mouseenter',view.displayComponent.bind(this,component,67,-30));
			componentGroup.addEventListener('mouseleave',view.clearComponentDisplay);
			var componentBox = document.createElementNS('http://www.w3.org/2000/svg','rect');
			componentGroup.appendChild(componentBox);
			componentBox.setAttribute('x',33);
			componentBox.setAttribute('y',-28 + 25 + row*rowHeight);
			componentBox.setAttribute('width',50);
			componentBox.setAttribute('height',rowHeight);
			componentBox.setAttribute('stroke','goldenrod');
			componentBox.setAttribute('stroke-width',0.5);
			componentBox.setAttribute('fill',component.color);
			var componentLabel = document.createElementNS('http://www.w3.org/2000/svg','text');
			componentGroup.appendChild(componentLabel);
			componentLabel.setAttribute('x',35);
			componentLabel.setAttribute('y',-28 + 25 + (row+0.6)*rowHeight);
			componentLabel.setAttribute('font-size',2);
			componentLabel.innerHTML = component.name;
			var buyPrice = Math.floor(component.cost);
			var buyButton = view.buildButton('Buy for $'+Math.floor(buyPrice*game.p1ship.discount('shipyard')),65,-28 + 25 - 4 + (row+0.6)*rowHeight,30,0.5);
			componentGroup.appendChild(buyButton);
			if (buyPrice > game.p1ship.coin) {
				buyButton.setAttribute('opacity',0.5);
			} else {
				buyButton.addEventListener('click',handlers.buyComponent.bind(this,component));
			};
			row++;
		};
		
		// Paint Palette
		
		var paintGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
		paneGroup.appendChild(paintGroup);
		paintGroup.id = 'paintPalette';
		paintGroup.setAttribute('opacity',0);
		paintGroup.setAttribute('visibility','hidden');
		var paintFade = document.createElementNS('http://www.w3.org/2000/svg','animate');
		paintFade.id = 'paintFade';
		paintFade.setAttribute('attributeName','opacity');
		paintFade.setAttribute('attributeType','XML');
		paintFade.setAttribute('from','1');
		paintFade.setAttribute('to','0');
		paintFade.setAttribute('dur','0.5s');
		paintFade.setAttribute('begin','indefinite');
		paintFade.setAttribute('fill','freeze');
		paintGroup.appendChild(paintFade);
		var paintReveal = document.createElementNS('http://www.w3.org/2000/svg','animate');
		paintReveal.id = 'paintReveal';
		paintReveal.setAttribute('attributeName','opacity');
		paintReveal.setAttribute('attributeType','XML');
		paintReveal.setAttribute('from','0');
		paintReveal.setAttribute('to','1');
		paintReveal.setAttribute('dur','0.5s');
		paintReveal.setAttribute('begin','indefinite');
		paintReveal.setAttribute('fill','freeze');
		paintGroup.appendChild(paintReveal);

		var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		paintGroup.appendChild(rect);
		rect.setAttribute('x',33);
		rect.setAttribute('y',-7.5);
		rect.setAttribute('width',50);
		rect.setAttribute('height',54);
		rect.setAttribute('fill','lemonchiffon');
		rect.setAttribute('stroke','none');
		rect.setAttribute('stroke-width',0.5);
		var text = document.createElementNS('http://www.w3.org/2000/svg','text');
		paintGroup.appendChild(text);
		text.setAttribute('x',33);
		text.setAttribute('y',-4);
		text.setAttribute('font-size',3);
		text.innerHTML = 'Painting';
		var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		paintGroup.appendChild(rect);
		rect.setAttribute('x',33);
		rect.setAttribute('y',-3);
		rect.setAttribute('width',50);
		rect.setAttribute('height',50);
		rect.setAttribute('fill','lemonchiffon');
		rect.setAttribute('stroke','goldenrod');
		rect.setAttribute('stroke-width',0.5);
		var column = 0;
		var row = 0;
		var x,y;
		for (var color of game.colors) {
			x = 39 + column * 7.5;
			y = 9 + row * 10.25;
			var ellipse = document.createElementNS('http://www.w3.org/2000/svg','ellipse');
			paintGroup.appendChild(ellipse);
			ellipse.setAttribute('cx',x);
			ellipse.setAttribute('cy',y);
			ellipse.setAttribute('rx',3);
			ellipse.setAttribute('ry',4);
			ellipse.setAttribute('transform','rotate(20 '+x+' '+y+')');
			ellipse.setAttribute('fill',color);
			ellipse.setAttribute('stroke','black');
			ellipse.setAttribute('stroke-width',0.25);
			ellipse.addEventListener('click',handlers.paintComponent.bind(this,color));
			if (column > 4) {
				column = 0;
				row++;
			} else {
				column++;
			};
		};
		var text = document.createElementNS('http://www.w3.org/2000/svg','text');
		paintGroup.appendChild(text);
		text.id = 'paintCostText';
		text.setAttribute('x',36);
		text.setAttribute('y',2);
		text.setAttribute('font-size',2);
		text.innerHTML = 'It costs $X to paint a hull.';
		
		var cancelButton = view.buildButton('Cancel',66.5,37.5,25,0.5);
		paintGroup.appendChild(cancelButton);
		cancelButton.addEventListener('click',view.hidePaintColors);
		
		// Readout
		
		var readoutGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
		paneGroup.appendChild(readoutGroup);
		readoutGroup.setAttribute('paint-order','stroke');
		readoutGroup.setAttribute('fill','black');
		readoutGroup.setAttribute('stroke','lemonchiffon');
		readoutGroup.setAttribute('stroke-width',2);
		readoutGroup.setAttribute('font-size',2);

		// Left Column
		var liftLabel = document.createElementNS('http://www.w3.org/2000/svg','text');
		readoutGroup.appendChild(liftLabel);
		liftLabel.setAttribute('x',-62);
		liftLabel.setAttribute('y',40);
		liftLabel.setAttribute('text-anchor','end');
		liftLabel.innerHTML = "Total Lift: ";
		
		var liftReadout = document.createElementNS('http://www.w3.org/2000/svg','text');
		readoutGroup.appendChild(liftReadout);
		liftReadout.setAttribute('x',-60);
		liftReadout.setAttribute('y',40);
		liftReadout.innerHTML = Math.floor(100*ship.getStat('lift',false))/100 + " (" + Math.floor(100*(ship.getStat('lift',false)+ship.getStat('weight',false)))/100 + " lift - "+Math.floor(100*ship.getStat('weight',false))/100+" weight )";
		
		var spaceLabel = document.createElementNS('http://www.w3.org/2000/svg','text');
		readoutGroup.appendChild(spaceLabel);
		spaceLabel.setAttribute('x',-62);
		spaceLabel.setAttribute('y',43);
		spaceLabel.setAttribute('text-anchor','end');
		spaceLabel.innerHTML = "Cargo Space: ";
		
		var spaceReadout = document.createElementNS('http://www.w3.org/2000/svg','text');
		readoutGroup.appendChild(spaceReadout);
		spaceReadout.setAttribute('x',-60);
		spaceReadout.setAttribute('y',43);
		spaceReadout.innerHTML = Math.floor(ship.getStat('cargo',false)*10*100)/100 + ' Crates';
		
		var amenitiesLabel = document.createElementNS('http://www.w3.org/2000/svg','text');
		readoutGroup.appendChild(amenitiesLabel);
		amenitiesLabel.setAttribute('x',-62);
		amenitiesLabel.setAttribute('y',46);
		amenitiesLabel.setAttribute('text-anchor','end');
		amenitiesLabel.innerHTML = "Amenities: ";
		
		var amenitiesReadout = document.createElementNS('http://www.w3.org/2000/svg','text');
		readoutGroup.appendChild(amenitiesReadout);
		amenitiesReadout.setAttribute('x',-60);
		amenitiesReadout.setAttribute('y',46);
		amenitiesReadout.innerHTML = Math.floor(ship.getStat('amenities',false)*100)/100 + ' Stars';
		
		// Right Column
		var profileLabel = document.createElementNS('http://www.w3.org/2000/svg','text');
		readoutGroup.appendChild(profileLabel);
		profileLabel.setAttribute('x',-7);
		profileLabel.setAttribute('y',40);
		profileLabel.setAttribute('text-anchor','end');
		profileLabel.innerHTML = "Aero Profile: ";
		
		var profileReadout = document.createElementNS('http://www.w3.org/2000/svg','text');
		readoutGroup.appendChild(profileReadout);
		profileReadout.setAttribute('x',-5);
		profileReadout.setAttribute('y',40);
		profileReadout.innerHTML = Math.floor(ship.getStat('profile',false)*100)/100 + " (hull lengths summed)";

		var thrustLabel = document.createElementNS('http://www.w3.org/2000/svg','text');
		readoutGroup.appendChild(thrustLabel);
		thrustLabel.setAttribute('x',-7);
		thrustLabel.setAttribute('y',43);
		thrustLabel.setAttribute('text-anchor','end');
		thrustLabel.innerHTML = "Total Thrust: ";
		
		var thrustReadout = document.createElementNS('http://www.w3.org/2000/svg','text');
		readoutGroup.appendChild(thrustReadout);
		thrustReadout.setAttribute('x',-5);
		thrustReadout.setAttribute('y',43);
		thrustReadout.innerHTML = Math.floor(100*ship.getStat('thrust',false))/100 + " (" + Math.floor(100*(ship.getStat('thrust',false)+ship.getStat('drag',false)))/100 + " thrust - "+Math.floor(100*ship.getStat('drag',false))/100+" drag )";
		
		var turnLabel = document.createElementNS('http://www.w3.org/2000/svg','text');
		readoutGroup.appendChild(turnLabel);
		turnLabel.setAttribute('x',-7);
		turnLabel.setAttribute('y',46);
		turnLabel.setAttribute('text-anchor','end');
		turnLabel.innerHTML = "Total Turn: ";
		
		var turnReadout = document.createElementNS('http://www.w3.org/2000/svg','text');
		readoutGroup.appendChild(turnReadout);
		turnReadout.setAttribute('x',-5);
		turnReadout.setAttribute('y',46);
		turnReadout.innerHTML = Math.floor(100*ship.getStat('turn'))/100 + " (" + Math.floor(100*(ship.getStat('turn',false)+ship.getStat('drag',false)))/100 + " turn - "+Math.floor(100*ship.getStat('drag',false))/100+" drag )";
		
		var stabilityLabel = document.createElementNS('http://www.w3.org/2000/svg','text');
		readoutGroup.appendChild(stabilityLabel);
		stabilityLabel.setAttribute('x',-7);
		stabilityLabel.setAttribute('y',49);
		stabilityLabel.setAttribute('text-anchor','end');
		stabilityLabel.innerHTML = "Wind Effect: ";
		
		var stabilityReadout = document.createElementNS('http://www.w3.org/2000/svg','text');
		readoutGroup.appendChild(stabilityReadout);
		stabilityReadout.setAttribute('x',-5);
		stabilityReadout.setAttribute('y',49);
		stabilityReadout.innerHTML = "x" + Math.max(0,Math.floor((ship.getStat('profile',false)-ship.getStat('stability',false))*100)/100) + " ("+Math.floor(100*ship.getStat('profile',false))/100+" profile - "+Math.floor(100*ship.getStat('stability',false))/100+" stability)";

		var floatGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
		floatGroup.id = 'shipyardFloatGroup';
		paneGroup.appendChild(floatGroup);
		
		return paneGroup;
	},
	
	refreshShipyardUI: function() {
		view.panes.selectedComponent = undefined;
		var townTab2Content = document.getElementById('townTab2Content');
		townTab2Content.innerHTML = '';
		townTab2Content.appendChild(view.buildShipyardUI(game.p1ship.currentMap().town.amenities[2]));
		view.filterShipyardTargets();
	},
	
	displayComponent: function(component,x,y) {
		var shipyardFloatGroup = document.getElementById('shipyardFloatGroup');
		shipyardFloatGroup.innerHTML = '';
		var componentDisplay = view.buildComponentDisplay(component);
		componentDisplay.setAttribute('transform','translate('+x+' '+(y+7.5)+')');
		shipyardFloatGroup.appendChild(componentDisplay);
	},
	
	clearComponentDisplay: function() {
		var shipyardFloatGroup = document.getElementById('shipyardFloatGroup');
		shipyardFloatGroup.innerHTML = '';
	},
	
	selectComponent: function(component) {
		var selectedComponentGroup = document.getElementById('selectedComponentGroup');
		selectedComponentGroup.innerHTML = '';
		if (component) {
			if (view.panes.selectedComponent == undefined) {
				document.getElementById('buttonCoverLift').beginElement();
			};
			view.panes.selectedComponent = component;
			var componentDisplay = view.buildComponentDisplay(component);
			componentDisplay.setAttribute('transform','translate(49 -23.5)');
			selectedComponentGroup.appendChild(componentDisplay);
			var installed = false;
			document.getElementById('paintCostText').innerHTML = "It costs $"+component.paintCost+" to paint a "+component.type+".";
		};
		view.filterShipyardTargets();
	},
	
	coverShipyardButtons: function() {
		document.getElementById('buttonCoverLower').beginElement();
	},
	
	filterShipyardTargets: function(type) {
		if (type == undefined) {
			for (var slot in view.panes.shipyardTargets) {
				if (game.p1ship.components[slot] !== undefined && game.p1ship.components[slot] == view.panes.selectedComponent) {
					view.panes.shipyardTargets[slot].setAttribute('stroke','blue');
				} else if (game.p1ship.components[slot] !== undefined && game.p1ship.components[slot].condition < 1) {
					view.panes.shipyardTargets[slot].setAttribute('stroke','red');
				} else {
					view.panes.shipyardTargets[slot].setAttribute('stroke','cyan');
				};
				view.panes.shipyardTargets[slot].setAttribute('visibility','visible');
			};
		} else if (type == 'hull') {
			for (var slot in view.panes.shipyardTargets) {
				if (slot.length !== 5) {
					view.panes.shipyardTargets[slot].setAttribute('visibility','hidden');
				} else {
					view.panes.shipyardTargets[slot].setAttribute('stroke','lime');
					view.panes.shipyardTargets[slot].setAttribute('visibility','visible');
				};
			};
		} else {
			for (var slot in view.panes.shipyardTargets) {
				if (slot.indexOf(type) == -1) {
					view.panes.shipyardTargets[slot].setAttribute('visibility','hidden');
				} else {
					view.panes.shipyardTargets[slot].setAttribute('stroke','lime');
					view.panes.shipyardTargets[slot].setAttribute('visibility','visible');
				};
			};
		};
	},
	
	revealPaintColors: function() {
		var component = view.panes.selectedComponent;
		document.getElementById('paintCostText').innerHTML = "It costs $"+component.paintCost+" to paint a "+component.type+".";
		document.getElementById('paintPalette').setAttribute('visibility','visible');
		document.getElementById('paintReveal').beginElement();
	},
	
	hidePaintColors: function() {
		document.getElementById('paintFade').beginElement();
		document.getElementById('paintPalette').setAttribute('visibility','hidden');
	},
	
	buildHospitalUI: function(town) {
		var paneGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
		paneGroup.setAttribute('transform','translate(0,100)');
		
		// Pane Bounds: x -85 to 85, y -33 to 50 (corrected)
		
		return paneGroup;
	},
	
	buildTempleUI: function(town) {
		var paneGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
		paneGroup.setAttribute('transform','translate(0,100)');
		
		// Pane Bounds: x -85 to 85, y -33 to 50 (corrected)
		
		return paneGroup;
	},
	
	buildButton: function(label,x,y,width,size) {
		if (x==undefined) {x=0};
		if (y==undefined) {y=0};
		if (width==undefined) {width=30};
		var buttonGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
		var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		buttonGroup.appendChild(rect);
		rect.setAttribute('x',x);
		rect.setAttribute('y',y);
		rect.setAttribute('rx',5);
		rect.setAttribute('ry',5);
		rect.setAttribute('width',width);
		rect.setAttribute('height',10);
		rect.setAttribute('fill','goldenrod');
		rect.setAttribute('stroke','black');
		if (typeof label == 'string') {
			var text = document.createElementNS('http://www.w3.org/2000/svg','text');
			buttonGroup.appendChild(text);
			text.setAttribute('x',x+width/2);
			text.setAttribute('y',y+6);
			text.setAttribute('font-size',3.5);
			text.setAttribute('text-anchor','middle');
			text.innerHTML = label;
		} else {
			for (var i=0;i<label.length;i++) {
				var text = document.createElementNS('http://www.w3.org/2000/svg','text');
				buttonGroup.appendChild(text);
				text.setAttribute('x',x+width/2);
				text.setAttribute('y',y+4.5 + i * 7 / label.length);
				text.setAttribute('font-size',3.5);
				text.setAttribute('text-anchor','middle');
				text.innerHTML = label[i];
			};
		};
		if (size !== undefined) {
			buttonGroup.setAttribute('transform','translate('+x+' '+y+') scale('+size+') translate('+(x*-1)+' '+(y*-1)+')');
		};
		
		return buttonGroup;
	},
	
	updatePurse: function(game) {
		var purseText = document.getElementById('purseText');
		purseText.innerHTML = "$"+game.p1ship.coin;
	},
	
	updateGauges: function() {
		for (var item of ['fuel','charge','provisions']) {
			var gauge = document.getElementById(item+'Gauge');
			var height = Math.max(0,game.p1ship[item]);
			gauge.setAttribute('height',15 * height);
			if (height < 0.25) {
				gauge.setAttribute('fill','red');
			} else if (height < 0.5) {
				gauge.setAttribute('fill','yellow');
			} else {
				gauge.setAttribute('fill','lime');
			};
		};
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
		
		if (ship.moored) {
			var mooringNose = ship.mooringNose();
			var mooringLine = document.createElementNS('http://www.w3.org/2000/svg','line');
			shipGroup.appendChild(mooringLine);
			mooringLine.setAttribute('stroke','black');
			mooringLine.setAttribute('stroke-width',0.25);
			mooringLine.setAttribute('x1',ship.anchor.x);
			mooringLine.setAttribute('y1',ship.anchor.y);
			mooringLine.setAttribute('x2',mooringNose.x);
			mooringLine.setAttribute('y2',mooringNose.y);
		};
		
		var useNode = document.createElementNS('http://www.w3.org/2000/svg','use');
		useNode.setAttribute('x',ship.x);
		useNode.setAttribute('y',ship.y);
		view.setHref(useNode,ship.sprite);
		if (ship.components.hull0 !== undefined) {
			useNode.setAttribute('fill',ship.components.hull0.color);
		};
		shipGroup.appendChild(useNode);
		
		if (ship.opacity !== undefined) {
			shipGroup.setAttribute('opacity',ship.opacity);
		};
		
		useNode.setAttribute('transform','translate('+ship.x+' '+ship.y+') rotate('+(view.r2d(ship.heading))+') translate('+(-1*ship.x)+' '+(-1*ship.y)+')');
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
		uiAirspeed.innerHTML = Math.round(game.p1ship.airspeed.speed*100)/100 + " knots";
		
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
	
	updateNavMarkers: function() {
		var navMarkersGroup = document.getElementById('navMarkersGroup');
		navMarkersGroup.innerHTML = '';
		var markers = [], candidates = [];
		if (view.panes.course !== undefined) {
			var courseMarker = {
				x: view.panes.course.x,
				y: view.panes.course.y,
				name: view.panes.course.name,
				type: 'course',
			};
			candidates.push(courseMarker);
		};
		for (var town of game.townList) {
			dist = Math.pow(Math.pow(game.p1ship.x - town.x,2)+Math.pow(game.p1ship.y - town.y,2),0.5);
			if (dist < 500 && dist > 55) {
				candidates.push(town);
			};
		};
		for (var marker of candidates) {
			dist = Math.pow(Math.pow(game.p1ship.x - marker.x,2)+Math.pow(game.p1ship.y - marker.y,2),0.5);
			if (dist > 55) {
				markers.push(marker);
			};
		};
		var direction, dist, x, y;
		for (var marker of markers) {
			direction = Math.atan2(marker.x-game.p1ship.x,game.p1ship.y-marker.y);
			dist = Math.pow(Math.pow(marker.x - game.p1ship.x,2)+Math.pow(marker.y - game.p1ship.y,2),0.5);
			x = Math.sin(direction) * 55 * 1.2;
			y = Math.cos(direction) * - 55;
			var markerGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
			navMarkersGroup.appendChild(markerGroup);
			var markerUse = document.createElementNS('http://www.w3.org/2000/svg','use');
			markerGroup.appendChild(markerUse);
			markerUse.setAttribute('x',x);
			markerUse.setAttribute('y',y);
			markerUse.setAttribute('transform','rotate('+view.r2d(direction)+' '+x+' '+y+')');
			markerUse.setAttribute('stroke','black');
			view.setHref(markerUse,'navMarker');
			var text = document.createElementNS('http://www.w3.org/2000/svg','text');
			markerGroup.appendChild(text);
			text.setAttribute('x',x);
			text.setAttribute('y',y-2);
			text.setAttribute('font-size',1.7);
			text.setAttribute('text-anchor','middle');
			text.innerHTML = marker.name;
			if (marker.type == undefined) {
				markerUse.setAttribute('fill','silver');
				var opacity = (500 - dist)/500;
				markerGroup.setAttribute('opacity',opacity);
			} else if (marker.type == 'course') {
				markerUse.setAttribute('fill','yellow');
			};
		};
	},
	
	updatePlayerMap: function(map) {
		if (document.getElementById('mapTile'+map.id) == null) {
			var mapSVG = document.getElementById('mapSVG');
			var mapTileGroup = document.getElementById('mapTileGroup');
			var mapLegendsGroup = document.getElementById('mapLegendsGroup');
			if (mapSVG !== null) {
				var mapTileUse = document.createElementNS('http://www.w3.org/2000/svg','use');
				mapTileUse.id = 'mapTile'+map.id;
				view.setHref(mapTileUse,'tileHex');
				mapTileUse.setAttribute('x',map.x);
				mapTileUse.setAttribute('y',map.y);
				mapTileUse.setAttribute('fill',map.backgroundColor);
				mapTileUse.setAttribute('stroke','none');
				mapTileGroup.appendChild(mapTileUse);
				if (map.town !== undefined) {
					var circle = document.createElementNS('http://www.w3.org/2000/svg','circle');
					mapTileGroup.appendChild(circle);
					circle.setAttribute('cx',map.town.x);
					circle.setAttribute('cy',map.town.y);
					circle.setAttribute('r',20);
					circle.setAttribute('stroke','white');
					circle.setAttribute('stroke-width',15);
					var text = document.createElementNS('http://www.w3.org/2000/svg','text');
					mapLegendsGroup.appendChild(text);
					text.setAttribute('x',map.town.x);
					text.setAttribute('y',map.town.y+80);
					text.setAttribute('font-size',80);
					text.setAttribute('text-anchor','middle');
					text.setAttribute('stroke','white');
					text.setAttribute('stroke-width',15);
					text.setAttribute('paint-order','stroke');
					text.innerHTML = map.town.name;
					text.addEventListener('click',handlers.setCourse.bind(this,map.town));
				};
			};
		};
	},
	
	recenterMap: function() {
		var gameSVG = document.getElementById('gameSVG');
		var center = {x:game.p1ship.x,y:game.p1ship.y};
		gameSVG.setAttribute('viewBox',(center.x-100)+" "+(center.y-61.5)+' 200 123');
// 		gameSVG.setAttribute('viewBox',(center.x-200)+" "+(center.y-123)+' 400 246');
		
		var mapSVG = document.getElementById('mapSVG');
		mapSVG.setAttribute('viewBox',(center.x-3000)+" "+(center.y-3000)+' 6000 6000');
		
		var uiGroup = document.getElementById('uiGroup');
		uiGroup.setAttribute('transform','translate('+(center.x)+" "+(center.y)+')');
		
		var alertsGroup = document.getElementById('alertsGroup');
		alertsGroup.setAttribute('transform','translate('+(center.x)+" "+(center.y)+')');
	},
	
	displayMooring: function(tower) {
		var animation = document.getElementById('targetFade'+tower.id);
		if (animation !== null) {
			animation.beginElement();
		};
	},
	
	displayUnmooring: function(tower) {
		var animation = document.getElementById('targetReveal'+tower.id);
		if (animation !== null) {
			animation.beginElement();
		};
	},
	
	// Music UI
	
	updateMusic: function(soundtrack) {
		document.getElementById('songNameText').innerHTML = soundtrack.currentTrackMetadata.name;
		document.getElementById('songCreditText').innerHTML = 'by ' + soundtrack.currentTrackMetadata.credit;
		document.getElementById('songCreditLink').setAttribute('href',soundtrack.currentTrackMetadata.creditLink);
		view.revealSong();
		view.fadeSong();
	},
	
	revealSong: function() {
		document.getElementById('songReveal').beginElement();
	},
	
	fadeSong: function() {
		document.getElementById('songFade').beginElement();
	},
	
	revealSoundControls: function() {
		document.getElementById('soundControlsReveal').beginElement();
		view.revealSong();
	},
	
	hideSoundControls: function() {
		document.getElementById('soundControlsHide').beginElement();
		view.fadeSong();
	},
	
	toggleSoundPlayPause: function() {
		if (game.soundtrack.paused) {
			document.getElementById('soundControlsPauseShape').setAttribute('opacity',0);
			document.getElementById('soundControlsPlayShape').setAttribute('opacity',1);
		} else {
			document.getElementById('soundControlsPauseShape').setAttribute('opacity',1);
			document.getElementById('soundControlsPlayShape').setAttribute('opacity',0);
		};
	},
	
	// UI Panes
	
	toggleMapPane: function() {
		if (view.panes.minimap == 'minimized') {
			view.maximizeMapPane();
		} else if (view.panes.minimap == 'maximized') {
			view.minimizeMapPane();
		};
	},
	
	maximizeMapPane: function() {
		document.getElementById('mapLegendsGroup').setAttribute('opacity',1);
		document.getElementById('maximizeMap').beginElement();
		document.getElementById('maximizeMapSlide').beginElement();
		view.panes.minimap = 'maximized';
	},
	
	minimizeMapPane: function() {
		document.getElementById('mapLegendsGroup').setAttribute('opacity',0);
		document.getElementById('minimizeMap').beginElement();
		document.getElementById('minimizeMapSlide').beginElement();
		view.panes.minimap = 'minimized';
	},
	
	fadeMapPane: function() {
	},
	
	revealMapPane: function() {
	},
	
	shipToTown: function(town) {
		view.buildTownUI(town);
		document.getElementById('controlsHideAnimation').beginElement();
		document.getElementById('townRevealAnimation').beginElement();
	},
	
	townToShip: function() {
		for (var i=0;i<5;i++) {
			if (view.panes['tab'+i] == 'maximized') {
				view.minimizeTownTab(i);
			};
		};
		document.getElementById('controlsRevealAnimation').beginElement();
		document.getElementById('townHideAnimation').beginElement();
	},
	
	toggleTownTab: function(tabIndex) {
		for (var i=0;i<5;i++) {
			if (i !== parseInt(tabIndex) && document.getElementById('townTab'+i)) {
				document.getElementById('tabsGroup').appendChild(document.getElementById('townTab'+i));
				if (view.panes['tab'+i] == 'maximized') {
					view.minimizeTownTab(i);
				};
			};
		};
		if (view.panes['tab'+tabIndex] == 'maximized') {
			view.minimizeTownTab(tabIndex);
		} else {
			view.maximizeTownTab(tabIndex);
		};
	},
	
	maximizeTownTab: function(tabIndex) {
		if (game.p1ship.currentMap().town.amenities[tabIndex].name == "Shipyard") {
			view.refreshShipyardUI();
		};
		document.getElementById('townTab'+tabIndex+'RevealAnimation').beginElement();
		view.panes['tab'+tabIndex] = 'maximized';
	},
	
	minimizeTownTab: function(tabIndex) {
		document.getElementById('townTab'+tabIndex+'HideAnimation').beginElement();
		view.panes['tab'+tabIndex] = 'minimized';
	},
	
	toggleCrewPane: function() {
		if (view.panes.crew == 'minimized') {
			view.maximizeCrewPane();
		} else {
			view.minimizeCrewPane();
		};
	},
	
	maximizeCrewPane: function() {
		document.getElementById('crewWindowGroup').innerHTML = '';
		view.populateCrewList();
		document.getElementById('crewGroupReveal').beginElement();
		view.panes.crew = 'maximized';
	},
	
	minimizeCrewPane: function() {
		document.getElementById('crewGroupHide').beginElement();
		view.panes.crew = 'minimized';
	},
	
	populateCrewList: function() {
		var crewListGroup = document.getElementById('crewListGroup');
		crewListGroup.innerHTML = '';
		var fo = document.createElementNS('http://www.w3.org/2000/svg','foreignObject');
		fo.setAttribute('x',-91);
		fo.setAttribute('y',-47);
		fo.setAttribute('width',38);
		fo.setAttribute('height',94);
		crewListGroup.appendChild(fo);
		var div = document.createElement('div');
		div.id = 'crewListDiv';
		fo.appendChild(div);
		var h2 = document.createElement('h2');
		div.appendChild(h2);
		h2.innerHTML = 'Crew Roster';
		var crewList = [];
		for (var crewmate of game.p1ship.crew) {
			crewList.push(crewmate);
		}
		crewList.sort(function(a,b) {if (game.postings[a.posting].i < game.postings[b.posting].i) {return -1} else if (game.postings[a.posting].i > game.postings[b.posting].i) {return 1} });
		for (crewmate of crewList) {
			div.appendChild(view.buildCrewListItem(crewmate));
		};
	},
	
	buildCrewListItem: function(crewmate) {
		var div = document.createElement('div');
		var p = document.createElement('p');
		p.className = 'crewListName';
		div.appendChild(p);
		p.innerHTML = crewmate.name;
		var p = document.createElement('p');
		p.className = 'crewListPost';
		div.appendChild(p);
		p.innerHTML = game.postings[crewmate.posting].displayName;
		div.addEventListener('click',view.displayCrewmate.bind(this,crewmate));
		return div;
	},
	
	displayCrewmate: function(crewmate) {
		crewmate.traitPose();
		var crewWindowGroup = document.getElementById('crewWindowGroup')
		crewWindowGroup.innerHTML = '';
		var heartCenter = {x:-40,y:-36};
		var heartGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
		crewWindowGroup.appendChild(heartGroup);
		heartGroup.addEventListener('click',view.happinessWindow.bind(this,crewmate));
		heartGroup.setAttribute('stroke-width',0.25);
		var heartOutlineUse = document.createElementNS('http://www.w3.org/2000/svg','use');
		heartGroup.appendChild(heartOutlineUse)
		heartOutlineUse.setAttribute('x',heartCenter.x);
		heartOutlineUse.setAttribute('y',heartCenter.y);
		heartOutlineUse.setAttribute('stroke','black');
		heartOutlineUse.setAttribute('fill','grey');
		view.setHref(heartOutlineUse,'UIheart');
		var heartFillUse = document.createElementNS('http://www.w3.org/2000/svg','use');
		heartGroup.appendChild(heartFillUse)
		heartFillUse.setAttribute('x',heartCenter.x);
		heartFillUse.setAttribute('y',heartCenter.y);
		heartFillUse.setAttribute('stroke','black');
		heartFillUse.setAttribute('fill','red');
		heartFillUse.setAttribute('transform','translate('+heartCenter.x+' '+heartCenter.y+') scale('+crewmate.happiness()+') translate('+(-1*heartCenter.x)+' '+(-1*heartCenter.y)+') ');
		view.setHref(heartFillUse,'UIheart');
		var xpCenter = {x:-30,y:-36};
		var xpGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
		crewWindowGroup.appendChild(xpGroup);
		xpGroup.setAttribute('stroke-width',0.25);
		var nextLevel = crewmate.nextLevel();
		for (var i=0;i<nextLevel;i++) {
			var angle = i/nextLevel * Math.PI*2
			var circle = document.createElementNS('http://www.w3.org/2000/svg','circle');
			xpGroup.appendChild(circle);
			circle.setAttribute('cx',xpCenter.x + Math.cos(angle) * 3);
			circle.setAttribute('cy',xpCenter.y - Math.sin(angle) * 3);
			circle.setAttribute('r',1);
			circle.setAttribute('stroke','black');
			if (i < crewmate.xp) {
				circle.setAttribute('fill','limegreen');
			} else {
				circle.setAttribute('fill','#803030');
			};
		};
		var xpUse = document.createElementNS('http://www.w3.org/2000/svg','use');
		xpGroup.appendChild(xpUse)
		xpUse.setAttribute('x',xpCenter.x);
		xpUse.setAttribute('y',xpCenter.y);
		xpUse.setAttribute('stroke','black');
		xpUse.setAttribute('fill','limegreen');
		view.setHref(xpUse,'UIxp');
		var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		crewWindowGroup.appendChild(rect);
		rect.setAttribute('x',-20);
		rect.setAttribute('y',-46);
		rect.setAttribute('width',28);
		rect.setAttribute('height',28);
		rect.setAttribute('fill','skyblue');
		rect.setAttribute('stroke','black');
		rect.setAttribute('stroke-width',0.25);
		var headshot = crewmate.body.draw(500,750,'head');
		headshot.setAttribute('x',-20);
		headshot.setAttribute('y',-46);
		headshot.setAttribute('width',28);
		headshot.setAttribute('height',28);
		crewWindowGroup.appendChild(headshot);
		var crewmateFirstName = document.createElementNS('http://www.w3.org/2000/svg','text');
		crewmateFirstName.setAttribute('x',-48);
		crewmateFirstName.setAttribute('y',-25);
		crewmateFirstName.setAttribute('font-size',5);
		crewmateFirstName.innerHTML = crewmate.name.split(' ')[0];
		crewmateFirstName.setAttribute('stroke','lemonchiffon');
		crewmateFirstName.setAttribute('stroke-linejoin','round');
		crewmateFirstName.setAttribute('paint-order','stroke');
		crewWindowGroup.appendChild(crewmateFirstName);
		var crewmateSurname = document.createElementNS('http://www.w3.org/2000/svg','text');
		crewmateSurname.setAttribute('x',-48);
		crewmateSurname.setAttribute('y',-19);
		crewmateSurname.setAttribute('font-size',5);
		crewmateSurname.innerHTML = crewmate.name.split(' ')[1];
		crewmateSurname.setAttribute('stroke','lemonchiffon');
		crewmateSurname.setAttribute('stroke-linejoin','round');
		crewmateSurname.setAttribute('paint-order','stroke');
		crewWindowGroup.appendChild(crewmateSurname);
		var traits = document.createElementNS('http://www.w3.org/2000/svg','text');
		traits.setAttribute('x',-48);
		traits.setAttribute('y',-14);
		traits.setAttribute('font-size',3);
		var string = '';
		var traitArray = Object.keys(crewmate.traits);
		for (var i=0;i<traitArray.length;i++) {
			string += data.traits[traitArray[i]].displayName;
			if (i < traitArray.length - 1) {
				string += " ~ ";
			};
		};
		traits.innerHTML = string;
		crewWindowGroup.appendChild(traits);
		var postings = game.postings;
		var posting = document.createElementNS('http://www.w3.org/2000/svg','text');
		posting.setAttribute('x',-48);
		posting.setAttribute('y',-8);
		posting.setAttribute('font-size',3.5);
		posting.innerHTML = postings[crewmate.posting].displayName;
		crewWindowGroup.appendChild(posting);
		var y = -4;
		for (var statName in crewmate.stats) {
			var statLabel = document.createElementNS('http://www.w3.org/2000/svg','text');
			statLabel.setAttribute('x',-22);
			statLabel.setAttribute('y',y);
			statLabel.setAttribute('font-size',3);
			statLabel.setAttribute('text-anchor','end');
			statLabel.innerHTML = statName + ": ";
			crewWindowGroup.appendChild(statLabel);
			var stat = document.createElementNS('http://www.w3.org/2000/svg','text');
			stat.setAttribute('x',-21);
			stat.setAttribute('y',y);
			stat.setAttribute('font-size',3);
			stat.innerHTML = crewmate.stats[statName];
			crewWindowGroup.appendChild(stat);
			var benefit = document.createElementNS('http://www.w3.org/2000/svg','text');
			benefit.setAttribute('class','statBenefit');
			benefit.setAttribute('x',-17);
			benefit.setAttribute('y',y-0.5);
			benefit.setAttribute('font-size',2);
			crewWindowGroup.appendChild(benefit);
			if (crewmate.stats[statName] > 0) {
				var benefitNum = crewmate.stats[statName];
				if (statName == 'piloting' && crewmate.posting == 'pilot') {
					benefit.innerHTML = "(+"+benefitNum+"% thrust & turn)";
				} else if (statName == 'loadmastery' && crewmate.posting == 'pilot') {
					benefit.innerHTML = "(+"+benefitNum+"% lift)";
				} else if (statName == 'engineering' && crewmate.posting == 'chiefEngineer') {
					benefit.innerHTML = "(+"+benefitNum+"% fuel efficiency & capacity)";
				} else if (statName == 'haggling' && crewmate.posting == 'chiefEngineer') {
					benefit.innerHTML = "("+benefitNum+"% discount at shipyards)";
				} else if (statName == 'haggling' && crewmate.posting == 'supercargo') {
					benefit.innerHTML = "("+benefitNum+"% discount on commodities)";
				} else if (statName == 'loadmastery' && crewmate.posting == 'supercargo') {
					benefit.innerHTML = "(+"+benefitNum+"% cargo capacity)";
				} else if (statName == 'haggling' && crewmate.posting == 'quartermaster') {
					benefit.innerHTML = "("+benefitNum+"% discount to resupply)";
				} else if (statName == 'hospitality' && crewmate.posting == 'quartermaster') {
					benefit.innerHTML = "(+"+benefitNum+"% amenities & harvest)";
				} else if (statName == 'piloting' && crewmate.posting == 'operations') {
					benefit.innerHTML = "(+"+benefitNum+"% stability)";
				} else if (statName == 'hospitality' && crewmate.posting == 'operations') {
					benefit.innerHTML = "(+"+benefitNum+"% harvest)";
				} else if (statName == 'loadmastery' && crewmate.posting == 'engineering') {
					benefit.innerHTML = "(+"+benefitNum+"% recharge)";
				} else if (statName == 'engineering' && crewmate.posting == 'engineering') {
					benefit.innerHTML = "(+"+benefitNum+" damage control)";
				} else if (statName == 'hospitality' && crewmate.posting == 'morale') {
					benefit.innerHTML = "(+"+benefitNum+"% amenities)";
				};
			};
			y += 4;		
		};
		var change = document.createElementNS('http://www.w3.org/2000/svg','text');
		change.setAttribute('x',-48);
		change.setAttribute('y',29);
		change.setAttribute('font-size',3);
		change.innerHTML = 'Post '+crewmate.name.split(' ')[0]+' To:';
		crewWindowGroup.appendChild(change);
		var x = -46, y = 31;
		for (var posting in postings) {
			var postingButton = view.buildButton(postings[posting].buttonName,x,y,30,0.4);
			postingButton.addEventListener('click',handlers.changePosting.bind(this,crewmate,posting));
			crewWindowGroup.appendChild(postingButton);
			if (x > -10) {x = -46;y += 6} else {x += 13};
		}
	},
	
	happinessWindow: function(crewmate) {
		var div = view.windowObjectToDiv({title:crewmate.name + "'s Happiness",paragraphs:[]});
		var ul = document.createElement('ul');
		div.appendChild(ul);
		var log = crewmate.happiness(true);
		for (var item of log) {
			var li = document.createElement('li');
			ul.appendChild(li);
			li.innerHTML = "+" + Math.floor(item.value) + " " + item.label;
		};
		var li = document.createElement('li');
		ul.appendChild(li);
		li.innerHTML = Math.floor(crewmate.happiness() * 100) + " Total";
		var buttonArray = [{label:'OK',execute:view.dismissWindow}];
		view.displayWindow(div,buttonArray);
	},
	
	rumble: function() {
		var rumbleAnimation = document.getElementById('rumbleAnimation');
		rumbleAnimation.beginElement();
	},
	
	displayAlert: function(alert,color) {
		if (color == undefined) { color = 'red' };
		var alertsGroup = document.getElementById('alertsGroup');
		alertsGroup.innerHTML = '';
		var alertText = document.createElementNS('http://www.w3.org/2000/svg','text');
		alertText.setAttribute('x',0);
		alertText.setAttribute('y',-45);
		alertText.setAttribute('text-anchor','middle');
		alertText.setAttribute('font-size',3);
		alertText.innerHTML = alert;
		alertText.setAttribute('class','alert');
		alertText.setAttribute('fill',color);
		alertText.setAttribute('stroke','black');
		alertText.setAttribute('paint-order','stroke');
		alertsGroup.appendChild(alertText);
		var alertFade = document.createElementNS('http://www.w3.org/2000/svg','animate');
		alertFade.setAttribute('attributeName','opacity');
		alertFade.setAttribute('attributeType','XML');
		alertFade.setAttribute('from','1');
		alertFade.setAttribute('to','0');
		alertFade.setAttribute('dur','5s');
		alertFade.setAttribute('begin','indefinite');
		alertFade.setAttribute('fill','freeze');
		alertText.appendChild(alertFade);
		alertFade.beginElement();
	},
	
	buildComponentDisplay: function(component) {
		var componentGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
		
		var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		componentGroup.appendChild(rect);
		rect.setAttribute('x',-15);
		rect.setAttribute('y',-7.5);
		rect.setAttribute('width',30);
		rect.setAttribute('height',15);
		rect.setAttribute('fill','white');
		rect.setAttribute('stroke','black');
		rect.setAttribute('stroke-width',0.5);
		
		var nameText = document.createElementNS('http://www.w3.org/2000/svg','text');
		componentGroup.appendChild(nameText);
		nameText.setAttribute('x',-14);
		nameText.setAttribute('y',-4.25);
		nameText.setAttribute('font-size',2.25);
		nameText.innerHTML = component.name;
		
		var i=2;
		var prettyNames = {
			lift: 'lift',
			turn: 'turn',
			thrust: 'thrust',
			stability: 'stability',
			drag: 'drag',
			recharge: 'recharge',
			cargo: 'cargo',
			loadTime: 'load speed',
			amenities: 'amenities',
			harvest: 'harvest',
			weight: 'weight',
			chargeCapacity: 'capacity',
			fuelEfficiency: 'efficiency',
			internalSlots: 'bays',
			externalSlots: 'pylons',
			topSlots: 'top points',
			hulls: 'hulls',
		};
		for (var statName in component.stats) {
			var statText = document.createElementNS('http://www.w3.org/2000/svg','text');
			componentGroup.appendChild(statText);
			statText.setAttribute('x',-2);
			statText.setAttribute('y',-5.5 + i * 2);
			statText.setAttribute('font-size',1.8);
			statText.innerHTML = Math.floor(component.stats[statName]*100)/100;
			statName = prettyNames[statName];
			var statText = document.createElementNS('http://www.w3.org/2000/svg','text');
			componentGroup.appendChild(statText);
			statText.setAttribute('x',-3);
			statText.setAttribute('y',-5.5 + i * 2);
			statText.setAttribute('font-size',1.8);
			statText.setAttribute('text-anchor','end');
			statText.innerHTML = statName + ":";
			i++;
		};

		var statText = document.createElementNS('http://www.w3.org/2000/svg','text');
		componentGroup.appendChild(statText);
		statText.setAttribute('x',13);
		statText.setAttribute('y',-1.5);
		statText.setAttribute('font-size',1.8);
		statText.setAttribute('text-anchor','end');
		statText.innerHTML = component.type;
		
		var statText = document.createElementNS('http://www.w3.org/2000/svg','text');
		componentGroup.appendChild(statText);
		statText.setAttribute('x',13);
		statText.setAttribute('y',0.5);
		statText.setAttribute('font-size',1.8);
		statText.setAttribute('text-anchor','end');
		statText.innerHTML = Math.floor(component.condition*100) + "%";
				
		var statText = document.createElementNS('http://www.w3.org/2000/svg','text');
		componentGroup.appendChild(statText);
		statText.setAttribute('x',13);
		statText.setAttribute('y',4.5);
		statText.setAttribute('font-size',1.8);
		statText.setAttribute('text-anchor','end');
		statText.innerHTML = "$" + Math.floor(component.cost*component.condition);
		
		if (component.condition < 1) {
			var statText = document.createElementNS('http://www.w3.org/2000/svg','text');
			componentGroup.appendChild(statText);
			statText.setAttribute('x',13);
			statText.setAttribute('y',6.5);
			statText.setAttribute('font-size',1.8);
			statText.setAttribute('text-anchor','end');
			statText.setAttribute('fill','red');
			statText.setAttribute('stroke','white');
			statText.setAttribute('paint-order','stroke');
			statText.innerHTML = "Repairs: $" + Math.ceil(component.cost*(1-component.condition)*game.p1ship.discount('shipyard'));
		}
				
		return componentGroup
	},
	
	// Events
	
	addEvent: function(event) {
		var eventsGroup = document.getElementById('eventsGroup');
		var ordinal = eventsGroup.children.length;
		var eventGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
		eventGroup.id = 'event_'+event.id;
		eventsGroup.appendChild(eventGroup);
		eventGroup.setAttribute('stroke','black');
		eventGroup.setAttribute('stroke-width',0.5);
		var center = {x:-59 + ordinal * 12+5,y:-55.5};
		var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		rect.setAttribute('x',center.x-5.5);
		rect.setAttribute('y',center.y-9);
		rect.setAttribute('width',11);
		rect.setAttribute('height',14);
		rect.setAttribute('rx',2);
		rect.setAttribute('ry',2);
		rect.setAttribute('fill','saddlebrown');
		eventGroup.appendChild(rect);
		var totalSpines = event.time;
		for (var i=0;i<totalSpines;i++) {
			var x2 = center.x + Math.sin(Math.PI * 2 * i/totalSpines) * 4.5;
			var y2 = center.y - Math.cos(Math.PI * 2 * i/totalSpines) * 4.5;
			var line = document.createElementNS('http://www.w3.org/2000/svg','line');
			eventGroup.appendChild(line);
			line.setAttribute('x1',center.x);
			line.setAttribute('y1',center.y);
			line.setAttribute('x2',x2);
			line.setAttribute('y2',y2);
			line.setAttribute('stroke','red');
			line.setAttribute('stroke-width',1);
			line.setAttribute('stroke-linecap','round');
			var fade = document.createElementNS('http://www.w3.org/2000/svg','animate');
			fade.id = 'e'+event.id+'f'+i;
			fade.setAttribute('attributeType','XML');
			fade.setAttribute('attributeName','opacity');
			fade.setAttribute('from',1);
			fade.setAttribute('to',0);
			fade.setAttribute('dur','1s');
			fade.setAttribute('fill','freeze');
			if (i==0) {
				fade.setAttribute('begin','indefinite');
				line.appendChild(fade);
				var firstAnimate = fade;
			} else {
				fade.setAttribute('begin','e'+event.id+'f'+(i-1)+'.end');
				line.appendChild(fade);
			};
		};
		var circle = document.createElementNS('http://www.w3.org/2000/svg','circle');
		eventGroup.appendChild(circle);
		circle.setAttribute('cx',center.x);
		circle.setAttribute('cy',center.y);
		circle.setAttribute('r',4);
		circle.setAttribute('fill','lemonchiffon');
		circle.setAttribute('stroke','black');
		circle.setAttribute('stroke-width',0.25);
		var iconUse = document.createElementNS('http://www.w3.org/2000/svg','use');
		eventGroup.appendChild(iconUse);
		iconUse.setAttribute('x',center.x);
		iconUse.setAttribute('y',center.y);
		view.setHref(iconUse,event.icon);
		firstAnimate.beginElement();
		eventGroup.addEventListener('click',handlers.doEvent.bind(this,event));
	},
	
	removeEvent: function(event) {
		var eventGroup = document.getElementById('event_'+event.id);
		var eventsGroup = document.getElementById('eventsGroup');
		var eventNodes = eventsGroup.children;
		var removed = false;
		for (var i=0;i<eventNodes.length;i++) {
			if (eventNodes[i] == eventGroup) {
				eventNodes[i].remove();
				removed = true;
				i--;
			} else if (removed) {
				var slide = document.createElementNS('http://www.w3.org/2000/svg','animateTransform');
				slide.setAttribute('attributeType','XML');
				slide.setAttribute('attributeName','transform');
				slide.setAttribute('type','translate');
				slide.setAttribute('from',0);
				slide.setAttribute('to',-12);
				slide.setAttribute('dur','0.5s');
				slide.setAttribute('fill','freeze');
				slide.setAttribute('begin','indefinite');
				slide.setAttribute('additive','sum');
				eventNodes[i].appendChild(slide);
				slide.beginElement();
			};
		};
	},
	
	displayWindow: function(contents,buttonArray,image) {
		var windowGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
		alertsGroup.appendChild(windowGroup);
		if (image !== undefined) {
			console.log('images in windows not yet code');
		};
		var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		rect.setAttribute('x',-75);
		rect.setAttribute('y',-50);
		rect.setAttribute('width',150);
		rect.setAttribute('height',100);
		rect.setAttribute('fill','lemonchiffon');
		rect.setAttribute('stroke','saddlebrown');
		windowGroup.appendChild(rect);
		var foreignObject = document.createElementNS('http://www.w3.org/2000/svg','foreignObject');
		windowGroup.appendChild(foreignObject);
		foreignObject.id = 'gameModalWindow';
		foreignObject.setAttribute('x',-70);
		foreignObject.setAttribute('y',-25);
		foreignObject.setAttribute('width',140);
		foreignObject.setAttribute('height',65);
		foreignObject.appendChild(contents);
		var fadeIn = document.createElementNS('http://www.w3.org/2000/svg','animate');
		fadeIn.setAttribute('attributeType','XML');
		fadeIn.setAttribute('attributeName','opacity');
		fadeIn.setAttribute('from',0);
		fadeIn.setAttribute('to',1);
		fadeIn.setAttribute('dur','0.25s');
		fadeIn.setAttribute('fill','freeze');
		fadeIn.setAttribute('begin','indefinite');
		windowGroup.appendChild(fadeIn);
		fadeIn.beginElement();
		var x = 35;
		for (var button of buttonArray) {
			var buttonGroup = view.buildButton(button.label,x,35);
			windowGroup.appendChild(buttonGroup);
			buttonGroup.addEventListener('click',button.execute);
			x -= 32;
		};
		setTimeout(view.pauseAnimations,500);
	},
	
	windowObjectToDiv: function(object) {
		var div = document.createElement('div');
		if (object.image !== undefined) {
			console.log('code the image part of this.');
		};
		if (object.title !== undefined) {
			var h1 = document.createElement('h1');
			div.appendChild(h1);
			h1.innerHTML = object.title;
		};
		for (var string of object.paragraphs) {
			var p = document.createElement('p');
			div.appendChild(p);
			p.innerHTML = string;
		};
		
		return div;
	},
	
	pauseAnimations: function() {
		if (game !== undefined) {
			game.clock.paused = true;
		};
		document.getElementById('gameSVG').pauseAnimations();
	},
	
	dismissWindow: function() {
		document.getElementById('alertsGroup').innerHTML = '';
		if (game !== undefined) {
			game.clock.paused = false;
			game.clock.go();
		};
		document.getElementById('gameSVG').unpauseAnimations();
	},

};