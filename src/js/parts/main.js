/*
 * Kappanoid game
 * Authors: Francesco Cagnin, Marco Gasparini
 */

/*jslint browser: true, devel: true, multistr: true */
/*global $*/

var kappanoid = (function() {
    'use strict';

    // default relative dimensions
    var defaultWidth = 840;
    var defaultHeight = 680;

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
        worldBackgroundColor: '#000',
        worldBorderBackgroundColor: '#fff',
        worldBorderThickness: 20,

        gameInfoBackgroundColor: '#222',

        timeScale: 1,

        paddleSpeedDistortion: true,
        ballFaceDirection: true,

        // particles
        particles: true,

        // colors
        colors: true,
        backgroundDefaultColor: '#F8F2B3',
        bordersDefaultColor: '#88D1A3',
        ballDefaultColor: '#d26635',
        brickDefaultColor: '#62bd84',
        paddleDefaultColor: '#CF3746',
        particleDefaultColor: '#d26635'
    };


    var init = function(width, height) {
        if (typeof testPhysics !== 'undefined' && typeof testGameObjects !== 'undefined') {
            testPhysics();
            testGameObjects();
        }

        // TODO bind keys to actions
        // TODO generate settings interface
        states = {
            intro: new IntroState(),
            playing: new PlayingState()
        };

        currState = states.intro;

        initCanvas(width, height);

        initSettings();

        world = new World(new Vector2(settings.worldBorderThickness, 60 + settings.worldBorderThickness), new Vector2(800, 600));

        gameInfo = new GameInfo(new Vector2(0, 0), new Vector2(800 + settings.worldBorderThickness * 2, 60));

        mainLoop(0);
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

        mousePos = new Vector2(settings.worldBorderThickness + 400, 0);
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

    var initSettings = function() {
        var domColor = $('#colors');
        domColor.prop('checked', settings.colors);
        domColor.change(function() {
            settings.colors = $(this).prop('checked') === true;
        });
    };

    var mainLoop = function(timestamp) {
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

        var steps = 10;
        var ministep = elapsed / steps;

        while (steps > 0) {
            currState.update(ministep * settings.timeScale);
            steps -= 1;
        }

        currState.render(elapsed);

        // render game info
        gameInfo.render(elapsed);

        loopTime = Date.now() - startLoopTime;

        window.requestAnimationFrame(mainLoop);
    };


    /////////////////////////////////// Utils
    // __import__ utils.js


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