"use strict";
//Hamster image: https://www.publicdomainpictures.net/pictures/50000/nahled/hamster.jpg
//Seabed image: https://www.publicdomainpictures.net/pictures/140000/nahled/seabed-underwater-1443611158py8.jpg
//Hamster wheel image: http://www.publicdomainpictures.net/pictures/80000/velka/hamster-wheel.jpg
GameStates.makeGame = function( game, shared ) {
    // Create your own variables.
    var bouncy = null;
	var gameStillGoing = 1;
	var ship;
	var ship2;
	var enemy1;
	var enemy2;
	var enemy3;
	var bounds;
	var wKey;
	var aKey;
	var dKey;
	var sKey;
	var ball;
	var ball2;
	var balls;
	var bullets;
	var players;
	var players2;
	var b;
	var p1HasBall = 1;
	var p2HasBall = 0;
	var ballSpeed;
	var shipSpeed;
	var starfield;
	var currentSpeed = 0;
	var weapon;
	var weapon2;
	var cursors;
	var music = null;
	var score = 0;
	var scoreWords;
	var scoreDisplay;
	var stateText;
	var enemySpeed = 10;
	var timer;
	var turn = 1;
	var enemyIncreased = 0;

	function collisionHandler(ship, enemy){
		//ship2.kill();
		//ball.kill();
		ship.kill();
		//p1HasBall++;
		stateText.text=" GAME OVER \n F5 to restart";
        stateText.visible = true;
		gameStillGoing = 0;
	}

	function updateCounter(){
		if(p1HasBall == 1){
			weapon.fire();
			p1HasBall = 0;
			weapon.bulletSpeed += 50;
		}
		else if(p2HasBall == 1){
			ball2.fire();
			p2HasBall = 0;
			ball2.bulletSpeed -= 50;
		}
		turn++;
		if(turn <= 5){
			enemy1.body.velocity.x *= 1.8;
			enemy1.body.velocity.y *= 1.8;
			enemy2.body.velocity.x *= 1.8;
			enemy2.body.velocity.y *= 1.8;
			enemy3.body.velocity.x *= 1.8;
			enemy3.body.velocity.y *= 1.8;
		}
		else if(turn > 5){
			enemy1.body.velocity.x *= 1.05;
			enemy1.body.velocity.y *= 1.05;
			enemy2.body.velocity.x *= 1.05;
			enemy2.body.velocity.y *= 1.05;
			enemy3.body.velocity.x *= 1.05;
			enemy3.body.velocity.y *= 1.05;
		}
	}
	//p1 recieves
	function recieve1(weapon,sprite){
		//weapon.kill();
		sprite.kill();
		p1HasBall = 1;
	}
	//p2 recieves
	function recieve2(weapon,sprite){
		//weapon.kill();
		sprite.kill();
		p2HasBall = 1;
	}

	function caughtByFoe(weapon,foe){
		foe.kill();
		stateText.text=" GAME OVER \n F5 to restart";
        stateText.visible = true;
		gameStillGoing = 0;
	}
	//function collisionHandler2(ball,ship2){
		//ball.kill();
		//ship2.kill();
		//stateText.text=" GAME OVER \n Click to restart";
        //stateText.visible = true;
	//}
	
    function quitGame() {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //  Then let's go back to the main menu.
		music.stop();
        game.state.start('MainMenu');

    }
    
    return {
    
        create: function () {
			//Rules before we begin
			//p1HasBall = 1;
			//p2HasBall = 1;
			ballSpeed = 320;
			shipSpeed = 300;
			timer = game.time.create(false);
			timer.loop(3000, updateCounter, this);
    

			//Physics
			//https://phaser.io/examples/v2/arcade-physics/on-collide-event
			//https://phaser.io/examples/v2/games/invaders
   			//game.physics.startSystem(Phaser.Physics.P2JS);
			game.physics.startSystem(Phaser.Physics.ARCADE);

            //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
			//Scenery
			starfield = game.add.tileSprite(0, 0, 800, 600, 'stars');

			//Ball p1
			//I used this code: https://phaser.io/examples/v2/weapon/single-bullet
						
			//balls = game.add.group();
			//ball = game.add.weapon(1, 'ball');
			weapon = game.add.weapon(1, 'ball');
			weapon.physicsBodyType = Phaser.Physics.ARCADE;
			weapon.enableBody = true;
			weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
			weapon.bulletAngleOffset = 0;
			weapon.bulletSpeed = ballSpeed;
			//ball.enableBody = true;
			//ball.physicsBodyType = Phaser.Physics.ARCADE;
			//ball.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
			
			//ball.bulletAngleOffset = 0;
			//ball.bulletSpeed = ballSpeed;
			//balls.add(ball);

			//Ball p2
			//ball2 = game.add.group();
			ball2 = game.add.weapon(1, 'ball2');
			ball2.enableBody = true;
			ball2.physicsBodyType = Phaser.Physics.ARCADE;
			ball2.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;

			ball2.bulletAngleOffset = 0;
			ball2.bulletSpeed = -ballSpeed;
			//Music
            music = game.add.audio('testMusic');
			music.play();

			
			//var playerCollisionGroup = game.physics.p2.createCollisionGroup();
			//var ballCollisionGroup = game.physics.p2.createCollisionGroup();
			//var ball2CollisionGroup = game.physics.p2.createCollisionGroup();
			//game.physics.p2.updateBoundsCollisionGroup();
			
    		//game.physics.p2.restitution = 0.8;
			//Player 1
			players = game.add.group();
			players2 = game.add.group();
			bounds = game.add.sprite(400, 0, 'bounds');
    		ship = game.add.sprite(200, 200, 'ship');
    		ship.scale.set(2);
    		ship.smoothed = false;
    		ship.animations.add('fly', [0,1,2,3,4,5], 10, true);
    		ship.play('fly');
			//Player 2
			ship2 = game.add.sprite(600, 200, 'ship');
    		ship2.scale.set(2);
    		ship2.smoothed = false;
    		ship2.animations.add('fly', [0,1,2,3,4,5], 10, true);
    		ship2.play('fly');
			players.add(ship);
			players2.add(ship2);
			//Tracks p1 0, 0 offset from sprite
			//https://phaser.io/examples/v2/weapon/asteroids
			weapon.trackSprite(ship, 32, 32, true);
			//ball.trackSprite(ship, 32, 32, true);
			ball2.trackSprite(ship2, 32, 32, true);
			

			//Foes
			enemy1 = game.add.sprite(368, 100, 'catcher');
			enemy2 = game.add.sprite(368, 300, 'catcher');
			enemy3 = game.add.sprite(368, 500, 'catcher');


    		//  Create our physics body. A circle assigned the playerCollisionGroup
    		game.physics.enable(ship, Phaser.Physics.ARCADE);
			game.physics.enable(ship2, Phaser.Physics.ARCADE);
			game.physics.enable(bounds, Phaser.Physics.ARCADE);
			game.physics.enable(enemy1, Phaser.Physics.ARCADE);
			game.physics.enable(enemy2, Phaser.Physics.ARCADE);
			game.physics.enable(enemy3, Phaser.Physics.ARCADE);
			//game.physics.enable(ball, Phaser.Physics.ARCADE);
			//game.physics.enable(ball2, Phaser.Physics.ARCADE);
			//game.physics.p2.enable(ship2);
			//Fixed rotation: https://phaser.io/examples/v2/p2-physics/basic-movement
			ship.body.fixedRotation = true;
			ship2.body.fixedRotation = true;


			enemy1.body.velocity.setTo(enemySpeed, -enemySpeed);
    		enemy1.body.bounce.set(1);
			enemy1.body.collideWorldBounds = true;
			enemy2.body.velocity.setTo(-enemySpeed, enemySpeed);
    		enemy2.body.bounce.set(1);
			enemy2.body.collideWorldBounds = true;
			enemy3.body.velocity.setTo(enemySpeed, enemySpeed);
    		enemy3.body.bounce.set(1);
			enemy3.body.collideWorldBounds = true;
		
			
    		//  This boolean controls if the player should collide with the world bounds or not
    		ship.body.collideWorldBounds = true;
			ship2.body.collideWorldBounds = true;

			//ship.body.collides(ball2, hitBall, this);
			
			//Display
			scoreWords = 'Score : ';
			//scoreDisplay = game.add.text(500, 10, scoreWords + score, {font: '34px Arial', fill: '#fff' });
			stateText = game.add.text(game.world.centerX,game.world.centerY,' ', { font: '84px Arial', fill: '#fff' });
    		stateText.anchor.setTo(0.5, 0.5);
			//stateText.text=" GAME OVER \n Click to restart";
    		stateText.visible = false;

			//I used this for the controls!
			//https://phaser.io/examples/v2/input/keyboard-hotkeys
    		cursors = game.input.keyboard.createCursorKeys();
			wKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
			aKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
			dKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
			sKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
			//Functions and testing if they work
			timer.start();
        },

		
        update: function () {
    	//Useful: https://phaser.io/examples/v2/time/basic-timed-event
		//https://phaser.io/examples/v2/time/custom-timer
            //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
			//game.physics.arcade.collide(weapon, players2, killBullet);
            //game.physics.arcade.overlap(ship, ship2, collisionHandler, null, this);
			//game.physics.arcade.overlap(ball, ship2, collisionHandler2, null, this);
			//ship.body.setZeroVelocity();
			//ship2.body.setZeroVelocity();
			ship.body.velocity.setTo(0, 0);
			ship2.body.velocity.setTo(0, 0);
			
			//Player 1's controls
    		if (cursors.left.isDown)
    		{
				//ship2.body.moveLeft(shipSpeed);
				ship2.body.velocity.x = -shipSpeed;
				//if(p2HasBall == 1){
					//ball2.fire();
					//p2HasBall = 0;
					//ball2.bulletSpeed -= 50;
				//}
    		}
    		else if (cursors.right.isDown)
    		{
				//ship2.body.moveRight(shipSpeed);
				ship2.body.velocity.x = shipSpeed;
    		}

    		if (cursors.up.isDown)
    		{
    			//ship2.body.moveUp(shipSpeed);
				ship2.body.velocity.y = -shipSpeed;
    		}
    		else if (cursors.down.isDown)
    		{
        		//ship2.body.moveDown(shipSpeed);
				ship2.body.velocity.y = shipSpeed;
    		}

			//Player 2's controls
			if (aKey.isDown)
    		{
				//ship.body.moveLeft(shipSpeed);
				ship.body.velocity.x = -shipSpeed;
    		}
    		else if (dKey.isDown)
    		{
				//ship.body.moveRight(shipSpeed);
				ship.body.velocity.x = shipSpeed;
				//if(p1HasBall == 1){
					//ball.fire();
					//weapon.fire();
					//p1HasBall = 0;
					//ball.bulletSpeed += 10;
					//weapon.bulletSpeed += 50;
				//}
    		}

    		if (wKey.isDown)
    		{
    			//ship.body.moveUp(shipSpeed);
				ship.body.velocity.y = -shipSpeed;
    		}
    		else if (sKey.isDown)
    		{
        		//ship.body.moveDown(shipSpeed);
				ship.body.velocity.y = shipSpeed;
    		}
			game.physics.arcade.collide(weapon.bullets, ship2, recieve2);
			game.physics.arcade.collide(ball2.bullets, ship, recieve1);
            game.physics.arcade.overlap(ship, ship2, collisionHandler, null, this);
			game.physics.arcade.overlap(ship, bounds, collisionHandler, null, this);
			game.physics.arcade.overlap(ship2, bounds, collisionHandler, null, this);
			game.physics.arcade.collide(weapon.bullets, enemy1, caughtByFoe);
			game.physics.arcade.collide(ball2.bullets, enemy1, caughtByFoe);
			game.physics.arcade.collide(weapon.bullets, enemy2, caughtByFoe);
			game.physics.arcade.collide(ball2.bullets, enemy2, caughtByFoe);
			game.physics.arcade.collide(weapon.bullets, enemy3, caughtByFoe);
			game.physics.arcade.collide(ball2.bullets, enemy3, caughtByFoe);
			game.physics.arcade.overlap(ship, enemy1, collisionHandler, null, this);
			game.physics.arcade.overlap(ship2, enemy1, collisionHandler, null, this);
			game.physics.arcade.overlap(ship, enemy2, collisionHandler, null, this);
			game.physics.arcade.overlap(ship2, enemy2, collisionHandler, null, this);
			game.physics.arcade.overlap(ship, enemy3, collisionHandler, null, this);
			game.physics.arcade.overlap(ship2, enemy3, collisionHandler, null, this);
			if((p1HasBall == 0) && (p2HasBall == 0) && (gameStillGoing == 1)){
				score++;
			}
        },
		render: function () {

    		//weapon.debug();
			//ball2.debug();
			game.debug.text('Time until event: ' + timer.duration.toFixed(0), 32, 32);
    		game.debug.text('Turns: ' + turn, 32, 64);
			game.debug.text('Score: ' + score, 32, 96);
		}
    };
};
