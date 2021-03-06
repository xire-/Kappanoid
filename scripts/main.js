/*
 * Kappanoid game
 * Authors: Francesco Cagnin, Marco Gasparini
 */

/*jslint browser: true, devel: true, multistr: true, sub: true */
/*global Howl*/

var kappanoid = (function() {
    'use strict';

    // graphic context, used by the rendering process
    var g;

    // timestamp of last game loop iteration (used to calculate delta time)
    var lastTime = 0;
    // frames since last FPS update
    var count = 0;
    // sum of all FPS since last update
    var totalFps = 0;
    // keep count of the current mean frame per second
    var currentFPS = 0;
    // millisecond spent in one iteration of the main loop
    var loopTime = 0;

    // states of the game
    var states;
    // current state of main
    var currState;

    // world game object
    var world;
    // object used to display game info
    var gameInfo;

    // mouse position relative to upper left corner of canvas(scaled to relative coordinate)
    var mousePos;

    // store all the configurable settings
    var settings = {
        timeScale: 1,

        colors: false,
        particles: false,
        sounds: null,
        music: null,
        ballTrail: false,
        lastBrickSlowMo: false,
        paddleSpeedDistortion: false,
        worldShake: false,

        debug: false,
    };
    var constants = {
        bordersRelativeThickness: 20,
        worldRelativeWidth: 800,
        worldRelativeHeight: 600,
        gameInfoRelativeWidth: 800 + 20 * 2,
        gameInfoRelativeHeight: 60,
        canvasRelativeWidth: 800 + 20 * 2,
        canvasRelativeHeight: 60 + 20 + 600,

        worldBackgroundColor: {
            r: 248,
            g: 242,
            b: 179,
        },
        gameInfoBackgroundColor: {
            r: 34,
            g: 34,
            b: 34,
        }
    };
    var sounds = {
        release: new Howl({
            urls: ['sounds/release.mp3']
        }),
        bounce: new Howl({
            urls: ['sounds/bounce.mp3']
        }),
        bounceMetal: new Howl({
            urls: ['sounds/bounce-metal.mp3']
        }),
        lazer: new Howl({
            urls: ['sounds/lazer.mp3']
        }),
        life: new Howl({
            urls: ['sounds/life.mp3']
        }),
        longship: new Howl({
            urls: ['sounds/longship.mp3']
        }),
        collect: new Howl({
            urls: ['sounds/collect.mp3']
        }),
        die: new Howl({
            urls: ['sounds/die.mp3']
        }),
        die2: new Howl({
            urls: ['sounds/die2.mp3']
        }),
    };
    var music = {
        introMusic: new Howl({
            urls: ['sounds/intro-music.mp3']
        }),
        levelStartMusic: new Howl({
            urls: ['sounds/level-start-music.mp3']
        }),
        gameOverMusic: new Howl({
            urls: ['sounds/game-over-music.mp3']
        }),
    };


    var init = function(width, height) {
        if (typeof testEffects !== 'undefined' && typeof testObjects !== 'undefined' && typeof testPhysics !== 'undefined') {
            testEffects();
            testObjects();
            testPhysics();
        }

        states = {
            preintro: new PreIntroState(),
            intro: new IntroState(),
            playing: new PlayingState(),
            gameover: new GameOverState(),
        };
        currState = states.preintro;

        localStorage.highscore = localStorage.highscore || 0;

        initCanvas(width, height);

        gameInfo = new GameInfo(new Vector2(0, 0), new Vector2(constants.gameInfoRelativeWidth, constants.gameInfoRelativeHeight));
        world = new World(new Vector2(constants.bordersRelativeThickness, constants.gameInfoRelativeHeight + constants.bordersRelativeThickness), new Vector2(constants.worldRelativeWidth, constants.worldRelativeHeight));

        mainLoop();
    };

    var initCanvas = function(width, height) {
        width = width || constants.canvasRelativeWidth;
        height = height || constants.canvasRelativeHeight;

        var canvas = document.getElementById('gameCanvas');
        var scaleFactor = Math.min(width / constants.canvasRelativeWidth, height / constants.canvasRelativeHeight);

        canvas.width = constants.canvasRelativeWidth * scaleFactor;
        canvas.height = constants.canvasRelativeHeight * scaleFactor;

        g = canvas.getContext('2d');
        if (scaleFactor !== 1) g.scale(scaleFactor, scaleFactor);

        mousePos = new Vector2(constants.bordersRelativeThickness + constants.worldRelativeWidth / 2, 0);
        // receive mouse movement update
        window.onmousemove = function(e) {
            var x;
            var y;
            if (e.pageX !== undefined && e.pageY !== undefined) {
                x = e.pageX;
                y = e.pageY;
            } else {
                x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
            }

            x -= canvas.offsetLeft;
            y -= canvas.offsetTop;

            mousePos.x = x / scaleFactor;
            mousePos.y = y / scaleFactor;
        };

        // receive keyboard update
        window.onkeypress = function(e) {
            var ret = currState.keyPress(e);
            if (ret !== undefined) {
                return ret;
            }
        };
    };


    var mainLoop = function(timestamp) {
        timestamp = (timestamp !== undefined) ? timestamp : lastTime;
        var elapsed = timestamp - lastTime;
        lastTime = timestamp;
        var startLoopTime = Date.now();

        // prevent super long delta when changing tabs
        if (elapsed > 34) {
            elapsed = 34;
        }

        // calculate fps
        totalFps += 1000 / elapsed;
        count += 1;
        if (count % 50 === 0) {
            currentFPS = totalFps / 50;
            totalFps = 0;
            count = 0;
        }

        currState.update(elapsed * settings.timeScale);

        currState.render();

        // render game info
        gameInfo.render(elapsed);

        loopTime = Date.now() - startLoopTime;

        window.requestAnimationFrame(mainLoop);
    };


    /////////////////////////////////// Utils
    // __import__ utils.js


    /////////////////////////////////// Game States
    // __import__ states.js


    /////////////////////////////////// Game Effects
    // __import__ effects.js


    /////////////////////////////////// Game Objects
    // __import__ objects.js


    /////////////////////////////////// Game Levels
    // __import__ levels.js


    /////////////////////////////////// Game Info
    // __import__ gameInfo.js


    /////////////////////////////////// Physics
    // __import__ physics.js


    return {
        version: '1.0',
        init: init,
        resize: initCanvas
    };
}());


window.onload = function() {
    'use strict';
    kappanoid.init();
};
