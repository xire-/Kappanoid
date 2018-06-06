var PreIntroState = function() {

    ///////// public methods

    var render = function() {
        g.save();

        g.font = '30px emulogic';
        g.textAlign = 'center';
        g.textBaseline = 'middle';
        g.lineWidth = 2;

        g.fillStyle = 'rgba(255, 255, 255, 1)';
        g.fillText('ENABLE SOUNDS? Y/N', constants.worldRelativeWidth / 2, constants.worldRelativeHeight / 2);

        g.restore();
    };

    var update = function(delta) {
    };

    var keyPress = function(e) {
        var code = e.keyCode || e.charCode;
        switch (code) {
            case keycodes['n']:
                settings.sounds = false;
                settings.music = false;
                currState = states.intro;
                break;

            case keycodes['y']:
                settings.sounds = true;
                settings.music = true;
                music.introMusic.play();
                currState = states.intro;
                break;

            default:
                break;
        }
    };

    ///////// constructor

    var constructor = function PreIntroState() {
        // public methods
        this.render = render;
        this.update = update;
        this.keyPress = keyPress;
    };

    return constructor;
}();