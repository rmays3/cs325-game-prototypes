"use strict";
//https://phaser.io/examples/v2/basics/02-click-on-an-image
//https://phaser.io/examples/v2/animation/change-texture-on-click
//https://pxhere.com/en/photo/650272
//https://www.publicdomainpictures.net/view-image.php?image=211753&picture=office-computer
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
//https://phaser.io/examples/v2/arcade-physics/multiball
//https://phaser.io/examples/v2/time/basic-timed-event
GameStates.makeGame = function( game, shared ) {
    // Create your own variables.
    var bouncy = null;
	var music;
	var workOpened = 0;
	var score;
	var timer;
	var clearTimer;
	var warnTimer;
	var bossTimer;
	var warpTimer;
	var window = null;
	var snowfield;
	var health = 3;
	var button;
	var snowflakes;
	var bigSnowflakes;
	var text;
	var cursors;
	var wKey;
	var aKey;
	var sKey;
	var dKey;
	var iFrames = 0;
	var player;
	var playerSpeed;
	var gameover;
	var timePlay;
	var timeWarn;
	var timeCheck;
	var warnStart = 0;
	var checkStart = 0;
	var transTimer;
	var timeState = 0;
	var timeSays;
    
    function quitGame() {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //  Then let's go back to the main menu.
        game.state.start('MainMenu');

    }

	function collisionHandler(body, snow){
		snow.kill();
		health--;
		iFrames = 3000;
		
	}

	function bigCollisionHandler(body, snow){
		snow.kill();
		health = 0;
	}
    
	function listener() {
		//score++;
		if(workOpened == 0)
		{
			window.loadTexture('work',0);
			button.loadTexture('close',0);
			workOpened = 1;
		}
		else if(workOpened == 1)
		{
			window.loadTexture('nowork',0);
			button.loadTexture('open',0);
			workOpened = 0;
		}
		//text.text = "Yep";
	}

	function snowing(){
		var snowTemp = snowflakes.getFirstExists(false);

    	if (snowflakes)
    	{
        	snowTemp.frame = game.rnd.integerInRange(0,6);
       		snowTemp.exists = true;
        	snowTemp.reset(game.world.randomX, 0);

        	snowTemp.body.bounce.y = 0.8;
    	}
	}

	function snowBig(){
		var ball = bigSnowflakes.getFirstExists(false);

    	if (bigSnowflakes)
    	{
        	ball.frame = game.rnd.integerInRange(0,6);
       		ball.exists = true;
        	ball.reset(game.world.randomX, 0);

        	ball.body.bounce.y = 0.8;
    	}
	}

	function checkBounds(flake) {

    if (flake.y > 600)
    {
        flake.kill();
    }

	}

	function updateCounter(){
		button.x = (Math.random() * 768);
		button.y = (Math.random() * 568);
	}

	function updatePlay(){
		timeState++;
	}

	function updateWarn(){
	}

	function updateCheck(){
		//timeCheck = 12000;
	}

	function updateTrans(){
		if(warnStart == 0){
			warnStart = 1;
			warnTimer.start();
		}
		else if(checkStart == 0){
			checkStart = 1;
			bossTimer.start();
		}
	}

    return {
    
        create: function () {
    
            //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!

			music = game.add.audio('gameMusic');
			music.play();
			score = 0;
			timePlay = 1000;
			timeWarn = 5000;
			timeCheck = 2000;
			playerSpeed = 300;
			game.physics.startSystem(Phaser.Physics.ARCADE);
			snowfield = game.add.tileSprite(0, 0, 800, 600, 'snow');

			snowflakes = game.add.group();
			bigSnowflakes = game.add.group();

			player = game.add.sprite(400, 700, 'fire0');
			game.physics.enable(player, Phaser.Physics.ARCADE);
			player.body.bounce.set(0);
			player.body.collideWorldBounds = true;

			snowflakes.createMultiple(50, 'snowflake', 0, false);
			bigSnowflakes.createMultiple(50, 'bigsnow', 0, false);

			game.physics.arcade.gravity.y = 90;
			//game.physics.arcade.enable(game.world, true);
			game.physics.arcade.enable(snowflakes,true);
			game.physics.arcade.enable(bigSnowflakes,true);

			warpTimer = game.time.create(false);
			warpTimer.loop(20000, updateCounter, this);
			clearTimer = game.time.create(false);
			clearTimer.loop(timePlay, updatePlay, this);
			warnTimer = game.time.create(false);
			warnTimer.loop(timeWarn, updateWarn, this);
			bossTimer = game.time.create(false);
			bossTimer.loop(timeCheck, updateCheck, this);
			transTimer = game.time.create(false);
			transTimer.loop(5000, updateTrans, this);
   			
            // Create a sprite at the center of the screen using the 'logo' image.
            //bouncy = game.add.sprite( game.world.centerX, game.world.centerY, 'logo' );
            // Anchor the sprite at its center, as opposed to its top-left corner.
            // so it will be truly centered.
            //bouncy.anchor.setTo( 0.5, 0.5 );
            
            // Turn on the arcade physics engine for this sprite.
            //game.physics.enable( bouncy, Phaser.Physics.ARCADE );
            // Make it bounce off of the world bounds.
            //bouncy.body.collideWorldBounds = true;
            
			window = game.add.sprite(0,0,'nowork');
			timeSays = game.add.sprite(250, 0, 'time0');
			button = game.add.sprite(768,0,'open');
			button.inputEnabled = true;
			button.events.onInputDown.add(listener,this);
            // Add some text using a CSS style.
            // Center it in X, and position its top 15 pixels from the top of the world.
            //var style = { font: "25px Verdana", fill: "#9999ff", align: "center" };
            //text = game.add.text( game.world.centerX, 15, "Build something amazing.", style );
            //text.anchor.setTo( 0.5, 0.0 );
            
            // When you click on the sprite, you go back to the MainMenu.
            //bouncy.inputEnabled = true;
            //bouncy.events.onInputDown.add( function() { quitGame(); }, this );
			cursors = game.input.keyboard.createCursorKeys();
			wKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
			aKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
			dKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
			sKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
			
			game.time.events.loop(500, snowing, this);
			game.time.events.loop(10000, snowBig, this);
			

			gameover = game.add.sprite(0, 0, 'gamenotover');

			text = game.add.text(game.world.centerX,game.world.centerY,' ', { font: '84px Arial', fill: '#fff' });
    		text.anchor.setTo(0.5, 0.5);
    		text.visible = false;
			
			warpTimer.start();
			clearTimer.start();
        },
    
        update: function () {
    	player.body.velocity.setTo(0, 0);
            //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
            
            // Accelerate the 'logo' sprite towards the cursor,
            // accelerating at 500 pixels/second and moving no faster than 500 pixels/second
            // in X or Y.
            // This function returns the rotation angle that makes it visually match its
            // new trajectory.
            //bouncy.rotation = game.physics.arcade.accelerateToPointer( bouncy, game.input.activePointer, 500, 500, 500 );

		if(iFrames > 0){
			iFrames--;
		}
		if(health > 0){
			score++;
		}
		if(health == 2){
			player.loadTexture('fire1',0);
		}
		else if(health == 1){
			player.loadTexture('fire2',0);
		}
		else if(health == 0){
			player.loadTexture('fire3',0);
			playerSpeed = 0;
			gameover.loadTexture('gameover');
			text.text=(" GAME OVER \n SCORE: " + score);
        	text.visible = true;
		}
		

		if (cursors.left.isDown || aKey.isDown)
    		{
				//ship2.body.moveLeft(shipSpeed);
				player.body.velocity.x = -playerSpeed;
				//if(p2HasBall == 1){
					//ball2.fire();
					//p2HasBall = 0;
					//ball2.bulletSpeed -= 50;
				//}
    		}
    		else if (cursors.right.isDown || dKey.isDown)
    		{
				//ship2.body.moveRight(shipSpeed);
				player.body.velocity.x = playerSpeed;
    		}


		if(checkStart == 1 && workOpened == 0){
			health = 0;
		}

		if(timeState == 7){
			warnStart = 1;
			timeSays.loadTexture('time1',0);
		}
		else if(timeState == 10){
			warnStart = 0;
			checkStart = 1;
			timeSays.loadTexture('time2',0);
		}
		else if(timeState == 12){
			checkStart = 0;
			timeState = 0;
			timeSays.loadTexture('time0',0);
			game.physics.arcade.gravity.y += 10;
		}
		
		snowflakes.forEachAlive(checkBounds, this);
		bigSnowflakes.forEachAlive(checkBounds, this);
		game.physics.arcade.collide(snowflakes, player, collisionHandler);
		game.physics.arcade.collide(bigSnowflakes, player, bigCollisionHandler);
        },
		
		render: function () {
			//game.debug.text('Time until event: ' + clearTimer.duration.toFixed(0), 32, 32);
			game.debug.text('Score: ' + score, 32, 64);
		}
    };
};
