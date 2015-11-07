enchant();

var game;
window.onload = function(){
	game = new Core(320,320);
	game.onload = function(){
		sign = new Label();
		sign.text = "Hello World";
		game.rootScene.addChild(sign);
	};
	
	game.start();

};