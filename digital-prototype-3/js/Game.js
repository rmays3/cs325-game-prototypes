"use strict";
z
GameStates.makeGame = function( game, shared ) {
    // Create your own variables.
    var bouncy = null;
	var ship;
var starfield;
var cursors;
    
    function quitGame() {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //  Then let's go back to the main menu.
        game.state.start('MainMenu');

    }
    
    return {
    
        create: function () {
    
            //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
            
            starfield = game.add.tileSprite(0, 0, 800, 600, 'stars');

    game.physics.startSystem(Phaser.Physics.P2JS);

    game.physics.p2.restitution = 0.8;

    ship = game.add.sprite(200, 200, 'ship');
    ship.scale.set(2);
    ship.smoothed = false;
    ship.animations.add('fly', [0,1,2,3,4,5], 10, true);
    ship.play('fly');

    //  Create our physics body. A circle assigned the playerCollisionGroup
    game.physics.p2.enable(ship);

    ship.body.setCircle(28);

    //  This boolean controls if the player should collide with the world bounds or not
    ship.body.collideWorldBounds = true;

    cursors = game.input.keyboard.createCursorKeys();
        },
    
        update: function () {
    
            //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
            
           ship.body.setZeroVelocity();

    if (cursors.left.isDown)
    {
		ship.body.moveLeft(200);
    }
    else if (cursors.right.isDown)
    {
		ship.body.moveRight(200);
    }

    if (cursors.up.isDown)
    {
    	ship.body.moveUp(200);
    }
    else if (cursors.down.isDown)
    {
        ship.body.moveDown(200);
    }
        }
    };
};
