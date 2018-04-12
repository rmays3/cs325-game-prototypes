"use strict";

GameStates.makeGame = function( game, shared ) {
	//You can set scale using two variables!    
	//example.scale.set(x,y)
	//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sin
	//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/cos
	//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/PI
	//https://phaser.io/examples/v2/arcade-physics/bounding-box
	//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/abs
	//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sqrt
	var music;
	var text;
	var playerSpeed;
	var playerJump;
	var cursors;
	var wKey;
	var aKey;
	var sKey;
	var dKey;
	var zKey;
	var xKey;
	var oKey;
	var pKey;
	var map;
	var tileset;
	var layer;
	var player;
	var playerSpeed;
	var gameover;
	var field;
	var sight;
	var lastSpikes;
	var layer;
	var spikes;
	var wall;
	var plat1;
	var plat2;
	var goal;
	var wallIsTrue = 0;
	var plat1IsTrue;
	var plat2IsTrue;
	var spike1;
	var spike2;
	var spike3;
	var playerHitsBool = 0;
	var jumpTimer = 0;
	var onPlat = 0;
	var trueAngle = 0;
	var test;
	var test1;
	var test2;
	var mover;
    function quitGame() {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.
		music.stop();
		wall.kill();
		plat1.kill();
		plat2.kill();
		spike1.kill();
		spike2.kill();
		spike3.kill();
		player.kill();
		sight.kill();
		//This last line is important.
		trueAngle = 0;
		//map.free();
		//layer.kill();
        //  Then let's go back to the main menu.
        game.state.start('MainMenu');

    }
	

	//PLAYER HITS GOAL
	function goalHandler(player, goal){
		goal.kill();
		playerSpeed = 0;
		playerJump = 0;
		gameover.loadTexture('youwin');
		text.text=("You win!");
		quitGame();
	}

	
	function checkAbsoluteEpsilon(a,b){
		var EPSILON = 1;
		
		return(a - b <= EPSILON);
	}
	
	//PLAYER HITS SPIKE
	function spikeHandler(player, spike){
		player.loadTexture('protagfaint',0);
		playerSpeed = 0;
		playerJump = 0;
		gameover.loadTexture('gameover');
		text.text=("GAME OVER");
	}


	//REFINED SIGHT OVERLAP
	function sightAngleHandler(spriteA, spriteB){

		//player.x = 50;
		//Establish center of character
		var centerX = 16;
		var centerY = 16;
		
		//Establish the distance between player and wall
		var distX = ((spriteB.x) - (player.x + centerX));
		var distY = ((spriteB.y) - (player.y + centerY));

		//Establish the slope
		var aRad = trueAngle * (Math.PI / 180);
		var sine = Math.sin(aRad);
		var cosine = Math.cos(aRad);
		var slope = sine / cosine;
		
		//Calculate intersection on x and y
		var boundsA = spriteA.getBounds();
    	var boundsB = spriteB.getBounds();

		var totalX = (player.x + centerX) - (distY * (1 / slope));
		var totalY = (player.y + centerY) - (distX * slope);

		if((totalY >= spriteB.y && totalY < spriteB.y + spriteB.height) && (Phaser.Rectangle.intersects(boundsA, boundsB)))
			return 1;
		totalY = (player.y + centerY) - ((distX + spriteB.width) * slope);
		if((totalY >= spriteB.y && totalY < spriteB.y + spriteB.height) && (Phaser.Rectangle.intersects(boundsA, boundsB)))
			return 1;
		if((totalX >= spriteB.x && totalX < spriteB.x + spriteB.width) && (Phaser.Rectangle.intersects(boundsA, boundsB)))
			return 1;
		totalX = (player.x + centerX) - ((distY + spriteB.height) * (1 / slope));
		if((totalX >= spriteB.x && totalX < spriteB.x + spriteB.width) && (Phaser.Rectangle.intersects(boundsA, boundsB)))
			return 1;
		else
			return 0;
	}
	

	function sightHazardHandler(sight, hazard){
		if((Math.abs(hazard.y - player.y) <= 32) && (Math.abs(hazard.x - player.x) <= 32))
			return 0;
		return 1;
	}

	//HANDLE JUMPS ON SPECIAL PLATFORMS
	function onPlatHandler(player, plat){
		if((player.y + player.height) == plat.y && ((player.x >= plat.x) && (player.x <= (plat.x + plat.width) )))
			return 1;
		return 0;
	}

	function incrementTrueAngle(int){
		trueAngle += int;
		if(trueAngle >= 360)
			trueAngle -= 360;
		else if(trueAngle <= -1)
			trueAngle = 360 + trueAngle;
	}
    return {
    
        create: function () {
    
            //I'm going to iterate on this a lot, so I'll need some good documentation!
			
			//ENABLE PHYSICS
			game.physics.startSystem(Phaser.Physics.ARCADE);
			game.physics.arcade.gravity.y = 500;

			
			//PLAYER CONTROL CONSTANTS
			playerSpeed = 200;
			playerJump = -350;
			
			//MUSIC
			music = game.add.audio('gameMusic');
			music.play();
		
			//TILE MAP
			//	Sprites
			field = game.add.tileSprite(0, 0, 800, 600, 'bg');
			
			//	Camera
			field.fixedToCamera = true;

			//	Settings
			map = game.add.tilemap('level1');
			map.addTilesetImage('tile');
			map.setCollisionByExclusion([]);

			//	Layer
			layer = map.createLayer('Tile Layer 1');
			//layer.debug = true;
			layer.resizeWorld();
			//game.camera.follow(player);

			//SIGHT SETTINGS
			sight = game.add.sprite(416,316,'sight');
			//sight.anchor.setTo(0,0);
			sight.angle = -90;
			game.physics.enable(sight, Phaser.Physics.ARCADE);
			sight.body.allowGravity = 0;
			sight.body.immovable = true;
			//sight.body.setSize(1, 800, 0, 0);

			//WALL
			wall = game.add.sprite(512,832,'booltileF');
			game.physics.enable(wall, Phaser.Physics.ARCADE);
			wall.body.allowGravity = 0;
			wall.body.immovable = true;
			//wall.body.velocity.x = 0;
			//wall.body.velocity.y = 0;

			mover = game.add.sprite(512,832,'move');
			game.physics.enable(mover, Phaser.Physics.ARCADE);
			mover.body.allowGravity = 0;
			mover.body.immovable = true;
			

			//PLATFORM 1
			plat1 = game.add.sprite(768,768,'platF');
			//plat1.angle = -90;
			game.physics.enable(plat1, Phaser.Physics.ARCADE);
			plat1.body.allowGravity = 0;
			plat1.body.immovable = true;


			//PLATFORM 2
			plat2 = game.add.sprite(768,864,'platF');
			//plat2.angle = -90;
			game.physics.enable(plat2, Phaser.Physics.ARCADE);
			plat2.body.allowGravity = 0;
			plat2.body.immovable = true;
			
			//PLAYER
			player = game.add.sprite(200,864,'protagr');
			game.physics.enable(player, Phaser.Physics.ARCADE);
			player.body.bounce.set(0.1);
			player.body.collideWorldBounds = true;
			game.camera.follow(player);
			
			//GOAL	
			goal = game.add.sprite(1000,864,'coin');		
			game.physics.enable(goal, Phaser.Physics.ARCADE);
			goal.body.allowGravity = 0;
			goal.body.immovable = true;
			

			//test = goal.width;

			//SPIKES
			spike3 = game.add.sprite(1216,896,'spikeF');
			game.physics.enable(spike3, Phaser.Physics.ARCADE);
			spike3.body.allowGravity = 0;
			spike3.body.immovable = true;

			spike2 = game.add.sprite(1184,896,'spikeF');
			game.physics.enable(spike2, Phaser.Physics.ARCADE);
			spike2.body.allowGravity = 0;
			spike2.body.immovable = true;

			spike1 = game.add.sprite(1152,896,'spikeF');
			game.physics.enable(spike1, Phaser.Physics.ARCADE);
			spike1.body.allowGravity = 0;
			spike1.body.immovable = true;
			
			//GAME OVER SETTINGS
			gameover = game.add.sprite(480, 360, 'gamenotover');
			text = game.add.text(game.world.centerX,game.world.centerY,' ', { font: '84px Arial', fill: '#fff' });
			

			//INPUT			
			cursors = game.input.keyboard.createCursorKeys();
			wKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
			aKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
			dKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
			sKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
			zKey = game.input.keyboard.addKey(Phaser.Keyboard.Z);
			xKey = game.input.keyboard.addKey(Phaser.Keyboard.X);
			oKey = game.input.keyboard.addKey(Phaser.Keyboard.O);
			pKey = game.input.keyboard.addKey(Phaser.Keyboard.P);
			
        },
    
        update: function () {

			//CONSTANT COLLISION
			game.physics.arcade.collide(player, layer);
			game.physics.arcade.collide(player,goal,goalHandler);
			
			//CHECKING FOR OVERLAP ON ALL OBJECTS
			//(PRIMITIVE, WILL BE REPLACED LATER)
			if(sightAngleHandler(sight,wall)){
				game.physics.arcade.collide(wall, player);
				wall.loadTexture('booltileT',0);
			}
			else
			{
				wall.loadTexture('booltileF',0);
				
			}
			if(sightAngleHandler(sight,plat1)){
				game.physics.arcade.collide(plat1, player);
				//player.y += 1;
				plat1.loadTexture('platT',0);
			}
			else
			{
				plat1.loadTexture('platF',0);
				
			}
			if(sightAngleHandler(sight,plat2)){
				game.physics.arcade.collide(plat2, player);
				plat2.loadTexture('platT',0);
			}
			else
			{
				plat2.loadTexture('platF',0);
				
			}
			
			if(sightAngleHandler(sight,spike1) && sightHazardHandler(sight,spike1)){
				game.physics.arcade.collide(player, spike1, spikeHandler);
				spike1.loadTexture('spikeT',0);
			}
			else
			{
				spike1.loadTexture('spikeF',0);
				
			}
			if(sightAngleHandler(sight,spike2) && sightHazardHandler(sight,spike2)){
				game.physics.arcade.collide(player, spike2, spikeHandler);
				spike2.loadTexture('spikeT',0);
			}
			else
			{
				spike2.loadTexture('spikeF',0);
				
			}
			if(sightAngleHandler(sight,spike3) && sightHazardHandler(sight,spike3)){
				game.physics.arcade.collide(player, spike3, spikeHandler);
				spike3.loadTexture('spikeT',0);
			}
			else
			{
				spike3.loadTexture('spikeF',0);
				
			}

			//MOVEMENT SETTINGS
			//	Initial Speed
			player.body.velocity.x = 0;
			
			//	Conditional Speed
			if (cursors.left.isDown || aKey.isDown)
    		{
        		player.body.velocity.x = -(playerSpeed);
				
	
    		}
    		else if (cursors.right.isDown || dKey.isDown)
    		{
        		player.body.velocity.x = playerSpeed;

      
    		}
			//	Check if on a platform
			//(PRIMITIVE)
			if(onPlatHandler(player,plat1) || onPlatHandler(player,plat2) || onPlatHandler(player,wall)){
				onPlat = 1;
			}
			else
			{
				onPlat = 0;
			}

			//	Jump
			if ((cursors.up.isDown || wKey.isDown) && (player.body.onFloor() || onPlat) && game.time.now > jumpTimer)
    		{
        		player.body.velocity.y = playerJump;
        		jumpTimer = game.time.now + 750;
    		}
			
			//	See
			if(zKey.isDown || oKey.isDown)
			{
				incrementTrueAngle(1);
				sight.angle -= 1;
			}
			else if(xKey.isDown || pKey.isDown)
			{
				incrementTrueAngle(-1);
				sight.angle += 1;
			}
		
			
			//	Sight Sprite Update
			//Adjust the player's sprite according to the sight angle
			if(sight.angle > -45 && sight.angle <= 0)
				player.loadTexture('protagd',0);
			//(sight.angle < 45 && sight.angle >= 0)
			else if(sight.angle < 45 && sight.angle >= 0)
				player.loadTexture('protagdl',0);
			//sight.angle < 90 && sight.angle >= 45
			else if(sight.angle < 90 && sight.angle >= 45)
				player.loadTexture('protagl',0);
			//sight.angle < 135 && sight.angle >= 90
			else if(sight.angle < 135 && sight.angle >= 90)
				player.loadTexture('protagul',0);
			//sight.angle < 180 && sight.angle >= 135
			else if(sight.angle < 180 && sight.angle >= 135)
				player.loadTexture('protagu',0);
			//sight.angle > -180 && sight.angle <= -135
			else if(sight.angle > -180 && sight.angle <= -135)
				player.loadTexture('protagur',0);
			else if(sight.angle > -135 && sight.angle <= -90)
				player.loadTexture('protagr',0);
			else
				player.loadTexture('protagdr',0);

        },
		preRender: function () {
			//SIGHT ROTATION
   			sight.x = player.x + 16;
    		sight.y = player.y + 16;

		},

		render: function () {
			//DEBUG
			game.debug.text('' + wall.x + ', ' + wall.y, 32, 32);
			game.debug.text('' + player.x + ', ' + player.y , 32, 64);
			//game.debug.text('' + test2, 32, 96);
		}
    };
};
