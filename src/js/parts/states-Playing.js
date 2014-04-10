var PlayingState = function() {

    ///////// public methods

    var render = function() {
        g.save();

        // clear the previous frame
        g.fillStyle = 'rgba(0, 0, 0, 1)';
        g.fillRect(0, 0, constants.canvasRelativeWidth, constants.canvasRelativeHeight);

        // render the game world
        world.render();

        g.restore();
    };

    var update = function(delta) {
        world.update(delta);
    };

    var keyPress = function(e) {
        keyPressToggleSettings(e);

        switch (e.keyCode) {
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

            case 110: // N
                world._currentLevel = (world._currentLevel + 1) % levels.length;
                world.reset(true);
                break;

            case 108: // L
                if (settings.particles) Particle.spawnVictoryFireworks(world.particles);
                break;

            case 32: // SPACE
                world.action();
                // prevent space from scrolling the page
                return false;

            default:
                break;
        }
    };

    ///////// constructor

    var constructor = function PlayingState() {
        // public methods
        this.render = render;
        this.update = update;
        this.keyPress = keyPress;
    };

    return constructor;
}();