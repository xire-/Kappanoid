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

        var lineHeightLogo = 15;
        var lineHeightText = 20;
        var logoTextDistance = 60;
        // calculate starting position
        var y = -((lineHeightLogo * this.selectedLogo.length + lineHeightText * this.text.length) + logoTextDistance) / 2;

        // draw previously randomly selected logo
        for (var i = 0; i < this.selectedLogo.length; i++) {
            g.fillText(this.selectedLogo[i], 0, y);
            y += lineHeightLogo;
        }

        // draw text
        y += logoTextDistance;
        for (var j = 0; j < this.text.length; j++) {
            g.fillText(this.text[j], 0, y);
            y += lineHeightText;
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
            [
                ' _  __                                   _     _ ',
                '| |/ /                                  (_)   | |',
                '| \' / __ _ _ __  _ __   __ _ _ __   ___  _  __| |',
                '|  < / _` | \'_ \\| \'_ \\ / _` | \'_ \\ / _ \\| |/ _` |',
                '| . \\ (_| | |_) | |_) | (_| | | | | (_) | | (_| |',
                '|_|\\_\\__,_| .__/| .__/ \\__,_|_| |_|\\___/|_|\\__,_|',
                '          | |   | |                              ',
                '          |_|   |_|                              '
            ],
            [
                '    __ __                                    _     __',
                '   / //_/___ _____  ____  ____ _____  ____  (_)___/ /',
                '  / ,< / __ `/ __ \\/ __ \\/ __ `/ __ \\/ __ \\/ / __  / ',
                ' / /| / /_/ / /_/ / /_/ / /_/ / / / / /_/ / / /_/ /  ',
                '/_/ |_\\__,_/ .___/ .___/\\__,_/_/ /_/\\____/_/\\__,_/   ',
                '          /_/   /_/                                  '
            ],
            [
                ' __ _   __   ____  ____   __   __ _   __  __  ____ ',
                '(  / ) / _\\ (  _ \\(  _ \\ / _\\ (  ( \\ /  \\(  )(    \\',
                ' )  ( /    \\ ) __/ ) __//    \\/    /(  O ))(  ) D (',
                '(__\\_)\\_/\\_/(__)  (__)  \\_/\\_/\\_)__) \\__/(__)(____/'
            ]
        ];
        this.selectedLogo = this.logos[Math.floor(Math.random() * this.logos.length)];
        this.text = [
            'Francesco Cagnin and Marco Gasparini',
            '© 2014'
        ];
        this.timePassed = 0;
        this.titleScale = 1;

        this.render = render;
        this.update = update;
        this.toString = toString;
    };

    return constructor;
}();