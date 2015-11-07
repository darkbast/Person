enchant();
window.onload = function() {
	var game = new Core(320, 320);
	game.preload('chara1.png');
	game.onload = function() {
		var bear = new Sprite(32,32);
		bear.image = game.assets['chara1.png'];
		game.rootScene.addChild(bear);
		
		bear.frame = [5,5,6,6,5,5,7,7];
		bear.scaleX = 1;
		bear.scaleY = 1;
		
		bear.addEventListener(Event.ENTER_FRAME,function(){
			if (bear.scaleX === 1) {
				bear.x += 3;
				if (bear.x > 320-32) bear.scaleY = -1;
			}else{
				bear.x -= 3;
				if (bear.x < 0) bear.scaleY = 1;
			}
		});
	};
game.start();

};