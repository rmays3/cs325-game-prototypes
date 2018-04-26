"use strict";

GameStates.makeGame = function( game, shared ) {
	//You can set scale using two variables!    
	//example.scale.set(x,y)
	//https://freemusicarchive.org/music/Komiku/Poupis_incredible_adventures_/Komiku_-_Poupis_incredible_adventures__-_62_The_Challenge
	//https://freemusicarchive.org/music/Komiku/Poupis_incredible_adventures_/Komiku_-_Poupis_incredible_adventures__-_42_Night_in_a_seashell
    //https://phaser.io/examples/v2/arcade-physics/multiball
	//https://phaser.io/examples/v2/games/invaders
	//https://phaser.io/examples/v2/sprites/anchor
	//https://phaser.io/examples/v2/tweens/alpha-text
	var music;
	var text;
	var playerSpeed;
	var cursors;
	var wKey;
	var aKey;
	var sKey;
	var dKey;
	var zKey;
	var xKey;
	var oKey;
	var pKey;
	var spaceBar;
	var backSpace;
	var player;
	var gameover;
	var bg;
	var stars;
	var bigs;
	var bullets;
	var obs;
	var playerRadius = 1;
	var redField;
	var bulletTime = 0;
	var fieldScale = (1 / 3.15625);
	var scaleDecTimer = 0;
	var GO = 0;
	var radius = 16;
	var obSpeed = -160;
    function quitGame() {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.
		music.stop();
		GO = 0;
		obSpeed = -160;
		playerRadius = 1;
		redField.scale.set(fieldScale* playerRadius);
		redField.anchor.setTo(0, 0);
        //  Then let's go back to the main menu.
        game.state.start('MainMenu');

    }
	
	//STAR DISPLAY
	function fire() {

    	var star = stars.getFirstExists(false);

    	if (star)
    	{
    	    star.frame = game.rnd.integerInRange(0,6);
    	    star.exists = true;
    	    star.reset(800, game.world.randomY);
			star.body.velocity.x = -200;
            star.body.allowGravity = 0;
    	    //star.body.bounce.y = 0.8;
    	}

	}

	//	Big Stars
	function fireBig() {

    	var big = bigs.getFirstExists(false);

    	if (big)
    	{
    	    big.frame = game.rnd.integerInRange(0,6);
    	    big.exists = true;
			big.scale.set(3);
    	    big.reset(800, game.world.randomY);
			game.physics.enable(big, Phaser.Physics.ARCADE);
			big.body.velocity.x = -100;
            big.body.allowGravity = 0;
    	    //star.body.bounce.y = 0.8;
    	}

	}

	//STAR COLLISION
	function checkBounds(star) {

    	if (star.x < 0)
    	{
        	star.kill();
    	}

	}

	//OBSTACLE SPAWNS
	function fireObs(){

		var ob = obs.getFirstExists(false);

    	if (ob)
    	{
    	    ob.frame = game.rnd.integerInRange(0,6);
    	    ob.exists = true;
			//ob.scale.set(3);
    	    ob.reset(800, game.world.randomY);
			//game.physics.enable(ob, Phaser.Physics.ARCADE);
			ob.body.velocity.x = obSpeed;
            ob.body.allowGravity = 0;
    	    //star.body.bounce.y = 0.8;
			obSpeed -= 2;
    	}
	}
	
	//FIRING A SHOT
	function fireBullet(){
		//  To avoid them being allowed to fire too fast we set a time limit
    	if (game.time.now > bulletTime)
    	{
        	//  Grab the first bullet we can from the pool
        	var bullet = bullets.getFirstExists(false);

        	if (bullet)
        	{
            	//  And fire it
            	bullet.reset(player.x, player.y);
            	bullet.body.velocity.x = 500;
				bullet.body.allowGravity = 0;
            	bulletTime = game.time.now + 200;
        	}
    	}
	}

	//BULLET-OBSTACLE COLLISION
	function collisionHandler(bullet, ob){
		bullet.kill();
		ob.kill();
	}

	//PLAYER RADIUS INCREASE
	function incRad(){
		if(playerRadius < 11 ){
			playerRadius += 0.1;
			redField.scale.set(fieldScale * playerRadius);
			redField.anchor.setTo(0, 0);
		}
	}

	//PLAYER RADIUS DECREASE
	function decRad(){
		if(playerRadius > 1){
			playerRadius -= 0.1;
			redField.scale.set(fieldScale* playerRadius);
			redField.anchor.setTo(0, 0);
		}
	}

	//SOPHISTICATED RADIUS COLLISION HANDLER
	function radHandler(field, ob){
		
		
		gameOverHandler(field, ob);
	}

	//GAME OVER
	function gameOverHandler(sprite, ob){
		player.kill();
		redField.kill();
		playerSpeed = 0;
		gameover.loadTexture('gameover');
		text.text=("GAME OVER");
		GO = 1;
	}

	
    return {
    
        create: function () {
    
            //I'm going to iterate on this a lot, so I'll need some good documentation!
			
			//ENABLE PHYSICS
			game.physics.startSystem(Phaser.Physics.ARCADE);
			game.physics.arcade.gravity.y = 500;
			playerSpeed = 300;

			//BACKGROUND
			bg = game.add.tileSprite(0, 0, 800, 600, 'bg');

			//	Background Stars
			stars = game.add.group();
			stars.createMultiple(250, 'star', 0, false);
			game.time.events.loop(150, fire, this);

			//	Big Stars
			bigs = game.add.group();
			bigs.createMultiple(200, 'star', 0, false);
			game.time.events.loop(2000, fireBig, this);

			//OBSTACLES
			obs = game.add.group();
			obs.createMultiple(100, 'redthing', 0, false);
			game.time.events.loop(500, fireObs, this);
			
			//PLAYER RADIUS
			redField = game.add.sprite(300, 300, 'field');
			game.physics.enable(redField, Phaser.Physics.ARCADE);
			redField.body.allowGravity = 0;
			redField.alpha = 0.5;
			redField.anchor.setTo(0,0);
			redField.scale.set(fieldScale);
			

			//PLAYER CONTROLS
			player = game.add.sprite(400, 200, 'player');
			game.physics.enable(player, Phaser.Physics.ARCADE);
			player.body.collideWorldBounds = true;
			player.body.allowGravity = 0;
			player.anchor.setTo(0, 0);

			//PLAYER SHOTS
			bullets = game.add.group();
    		bullets.enableBody = true;
    		bullets.physicsBodyType = Phaser.Physics.ARCADE;
    		bullets.createMultiple(30, 'fire');
    		bullets.setAll('outOfBoundsKill', true);
    		bullets.setAll('checkWorldBounds', true);

			//movePlatSpeed = 10;
			

			
			game.physics.arcade.enable(game.world, true);
			bg.body.allowGravity = 0;
			bg.body.immovable = true;
			redField.allowGravity = 0;
			redField.immovable = true;

	
			//MUSIC
			music = game.add.audio('gameMusic');
			music.play();
		  
			//GAME OVER SETTINGS
			gameover = game.add.sprite(0, 0, 'gamenotover');
			text = game.add.text(100,200,' ', { font: '84px Arial', fill: '#fff' });
			

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
			backSpace = game.input.keyboard.addKey(Phaser.Keyboard.BACKSPACE);
			spaceBar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

			
        },
    
        update: function () {
			//PLAYER MOVEMENT DEFAULTS
			player.body.velocity.x = 0;
			player.body.velocity.y = 0;
			
			//RADIUS UPDATE
			radius = redField.width / 2;
			
			//CONSTANT COLLISION
			game.physics.arcade.overlap(bullets,obs,collisionHandler);
			game.physics.arcade.overlap(player,obs, gameOverHandler);
			game.physics.arcade.overlap(redField,obs, radHandler);
			
			if(cursors.left.isDown || aKey.isDown){
				player.body.velocity.x = -(playerSpeed);
			}
			else if(cursors.right.isDown || dKey.isDown){
				player.body.velocity.x = (playerSpeed);
			}
			if(cursors.up.isDown || wKey.isDown){
				player.body.velocity.y = -(playerSpeed);
			}
			else if(cursors.down.isDown || sKey.isDown){
				player.body.velocity.y = (playerSpeed);
			}
			//  Firing?
        	if (spaceBar.isDown && !(GO))
        	{
        	    fireBullet();
				incRad();
        	}
			else if(scaleDecTimer < game.time.now && (!(GO)))
			{
				decRad();
				scaleDecTimer = game.time.now + 75;
			}
			
			stars.forEachAlive(checkBounds, this);
			bigs.forEachAlive(checkBounds, this);
			obs.forEachAlive(checkBounds, this);
            
			//QUIT GAME
			if(backSpace.isDown)
				quitGame();

        },
		
		preRender: function () {
			//FIELD
			redField.x = player.x - (redField.width / 2) + 16;
			redField.y = player.y - (redField.height / 2) + 16;


		},

		render: function () {
			//DEBUG
			game.debug.text('Press the backspace key to go back to the main menu.', 32, 32);
			//game.debug.text('Radius: ' + radius, 32, 64);
		}
    };
};
