var GameOverState = function() {
    var keyPress = function(e) {
        switch (e.keyCode) {
            case 32: // SPACE
                //world.releaseBalls();
                // prevent space from scrolling the page
                return false;
            default:
                // alert(e.keyCode);
                break;
        }
    };

    var renderDestroyEverything = function( /*delta*/ ) {
        g.save();

        // clear the previous frame
        g.fillStyle = '#000000';
        g.fillRect(0, 0, constants.canvasRelativeWidth, constants.canvasRelativeHeight);
        // render the game world
        world.render();

        g.fillStyle = '#FFFFFF';
        g.fillText('derp you deaded', 500, 600);

        g.restore();
    };

    var updateDestroyEverything = function(delta) {
        ///world.update(delta);
    };


    var constructor = function GameOverState() {
        this.render = renderDestroyEverything;
        this.update = updateDestroyEverything;
        this.keyPress = keyPress;
    };

    return constructor;
}();