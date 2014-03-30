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
        colors: false,
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

        world = new World(new Vector2(settings.worldBorderThickness, settings.worldBorderThickness), new Vector2(800, 600));

        gameInfo = new GameInfo(new Vector2(800 + settings.worldBorderThickness * 2, 0), new Vector2(300, 600 + settings.worldBorderThickness));

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

    var mainLoop = function(timestamp) {
        var elapsed = timestamp - lastTime;
        lastTime = timestamp;
        loopTime = Date.now();

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

        loopTime = Date.now() - loopTime;

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

    /*
     * given an object with rgb or hsl properties, returns the corresponding string
     * an optional alpha value can be added to the object, with name 'a'
     */
    var getColorString = function(color) {
        console.assert(color !== undefined, 'color is undefined');

        var a = (color.a !== undefined) ? clamp(0, color.a, 1) : 1;

        if (color.r !== undefined) {
            //it's rgb or rgba
            var r = clamp(0, Math.floor(color.r), 255);
            var g = clamp(0, Math.floor(color.g), 255);
            var b = clamp(0, Math.floor(color.b), 255);

            return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
        }
        if (color.h !== undefined) {
            //it's hsl or hsla
            var h = color.h % 360;
            var s = clamp(0, color.s, 100);
            var l = clamp(0, color.l, 100);

            return 'hsla(' + h + ', ' + s + '%, ' + l + '%, ' + a + ')';
        }
    };

    /*
     * lighten or darken a hex color by a specific percentage
     */
    var shadeColor = function(color, percent) {
        var R = parseInt(color.substring(1, 3), 16);
        var G = parseInt(color.substring(3, 5), 16);
        var B = parseInt(color.substring(5, 7), 16);

        R = parseInt(R * (100 + percent) / 100);
        G = parseInt(G * (100 + percent) / 100);
        B = parseInt(B * (100 + percent) / 100);

        R = (R < 255) ? R : 255;
        G = (G < 255) ? G : 255;
        B = (B < 255) ? B : 255;

        var RR = ((R.toString(16).length == 1) ? '0' + R.toString(16) : R.toString(16));
        var GG = ((G.toString(16).length == 1) ? '0' + G.toString(16) : G.toString(16));
        var BB = ((B.toString(16).length == 1) ? '0' + B.toString(16) : B.toString(16));
        return '#' + RR + GG + BB;
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