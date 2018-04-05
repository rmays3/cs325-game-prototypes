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
            game.load.audio('titleMusic', 'assets/trgbanks.mp3');
			game.load.audio('gameMusic', 'assets/softandfurious.mp3');
			game.load.image('gamenotover','assets/gamenotover.png');
			game.load.image('gameover','assets/gameover.png');
			game.load.image('protagr','assets/protagRIGHT.png');
			game.load.image('protagur','assets/protagUPRIGHT.png');
			game.load.image('protagu','assets/protagUP.png');
			game.load.image('protagul','assets/protagUPLEFT.png');
			game.load.image('protagl','assets/protagLEFT.png');
			game.load.image('protagdl','assets/protagDOWNLEFT.png');
			game.load.image('protagd','assets/protagDOWN.png');
			game.load.image('protagdr','assets/protagDOWNRIGHT.png');
			game.load.image('protagfaint','assets/protagFAINT.png');
			game.load.image('sight','assets/sight.png');
			game.load.image('bg','assets/bg.png');
			game.load.tilemap('level1', 'assets/level.json', null, Phaser.Tilemap.TILED_JSON);
			game.load.image('tile','assets/tile.png');
			game.load.image('booltileF','assets/booltileNO.png');
			game.load.image('booltileT','assets/booltileYES.png');
			game.load.image('platT','assets/platYES.png');
			game.load.image('platF','assets/platNO.png');
			game.load.image('youwin','assets/youwin.png');
			game.load.image('coin','assets/coin.png');
			game.load.image('spikeT','assets/boolspikeYES.png');
			game.load.image('spikeF','assets/boolspikeNO.png');
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
