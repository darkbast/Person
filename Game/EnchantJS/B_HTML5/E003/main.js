enchant();
window.onload = function() {
	//Game object creation
	var game = new Core(320, 320);
	game.fps = 16;
	game.score = 0;
	var label;
	var bear;
	//Image loading
	game.preload('chara1.png',
		'http://enchantjs.com/assets/images/map0.gif',
		'http://enchantjs.com/assets/images/icon0.gif');
	//Called when the loading is complete
	game.onload = function() {
		//Background creation
		var bg = new Sprite(320, 320);
		bg.backgroundColor = "rgb(0, 200, 255)";
		var maptip = game.assets['http://enchantjs.com/assets/images/map0.gif'];
		var image = new Surface(320, 320);

		for (var i = 0; i < 320; i += 16) {
			image.draw(maptip, 7 * 16, 0, 16, 16, i, 320 - 16, 16, 16);
		}
		bg.image = image;
		game.rootScene.addChild(bg);

		//Virtual pad creation
		var pad = new Pad();
		pad.x = 0;
		pad.y = 220;
		game.rootScene.addChild(pad);

		//Label creation
		label = new Label("");
		game.rootScene.addChild(label);

		//Bear creation
		bear = new Sprite(32, 32);
		bear.image = game.assets['chara1.gif'];
		bear.x = 160 - 16;
		bear.y = 320 - 16 - 32;
		bear.anim = [10, 11, 10, 12];
		bear.frame = bear.anim[0];
		game.rootScene.addChild(bear);

		//Periodic processing of the bear sprite
		bear.addEventListener(Event.ENTER_FRAME, function() {

			//Left
			if (game.input.left) {
			bear.x -= 3;
			bear.scaleX = -1;
			}

			//Right
			else if (game.input.right) {
			bear.x += 3;
			bear.scaleX = 1;
			}

			//Frame settings
			if (!game.input.left && !game.input.right) {
				bear.frame = bear.anim[0];
			} else {
				bear.frame = bear.anim[bear.age % bear.anim.length];
			}
		});
	};
	
	//Adds an apple
game.addApple = function(x, speed) {
//Create apple
var apple = new Sprite(16, 16);
apple.image = game.assets['http://enchantjs.com/assets/images/icon0.gif'];
apple.x = x;
apple.y = -16;
apple.frame = 15;
apple.speed = speed;
game.rootScene.addChild(apple);
//Periodic processing of the sprite
apple.addEventListener(Event.ENTER_FRAME, function() {
apple.y += apple.speed;
//Collision with the bear
//Collision with the ground
 if (apple.y > 320 - 32) {
game.rootScene.removeChild(apple);
}
});
};
	
	
	
	//Periodic processing of the scene
game.framesLeft = 10*game.fps; // 10 seconds
game.rootScene.addEventListener(Event.ENTER_FRAME, function() {
game.framesLeft--;
if (game.framesLeft > 0) {
//Apple creation
if ((game.frame % 10) === 0) {
var x = rand(300);
var speed = 3 + rand(6);
game.addApple(x,speed);
}
label.text = "Time left:" + Math.floor(game.framesLeft / game.fps) +
"<BR />Score:" + game.score;
} else {
//Display Game Over
game.end(game.score, "Your score is " + game.score);
}
});
//Start game
game.start();
};

//Generates a random number
function rand(num){
return Math.floor(Math.random() * num);
}