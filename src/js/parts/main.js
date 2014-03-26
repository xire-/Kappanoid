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
    var defaultWidth = 1140;
    var defaultHeight = 620;

    // keep count of the current mean frame per second
    var currentFPS = 0;

    // millisecond spent in one iteration of the main loop
    var loopTime = 0;

    // graphic context, used by the rendering process
    var g;

    // world game ogject
    var world;

    // object used to display game info
    var gameInfo;

    // mouse position relative to upper left corner of canvas(scaled to relative coordinate)
    var mousePos;

    // main loop handle
    var mainLoopHandle;

    // states of the game
    var states;

    // current state of main
    var currState;

    // store all the configurable settings
    var settings = {
        worldBackgroundColor: '#000',
        worldBorderBackgroundColor: '#fff',
        worldBorderThickness: 20,

        gameInfoBackgroundColor: '#222'
    };


    var init = function(width, height) {
        // TODO bind keys to actions
        // TODO generate settings interface

        // init states
        states = {
            intro: {
                update: updateIntro,
                render: renderIntro,
                timePassed: 0,
                titleScale: 1
            },
            playing: {
                update: updateGame,
                render: renderGame
            },
            ending: {
                update: updateGame,
                render: renderGame
            }
        };
        currState = states.intro;

        initCanvas(width, height);

        world = new World(new Vector2(settings.worldBorderThickness, settings.worldBorderThickness), new Vector2(800, 600));

        gameInfo = new GameInfo(new Vector2(800 + settings.worldBorderThickness * 2, 0), new Vector2(300, 600 + settings.worldBorderThickness));

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
                    currState.update(ministep);
                    steps -= 1;
                }

                currState.render(elapsed);

                loopTime = Date.now() - lastTime;
            },
            16
        );
    };

    var tmp = 0; //DELETE delete this shit
    var renderGame = function(delta) {
        g.save();

        // clear the previous frame (render world borders)
        g.fillStyle = settings.worldBorderBackgroundColor;
        g.fillRect(0, 0, defaultWidth, defaultHeight);

        // render the game world
        world.render();

        // render game info
        gameInfo.render(delta);

        // DELETE draw a box on current mouse position
        g.fillStyle = '#0ff';
        g.fillRect(mousePos.x - 3, mousePos.y - 3, 6, 6);

        // DELETE draw some animated boxes
        g.fillStyle = '#f0f';
        tmp += 1;
        g.fillRect(easing.easeOutBounce(tmp % 121, 140, -100, 120), 100, 6, 6);
        g.fillRect(easing.easeOutElastic(tmp % 121, 140, -100, 120), 110, 6, 6);

        g.restore();
    };

    var updateGame = function(delta) {
        // TODO update physics

        world.update(delta);
    };


    var renderIntro = function(delta) {
        g.save();

        // clear the previous frame
        g.fillStyle = '#000';
        g.fillRect(0, 0, defaultWidth, defaultHeight);

        g.save();
        g.translate(currState.titlePosX, currState.titlePosY);
        g.scale(currState.titleScale, currState.titleScale);

        g.fillStyle = '#fff';
        g.textAlign = 'center';
        g.textBaseline = 'middle';
        g.font = '60px Arial';
        g.fillText('Kappanoid', 0, 0);
        g.restore();

        // render game info
        gameInfo.render(delta);

        g.restore();
    };

    var updateIntro = function(delta) {
        currState.timePassed += delta;
        if (currState.timePassed < 1000) {
            currState.titlePosX = settings.worldBorderThickness + 400;
            currState.titlePosY = easing.easeOutBounce(currState.timePassed, 0, defaultHeight / 2, 1000);
        } else if (currState.timePassed < 2000) {
            currState.titlePosX = settings.worldBorderThickness + 400;
            currState.titlePosY = defaultHeight / 2;
        } else if (currState.timePassed < 3000) {
            currState.titleScale = easing.easeInBack(currState.timePassed - 2000, 1, -1, 1000);
        } else if (currState.timePassed < 3500) {
            currState.titleScale = 0;
        } else {
            currState = states.playing;
        }
    };

    var toString = function() {
        return JSON.stringify(settings);
    };

    /////////////////////////////////// Physics
    // __import__ physics.js


    /////////////////////////////////// Game Objects
    // __import__ gameObjects.js

    /////////////////////////////////// Game Info
    // __import__ gameInfo.js

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