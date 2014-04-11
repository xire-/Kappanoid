var PlayingState = function() {

    ///////// public methods

    var render = function() {
        g.save();

        // clear the previous frame
        g.fillStyle = 'rgba(0, 0, 0, 1)';
        g.fillRect(0, 0, constants.canvasRelativeWidth, constants.canvasRelativeHeight);

        world.render();

        g.restore();
    };

    var update = function(delta) {
        world.update(delta);
    };

    var keyPress = function(e) {
        // manage input for common keys
        keyPressToggleSettings(e);

        switch (e.keyCode) {
            case keycodes['space']:
                // do the current binded action
                world.action();
                // prevent space from scrolling the page
                return false;

            case keycodes['u']:
                if (settings.debug) settings.timeScale = 1;
                break;
            case keycodes['i']:
                if (settings.debug) settings.timeScale = 0.50;
                break;
            case keycodes['o']:
                if (settings.debug) settings.timeScale = 0.15;
                break;
            case keycodes['p']:
                settings.timeScale = 0;
                break;

            case keycodes['r']:
                if (settings.debug) world.reset(true);
                break;

            case keycodes['n']:
                if (settings.debug) {
                    world._currentLevel = (world._currentLevel + 1) % levels.length;
                    world.reset(true);
                }
                break;

            case keycodes['l']:
                if (settings.debug) Particle.spawnVictoryFireworks(world.particles);
                break;

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