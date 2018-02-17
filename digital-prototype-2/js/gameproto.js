"use strict";

	//LIST SOURCES HERE:
//Loading sprites https://phaser.io/tutorials/making-your-first-phaser-game/part2
//Platform basics https://phaser.io/examples/v2/arcade-physics/platformer-basics
//Variable walking and jumping https://gamemechanicexplorer.com/#platformer-1
//Drag and NINJA physics: https://phaser.io/examples/v2/ninja-physics/ninja-tilemap

    // You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
    // You will need to change the fourth parameter to "new Phaser.Game()" from
    // 'phaser-example' to 'game', which is the id of the HTML element where we
    // want the game to go.
    // The assets (and code) can be found at: https://github.com/photonstorm/phaser/tree/master/examples/assets
    // You will need to change the paths you pass to "game.load.image()" or any other
    // loading functions to reflect where you are putting the assets.
    // All loading functions will typically all be found inside "preload()".
    
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.spritesheet('dude', 'assets/playerproto.png', 64, 64);
    game.load.image('background', 'assets/background2.png');

}

var player;
var facing = 'left';
var jumpTimer = 0;
var cursors;
//var jumpButton;
var bg;
var maxspeed;
var maxaccel;
var maxdrag;

function create() {
	//Movement constants
	maxspeed = 200; //pixels per second
	maxaccel = 500;// pixles per second^2
	maxdrag = 200; //pixels per second
	
    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.time.desiredFps = 60;

    bg = game.add.tileSprite(0, 0, 800, 600, 'background');

    game.physics.arcade.gravity.y = 900;

    player = game.add.sprite(64, 64, 'dude');
    game.physics.enable(player, Phaser.Physics.ARCADE);
	//Define all of the player's traits
    player.body.bounce.y = 0.0;
    player.body.collideWorldBounds = true;
    player.body.setSize(64, 64, 0, 0);
	player.body.maxVelocity.setTo(maxspeed, 500);
	player.body.drag.setTo(maxdrag, 0);

    //player.animations.add('left', [0, 1, 2, 3], 10, true);
    //player.animations.add('turn', [4], 20, true);
    //player.animations.add('right', [5, 6, 7, 8], 10, true);

    cursors = game.input.keyboard.createCursorKeys();
    //jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

}

function update() {

    // game.physics.arcade.collide(player, layer);

    //player.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        //player.body.velocity.x = -150;
		player.body.acceleration.x = -maxaccel;
        if (facing != 'left')
        {
            //player.animations.play('left');
            facing = 'left';
        }
    }
    else if (cursors.right.isDown)
    {
        //player.body.velocity.x = 150;
		player.body.acceleration.x = maxaccel;
        if (facing != 'right')
        {
            //player.animations.play('right');
            facing = 'right';
        }
    }
    else
    {
        if (facing != 'idle')
        {
            //player.animations.stop();

            if (facing == 'left')
            {
                //player.frame = 0;
            }
            else
            {
                //player.frame = 5;
            }

            facing = 'idle';
        }
    }
    
    if (cursors.up.isDown && player.body.onFloor() && game.time.now > jumpTimer)
    {
        player.body.velocity.y = -600;
        jumpTimer = game.time.now + 750;
    }

}

function render () {

    game.debug.text(game.time.suggestedFps, 32, 32);

    // game.debug.text(game.time.physicsElapsed, 32, 32);
    // game.debug.body(player);
    // game.debug.bodyInfo(player, 16, 24);

}

