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
    var settings, init, initCanvas;


    settings = {
        canvasWidth: 800,
        canvasHeight: 600,
        canvasBackgroundColor: '#babbe0'
    };


    init = function() {
        initCanvas($('#gameCanvas')[0]);

        var color = $('#optColor');
        console.log(color);
    };

    initCanvas = function(canvas) {
        console.log(canvas);
        canvas.width = settings.canvasWidth;
        canvas.height = settings.canvasHeight;
    };


    // __import__ physics.js

    // __import__ game_objects.js

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