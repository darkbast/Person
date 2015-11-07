enchant();

var DIR_LEFT  = 0;
var DIR_RIGHT = 1;
var DIR_UP    = 2;
var DIR_DOWN  = 3;


window.onload = function() {
	var game = new Core(320, 320);
	game.preload('http://enchantjs.com/assets/images/chara0.gif',
		'http://enchantjs.com/assets/images/map0.gif');
	game.onload = function() {
		var bg = new Sprite(320,320);
		var maptip = game.assets['http://enchantjs.com/assets/images/map0.gif'];
		
		var image = new Surface(320,320);
		
		for (var j=0;j<320;j=j+16){
			for (var i=0;i<320;i=i+16){
				image.draw(maptip,0,0,16,16,i,j,16,16);
			}
		}
		bg.image = image;
		game.rootScene.addChild(bg);
		
		var girl = new Sprite(32, 32);
		girl.image = game.assets['http://enchantjs.com/assets/images/chara0.gif'];
		girl.x = 160 - 16;
		girl.y = 160 - 16;
		girl.frame = 7;
		
		girl.toX = girl.x;
		girl.toY = girl.y;
		girl.dir = DIR_DOWN;
		girl.anim = [
			15,16,17,16,
			24,25,26,24,
			33,34,35,34,
			6,7,8,7];
		
		game.rootScene.addChild(girl);
		
		
	};
	game.start();
};