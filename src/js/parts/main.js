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

    // millisecond spent in one iteration of the main loop
    var loopTime = 0;

    // graphic context, used by the rendering process
    var g;
    
    // world game ogject
    var world;

    // store all the configurable settings
    var settings = {
        canvasWidth: 800,
        canvasHeight: 600,
        canvasBackgroundColor: '#000'
    };


    var init = function() {
        // TODO bind keys to actions
        // TODO generate settings interface
        initCanvas();
        
        world = new World(new Vector2(40, 30), new Vector2(720, 540));
        
        startMainLoop();
    };

    var initCanvas = function() {
        var canvas = $('#gameCanvas')[0];
        var scaleFactor = Math.min(settings.canvasWidth / 800, settings.canvasHeight / 600);

        settings.canvasWidth = 800 * scaleFactor;
        settings.canvasHeight = 600 * scaleFactor;

        canvas.width = settings.canvasWidth;
        canvas.height = settings.canvasHeight;

        g = canvas.getContext('2d');
        g.scale(scaleFactor, scaleFactor);
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

                loopTime = Date.now() - lastTime;
            },
            16
        );
    };

    var renderGame = function(delta) {
        g.save();

        //clear the previous frame
        g.fillStyle = settings.canvasBackgroundColor;
        g.fillRect(0, 0, 800, 600);   

        //render the game world
        world.render(g);

        //TODO render the GUI
        
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
        toString: toString
    };
}());

// function to execute once the document is ready
$(document).ready(function() {
    'use strict';
    kappanoid.init();
});