enchant();

window.onload = function() {
    var mapframe  = "../res/mapframe.png";
	var maptiles = "../res/maptiles.png";
	var game = new Core(960,480);
	game.preload(mapframe,maptiles);
	
	game.onload = function (){
		var scenceGameMain = new Scene();
		
		// Frame
		var frame = new Sprite(960,640);
		frame.image = game.assets[mapframe];
		scenceGameMain.addChild(frame);
		//game.pushScene(scenceGameMain);
		var tiles = new Sprite(64,64);
		/*
		tiles.images = game.assets[maptiles];
		scenceGameMain.addChild(tiles);
		*/
		
		var map = new Map(64,64);
		map.x = 64;
		map.y = 10;
		map.image = game.assets[maptiles];
		var mapDisplayData = [
			[0,0,0,0,2,2,2,0,0,0,0,0,0],
			[0,0,0,2,3,3,2,0,1,0,0,0,0],
			[0,0,4,0,2,3,3,2,0,0,0,0,0],
			[0,0,0,0,0,2,2,0,1,1,0,0,0],
			[0,0,0,0,4,0,0,0,1,1,0,4,0],
			[1,0,0,0,0,0,4,0,0,0,0,0,0],
			[0,0,0,2,2,0,0,0,0,0,0,0,2],
			//[0,0,0,3,3,3,2,0,0,2,2,3,3]
		];
		
		map.loadData(mapDisplayData);
		scenceGameMain.addChild(map);
				game.pushScene(scenceGameMain);
		
	};
	
	
	game.start();
};









