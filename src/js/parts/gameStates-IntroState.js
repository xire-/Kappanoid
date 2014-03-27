var IntroState = function() {
    var render = function(delta) {
        g.save();

        // clear the previous frame
        g.fillStyle = '#000';
        g.fillRect(0, 0, defaultWidth, defaultHeight);

        g.translate(currState.titlePosX, currState.titlePosY);
        g.scale(currState.titleScale, currState.titleScale);

        g.fillStyle = '#fff';
        g.textAlign = 'center';
        g.textBaseline = 'middle';
        g.font = '15px monospace';

        var lineHeight = 15;

        var logo = this.logos[1];
        var logoLines = logo.split('\n');
        var logoWidth = logoLines[1].length;

        var text = [
            'Francesco Cagnin and Marco Gasparini',
            '© 2014'
        ];

        var x = 0;
        var y = -(lineHeight * (logoLines.length + text.length) / 2);

        x = -logoWidth / 2;
        for (var i = 0; i < logoLines.length; i++) {
            g.fillText(logoLines[i], x, y);
            y += lineHeight;
        }

        lineHeight = 20;
        y += lineHeight;
        for (var j = 0; j < text.length; j++) {
            var lineWidth = text[j].length;
            x = -lineWidth / 2;
            g.fillText(text[j], 0, y);
            y += lineHeight;
        }

        g.restore();
    };

    var update = function(delta) {
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
        return JSON.stringify(this);
    };


    var constructor = function IntroState() {
        this.logos = [
            '\n\
             _  __                                   _     _ \n\
            | |/ /                                  (_)   | |\n\
            | \' / __ _ _ __  _ __   __ _ _ __   ___  _  __| |\n\
            |  < / _` | \'_ \\| \'_ \\ / _` | \'_ \\ / _ \\| |/ _` |\n\
            | . \\ (_| | |_) | |_) | (_| | | | | (_) | | (_| |\n\
            |_|\\_\\__,_| .__/| .__/ \\__,_|_| |_|\\___/|_|\\__,_|\n\
                      | |   | |                              \n\
                      |_|   |_|                              \n\
            ',
            '\n\
                __ __                                    _     __\n\
               / //_/___ _____  ____  ____ _____  ____  (_)___/ /\n\
              / ,< / __ `/ __ \\/ __ \\/ __ `/ __ \\/ __ \\/ / __  / \n\
             / /| / /_/ / /_/ / /_/ / /_/ / / / / /_/ / / /_/ /  \n\
            /_/ |_\\__,_/ .___/ .___/\\__,_/_/ /_/\\____/_/\\__,_/   \n\
                      /_/   /_/                                  \n\
            '
        ];
        this.timePassed = 0;
        this.titleScale = 1;

        this.render = render;
        this.update = update;
        this.toString = toString;
    };

    return constructor;
}();