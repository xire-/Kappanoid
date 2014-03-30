/*
 * Kappanoid game
 * Authors: Francesco Cagnin, Marco Gasparini
 */

/*jslint browser: true, devel: true, multistr: true */
/*global $*/

var kappanoid = (function() {
    'use strict';

    // default relative dimensions
    var defaultWidth = 1140;
    var defaultHeight = 620;

    // graphic context, used by the rendering process
    var g;

    // timestamp of last game loop iteration (used to calculate delta time)
    var lastTime;
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
        worldBackgroundColor: '#000',
        worldBorderBackgroundColor: '#fff',
        worldBorderThickness: 20,

        gameInfoBackgroundColor: '#222',

        timeScale: 1,

        ballFaceDirection: true,

        // particles
        particles: true,

        // colors
        colors: false,
        backgroundDefaultColor: '#F8F2B3',
        bordersDefaultColor: '#88D1A3',
        ballDefaultColor: '#d26635',
        brickDefaultColor: '#62bd84',
        paddleDefaultColor: '#CF3746'
    };


    var init = function(width, height) {
        // TODO bind keys to actions
        // TODO generate settings interface
        states = {
            intro: new IntroState(),
            playing: new PlayingState()
        };

        currState = states.intro;

        initCanvas(width, height);

        world = new World(new Vector2(settings.worldBorderThickness, settings.worldBorderThickness), new Vector2(800, 600));

        gameInfo = new GameInfo(new Vector2(800 + settings.worldBorderThickness * 2, 0), new Vector2(300, 600 + settings.worldBorderThickness));

        lastTime = Date.now();
        mainLoop();
    };

    var initCanvas = function(width, height) {
        if (width === undefined || height === undefined) {
            width = defaultWidth;
            height = defaultHeight;
        }

        var canvas = $('#gameCanvas')[0];
        var scaleFactor = Math.min(width / defaultWidth, height / defaultHeight);

        canvas.width = defaultWidth * scaleFactor;
        canvas.height = defaultHeight * scaleFactor;

        g = canvas.getContext('2d');
        g.scale(scaleFactor, scaleFactor);

        mousePos = new Vector2(0, 0);
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

    var mainLoop = function( /*timestamp*/ ) {
        var currentTime = Date.now();
        var elapsed = currentTime - lastTime;
        lastTime = currentTime;

        // calculate fps
        totalFps += 1000 / elapsed;
        count += 1;
        if (count % 50 === 0) {
            currentFPS = totalFps / 50;
            totalFps = 0;
            count = 0;
        }

        var steps = 10;
        var ministep = elapsed / steps;

        while (steps > 0) {
            currState.update(ministep * settings.timeScale);
            steps -= 1;
        }

        currState.render(elapsed);

        // render game info
        gameInfo.render(elapsed);

        loopTime = Date.now() - lastTime;

        window.requestAnimationFrame(mainLoop);
    };

    /////////////////////////////////// Utils
    /*
     * clamp val to the interval [min, max]
     */
    var clamp = function(min, val, max) {
        return Math.min(Math.max(val, min), max);
    };

    /*
     * return a random number in the interval [min, max)
     * or [0, max) if only one value is given
     */
    var randomFloat = function(min, max) {
        if (max === undefined) {
            max = min;
            min = 0;
        }
        return Math.random() * (max - min) + min;
    };

    /*
     * return a random integer in the interval [min, max)
     * or [0, max) if only one value is given
     */
    var randomInt = function(min, max) {
        if (max === undefined) {
            max = min;
            min = 0;
        }
        return Math.floor(Math.random() * (max - min)) + min;
    };


    /////////////////////////////////// Game States
    // __import__ gameStates.js


    /////////////////////////////////// Physics
    // __import__ physics.js


    /////////////////////////////////// Game Objects
    // __import__ gameObjects.js


    /////////////////////////////////// Game Info
    // __import__ gameInfo.js


    return {
        version: '0.0',
        init: init,
        resize: initCanvas
    };
}());

$(document).ready(function() {
    'use strict';
    kappanoid.init();
});