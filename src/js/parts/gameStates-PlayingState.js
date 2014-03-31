var PlayingState = function() {
    var keyPress = function(e) {
        switch (e.keyCode) {
            case 49: // 1
                settings.colors = !settings.colors;
                break;
            case 117: // U
                settings.timeScale = 1;
                break;
            case 105: // I
                settings.timeScale = 0.50;
                break;
            case 111: // O
                settings.timeScale = 0.15;
                break;
            case 112: // P
                settings.timeScale = 0;
                break;
            case 114: // R
                world.reset(true);
                break;
            case 32: // SPACE
                world.releaseBalls();
                // prevent space from scrolling the page
                return false;
            default:
                // alert(e.keyCode);
                break;
        }
    };

    var render = function( /*delta*/ ) {
        g.save();

        // clear the previous frame
        g.fillStyle = '#000000';
        g.fillRect(0, 0, constants.canvasRelativeWidth, constants.canvasRelativeHeight);

        // render the game world
        world.render();

        g.restore();
    };

    var update = function(delta) {
        world.update(delta);
    };


    var constructor = function PlayingState() {
        this.render = render;
        this.update = update;
        this.keyPress = keyPress;
    };

    return constructor;
}();