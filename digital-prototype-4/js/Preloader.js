"use strict";

GameStates.makePreloader = function( game ) {

	var background = null;
	var preloadBar = null;

	var ready = false;

    return {
    
        preload: function () {
    
            //	These are the assets we loaded in Boot.js
            //	A nice sparkly background and a loading progress bar
            background = game.add.sprite(0, 0, 'preloaderBackground');
            preloadBar = game.add.sprite(300, 400, 'preloaderBar');
    
            //	This sets the preloadBar sprite as a loader sprite.
            //	What that does is automatically crop the sprite from 0 to full-width
            //	as the files below are loaded in.
            game.load.setPreloadSprite(preloadBar);
    
            //	Here we load the rest of the assets our game needs.
            //	As this is just a Project Template I've not provided these assets, swap them for your own.
            game.load.image('titlePage', 'assets/title.jpeg');
            game.load.atlas('playButton', 'assets/play_button.png', 'assets/play_button.json');
            game.load.audio('titleMusic', ['assets/discocat.mp3']);
			game.load.audio('gameMusic', ['assets/gardenparty.mp3']);
            //	+ lots of other required assets here
			game.load.image('open','assets/open.png');
			game.load.image('close','assets/close.png');
			game.load.image('snow','assets/snow.jpeg');
            game.load.image('work','assets/work.png');
			game.load.image('nowork','assets/nowork.png');
			game.load.image('snowflake','assets/snowflake.png');
			game.load.image('bigsnow','assets/bigsnowflake.png');
			game.load.image('fire0','assets/fire0.png');
			game.load.image('fire1','assets/fire1.png');
			game.load.image('fire2','assets/fire2.png');
			game.load.image('fire3','assets/fire3.png');
			game.load.image('time0','assets/time0.png');
			game.load.image('time1','assets/time1.png');
			game.load.image('time2','assets/time2.png');
			game.load.image('gamenotover','assets/gamenotover.png');
			game.load.image('gameover','assets/gameover.png');
        },
    
        create: function () {
    
            //	Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
            preloadBar.cropEnabled = false;
    
        },
    
        update: function () {
    
            //	You don't actually need to do this, but I find it gives a much smoother game experience.
            //	Basically it will wait for our audio file to be decoded before proceeding to the MainMenu.
            //	You can jump right into the menu if you want and still play the music, but you'll have a few
            //	seconds of delay while the mp3 decodes - so if you need your music to be in-sync with your menu
            //	it's best to wait for it to decode here first, then carry on.
            
            //	If you don't have any music in your game then put the game.state.start line into the create function and delete
            //	the update function completely.
            
            if (game.cache.isSoundDecoded('titleMusic') && ready == false)
            {
                ready = true;
                game.state.start('MainMenu');
            }
    
        }
    
    };
};
