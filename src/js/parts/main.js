/*
 * Kappanoid game
 * Authors: Francesco Cagnin, Marco Gasparini
 */

/*jslint browser: true, devel: true */
/*global $*/

var kappanoid = (function() {
    'use strict';
    // private stuff

    // default relative dimensions
    var defaultWidth = 880;
    var defaultHeight = 660;

    // keep count of the current mean frame per second
    var currentFPS = 0;

    // millisecond spent in one iteration of the main loop
    var loopTime = 0;

    // graphic context, used by the rendering process
    var g;

    // world game ogject
    var world;

    // mouse position relative to upper left corner of canvas(scaled to relative coordinate)
    var mousePos;

    // main loop handle
    var mainLoopHandle;

    // store all the configurable settings
    var settings = {
        canvasBackgroundColor: '#000'
    };


    var init = function(width, height) {
        // TODO bind keys to actions
        // TODO generate settings interface
        initCanvas(width, height);

        world = new World(new Vector2(40, 50), new Vector2(800, 600));

        startMainLoop();
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
    };

    var startMainLoop = function() {
        // timestamp of last game loop iteration (used to calculate delta time)
        var lastTime = Date.now();
        // frames since last FPS update
        var count = 0;
        // sum of all FPS since last update
        var totalFps = 0;

        //remove previous main loop if any
        if (mainLoopHandle !== undefined) {
            clearInterval(mainLoopHandle);
        }
        mainLoopHandle = setInterval(
            function() {
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
                    updateGame(ministep);
                    steps -= 1;
                }

                renderGame(elapsed);

                loopTime = Date.now() - lastTime;
            },
            16
        );
    };

    var tmp = 0; //DELETE delete this shit
    var renderGame = function(delta) {
        g.save();

        //clear the previous frame
        g.fillStyle = settings.canvasBackgroundColor;
        g.fillRect(0, 0, defaultWidth, defaultHeight);

        //render the game world
        world.render(g);

        //TODO render the GUI

        // DELETE draw a box on current mouse position
        g.fillStyle = '#0ff';
        g.fillRect(mousePos.x - 3, mousePos.y - 3, 6, 6);

        // DELETE draw some animated boxes
        g.fillStyle = '#f0f';
        tmp += 1;
        g.fillRect(easing.easeOutBounce(tmp % 121, 140, -100, 120), 100, 6, 6);
        g.fillRect(easing.easeOutElastic(tmp % 121, 140, -100, 120), 110, 6, 6);

        g.fillStyle = '#f00';
        g.textAlign = 'left';
        g.textBaseline = 'top';
        g.fillText('FPS: ' + currentFPS, 5, 5);
        g.fillText('DELTA: ' + delta, 5, 15);
        g.fillText('LOOP: ' + loopTime, 5, 25);

        g.restore();
    };

    var updateGame = function(delta) {
        // TODO update physics

        // update paddle position (clamped)
        world.paddle.center.x = Math.min(Math.max(mousePos.x, 0 + world.paddle.halfSize.x), 800 - world.paddle.halfSize.x);
    };

    var toString = function() {
        return JSON.stringify(settings);
    };

    /////////////////////////////////// Physics
    // __import__ physics.js


    /////////////////////////////////// Game Objects
    // __import__ gameObjects.js


    // public stuff
    return {
        version: '0.0',
        init: init,
        resize: initCanvas,
        toString: toString,
    };
}());

// function to execute once the document is ready
$(document).ready(function() {
    'use strict';
    kappanoid.init();
});