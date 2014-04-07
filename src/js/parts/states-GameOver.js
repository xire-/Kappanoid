var GameOverState = function() {

    ///////// public methods

    var renderDestroyEverything = function() {
        g.save();

        // clear the previous frame
        g.fillStyle = '#000000';
        g.fillRect(0, 0, constants.canvasRelativeWidth, constants.canvasRelativeHeight);
        // render the game world
        world.render();

        g.lineWidth = 2;
        g.font = '30px emulogic';
        g.textAlign = 'center';
        g.textBaseline = 'middle';

        g.fillStyle = getColorString({
            r: 255,
            g: 255,
            b: 255,
        });
        g.fillText('GAME OVER', constants.worldRelativeWidth / 2, constants.worldRelativeHeight / 2);
        g.strokeStyle = getColorString({
            r: 0,
            g: 0,
            b: 0,
        });
        g.strokeText('GAME OVER', constants.worldRelativeWidth / 2, constants.worldRelativeHeight / 2);

        g.restore();
    };

    var updateDestroyEverything = function( /*delta*/ ) {
        ///world.update(delta);
    };

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

    ///////// constructor

    var constructor = function GameOverState() {
        // public methods
        this.render = renderDestroyEverything;
        this.update = updateDestroyEverything;
        this.keyPress = keyPress;
    };

    return constructor;
}();