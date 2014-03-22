/*
 * Kappanoid game
 * Authors: Francesco Cagnin, Marco Gasparini
 */

/*jslint browser: true, devel: true */
/*global $*/

// trick to create a namespace
var kappanoid = (function() {
    'use strict';
    // private stuff

    // keep count of the current mean frame per second
    var currentFPS = 0;

    // store all the configurable settings
    var settings = {
        canvasWidth: 800,
        canvasHeight: 600,
        canvasBackgroundColor: '#babbe0'
    };


    var init = function() {
        // TODO bind keys to actions
        // TODO generate settings interface
        initCanvas();

        startMainLoop();
    };

    var initCanvas = function() {
        var canvas = $('#gameCanvas')[0];

        canvas.width = settings.canvasWidth;
        canvas.height = settings.canvasHeight;
    };

    var startMainLoop = function() {
        // timestamp of last game loop iteration (used to calculate delta time)
        var lastTime = Date.now();
        // frames since last FPS update
        var count = 0;
        // sum of all FPS since last update
        var totalFps = 0;

        setInterval(
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
            },
            16
        );
    };

    var renderGame = function(delta) {
        //TODO render
    };

    var updateGame = function(delta) {
        // TODO update physics
    };

    /////////////////////////////////// Physics
    // __import__ physics.js


    /////////////////////////////////// Game Objects
    // __import__ gameObjects.js


    // public stuff
    return {
        version: '0.0',
        init: init
    };
}());

// function to execute once the document is ready
$(document).ready(function() {
    'use strict';
    kappanoid.init();
});