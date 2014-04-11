var GameOverState = function() {

    ///////// public methods

    var render = function() {
        g.save();

        // clear the previous frame
        g.fillStyle = 'rgba(0, 0, 0, 1)';
        g.fillRect(0, 0, constants.canvasRelativeWidth, constants.canvasRelativeHeight);
        // render the game world
        world.render();

        g.lineWidth = 2;
        g.font = '30px emulogic';
        g.textAlign = 'center';
        g.textBaseline = 'middle';

        g.fillStyle = 'rgba(255, 255, 255, 1)';
        g.fillText('GAME OVER', constants.worldRelativeWidth / 2, constants.worldRelativeHeight / 2);
        g.strokeStyle = 'rgb(0, 0, 0)';
        g.strokeText('GAME OVER', constants.worldRelativeWidth / 2, constants.worldRelativeHeight / 2);

        g.restore();
    };

    var update = function( /*delta*/ ) {};

    var keyPress = function(e) {
        keyPressToggleSettings(e);

        switch (e.keyCode) {
            case keycodes['space']:
                states.intro = new IntroState();
                states.playing = new PlayingState();
                currState = states.intro;

                world = new World(new Vector2(constants.bordersRelativeThickness, constants.gameInfoRelativeHeight + constants.bordersRelativeThickness), new Vector2(constants.worldRelativeWidth, constants.worldRelativeHeight));
                return false;

            default:
                break;
        }
    };

    ///////// constructor

    var constructor = function GameOverState() {
        // public methods
        this.render = render;
        this.update = update;
        this.keyPress = keyPress;
    };

    return constructor;
}();