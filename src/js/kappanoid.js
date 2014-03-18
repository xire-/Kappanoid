/*
 * Kappanoid game
 * Authors: Francesco Cagnin, Marco Gasparini
 */

//trick to create a namespace
var kappanoid = (function () {
    "use strict";
    //private stuff
    function initCanvas(canvas) {
        console.log(canvas);
        canvas.width = 800;
        canvas.height = 600;
    }

    //public stuff
    return {
        version: '0.0',
        init: function () {
            initCanvas($('#gameCanvas')[0]);

            var color = $('#optColor');
            console.log(color);
        }
    };
}());

// function to execute once the document is ready
$(document).ready(function () {
    "use strict";
    kappanoid.init();
});