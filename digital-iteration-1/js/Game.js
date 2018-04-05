"use strict";

GameStates.makeGame = function( game, shared ) {
    // Create your own variables.
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
    
    function quitGame() {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //  Then let's go back to the main menu.
        game.state.start('MainMenu');

    }
	
	function checkOverlap(spriteA, spriteB) {

    	var boundsA = spriteA.getBounds();
    	var boundsB = spriteB.getBounds();

    	return Phaser.Rectangle.intersects(boundsA, boundsB);

	}

	function wallSightHandler(sight, wall){
		wall.loadTexture('booltileT',0);
		wallIsTrue = 1;
	}

	function goalHandler(player, goal){
		goal.kill();
		playerSpeed = 0;
		playerJump = 0;
		gameover.loadTexture('youwin');
		text.text=("You win!");
	}

	function spikeHandler(player, spike){
		player.loadTexture('protagfaint',0);
		playerSpeed = 0;
		playerJump = 0;
		gameover.loadTexture('gameover');
		text.text=("GAME OVER");
	}
	
    return {
    
        create: function () {
    
            //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
			

			game.physics.startSystem(Phaser.Physics.ARCADE);
			

			
			
			playerSpeed = 200;
			playerJump = -350;
			
			music = game.add.audio('gameMusic');
			music.play();
			field = game.add.tileSprite(0, 0, 800, 600, 'bg');
			field.fixedToCamera = true;


			map = game.add.tilemap('level1');
			map.addTilesetImage('tile');
			map.setCollisionByExclusion([]);

			layer = map.createLayer('Tile Layer 1');
			//layer.debug = true;
			layer.resizeWorld();
			//game.camera.follow(player);

			sight = game.add.sprite(416,316,'sight');
			//sight.anchor.setTo(0,0);
			sight.angle = -90;
			game.physics.enable(sight, Phaser.Physics.ARCADE);
			sight.body.allowGravity = 0;
			sight.body.immovable = true;
			//sight.body.setSize(1, 800, 0, 0);

			//Obstacles
			wall = game.add.sprite(512,832,'booltileF');
			game.physics.enable(wall, Phaser.Physics.ARCADE);
			wall.body.allowGravity = 0;
			wall.body.immovable = true;
			//wall.body.velocity.x = 0;
			//wall.body.velocity.y = 0;


			plat1 = game.add.sprite(768,768,'platF');
			//plat1.angle = -90;
			game.physics.enable(plat1, Phaser.Physics.ARCADE);
			plat1.body.allowGravity = 0;
			plat1.body.immovable = true;



			plat2 = game.add.sprite(768,864,'platF');
			//plat2.angle = -90;
			game.physics.enable(plat2, Phaser.Physics.ARCADE);
			plat2.body.allowGravity = 0;
			plat2.body.immovable = true;
			

			player = game.add.sprite(200,864,'protagr');
			game.physics.enable(player, Phaser.Physics.ARCADE);
			player.body.bounce.set(0.1);
			player.body.collideWorldBounds = true;
			game.camera.follow(player);
			
	
			goal = game.add.sprite(1000,864,'coin');		
			game.physics.enable(goal, Phaser.Physics.ARCADE);
			goal.body.allowGravity = 0;
			goal.body.immovable = true;

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

			gameover = game.add.sprite(480, 360, 'gamenotover');
			text = game.add.text(game.world.centerX,game.world.centerY,' ', { font: '84px Arial', fill: '#fff' });
			game.physics.arcade.gravity.y = 500;

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

			//World Collision
			game.physics.arcade.collide(player, layer);
			game.physics.arcade.collide(player,goal,goalHandler);
			//game.physics.arcade.collide(plat2, player);
			//wallIsTrue = 0;
			//wall.loadTexture('booltileT',0);
			//game.physics.arcade.overlap(sight, wall, wallSightHandler);
			//if(wallIsTrue)
			if(checkOverlap(sight,wall)){
				game.physics.arcade.collide(wall, player);
				wall.loadTexture('booltileT',0);
			}
			else
			{
				wall.loadTexture('booltileF',0);
				
			}
			if(checkOverlap(sight,plat1)){
				game.physics.arcade.collide(plat1, player);
				//player.y += 1;
				plat1.loadTexture('platT',0);
			}
			else
			{
				plat1.loadTexture('platF',0);
				
			}
			if(checkOverlap(sight,plat2)){
				game.physics.arcade.collide(plat2, player);
				plat2.loadTexture('platT',0);
			}
			else
			{
				plat2.loadTexture('platF',0);
				
			}
			
			if(checkOverlap(sight,spike1) && (sight.angle < 45 && sight.angle > -45)){
				game.physics.arcade.collide(player, spike1, spikeHandler);
				spike1.loadTexture('spikeT',0);
			}
			else
			{
				spike1.loadTexture('spikeF',0);
				
			}
			if(checkOverlap(sight,spike2) && (sight.angle < 45 && sight.angle > -45)){
				game.physics.arcade.collide(player, spike2, spikeHandler);
				spike2.loadTexture('spikeT',0);
			}
			else
			{
				spike2.loadTexture('spikeF',0);
				
			}
			if(checkOverlap(sight,spike3) && (sight.angle < 45 && sight.angle > -45)){
				game.physics.arcade.collide(player, spike3, spikeHandler);
				spike3.loadTexture('spikeT',0);
			}
			else
			{
				spike3.loadTexture('spikeF',0);
				
			}

			//Player Controls and Conditions
			player.body.velocity.x = 0;
			

			if (cursors.left.isDown || aKey.isDown)
    		{
        		player.body.velocity.x = -(playerSpeed);
				
	
    		}
    		else if (cursors.right.isDown || dKey.isDown)
    		{
        		player.body.velocity.x = playerSpeed;

      
    		}
			
			if((player.y + 32 == plat1.y && player.x >= plat1.x && player.x + 32 <= plat1.x + 96) || (player.y + 32 == plat2.y && player.x >= plat2.x && player.x + 32 <= plat2.x + 96)){
				onPlat = 1;
			}
			else
			{
				onPlat = 0;
			}

			if ((cursors.up.isDown || wKey.isDown) && (player.body.onFloor() || onPlat) && game.time.now > jumpTimer)
    		{
        		player.body.velocity.y = playerJump;
        		jumpTimer = game.time.now + 750;
    		}
			

			if(zKey.isDown || oKey.isDown)
				sight.angle += 1;
			else if(xKey.isDown || pKey.isDown)
				sight.angle -= 1;
			
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

   			sight.x = player.x + 16;
    		sight.y = player.y + 16;

		},
		render: function () {
			game.debug.text('' + wallIsTrue, 32, 64);
		}
    };
};
