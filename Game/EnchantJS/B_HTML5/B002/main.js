enchant();
var game;
window.onload = function(){
	game = new Core(960,640);
	var sceneGameMain = new Scene();
	game.preload('../../resources/boat.png');
	game.onload = function(){
		var sprite = new Sprite(512,512);
		sprite.x = 200;
		sprite.y = 100;
		
		sprite.image = game.assets['../../resources/boat.png'];
		
		var label = new Label();
		label.text = "Hello World";
		label.x = 200;
		label.y = 200;
		sceneGameMain.addChild(sprite);
		sceneGameMain.addChild(label);
		game.pushScene(sceneGameMain);
	};
	game.start();
};