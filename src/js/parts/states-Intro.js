var IntroState = function() {

    ///////// public methods

    var render = function() {
        g.save();

        // clear the previous frame
        g.fillStyle = '#000000';
        g.fillRect(0, 0, constants.canvasRelativeWidth, constants.canvasRelativeHeight);

        if (this._intro) {
            // falling animation
            var titlePosX = constants.bordersRelativeThickness + constants.worldRelativeWidth / 2;
            var titlePosY = easing.easeOutBounce(clamp(0, this._timePassed, 1000), 0, constants.canvasRelativeHeight / 2, 1000);
            g.translate(titlePosX, titlePosY);
        } else {
            // rotating/shrinking animation
            var titleScale = easing.easeInBack(clamp(0, this._timePassed, 1000), 1, -1, 1000);
            var titleRotation = easing.easeInBack(clamp(0, this._timePassed, 1000), 0, Math.PI * 2, 1000);
            g.translate(constants.bordersRelativeThickness + constants.worldRelativeWidth / 2, constants.canvasRelativeHeight / 2);
            g.scale(titleScale, titleScale);
            g.rotate(titleRotation);
        }

        var logoLineHeight = 15;
        var insertCoinLineHeight = 20;
        var creditsLineHeight = 20;
        var logoToInsertCoinDistance = 60;
        var insertCoinToCreditsDistance = 220;

        // calculate starting position
        var y = -((logoLineHeight * this._selectedLogo.length + insertCoinLineHeight + creditsLineHeight * 2) + logoToInsertCoinDistance + insertCoinToCreditsDistance) / 2;

        // draw previously randomly selected logo
        g.textAlign = 'center';
        g.textBaseline = 'middle';
        g.font = '15px monospace';
        g.fillStyle = '#FFFFFF';
        for (var i = 0; i < this._selectedLogo.length; i++) {
            g.fillText(this._selectedLogo[i], 0, y);
            y += logoLineHeight;
        }

        // draw insert coin to continue
        y += logoToInsertCoinDistance;
        if (this._timePassed % 2000 < 1500) {
            g.font = '10px emulogic';
            g.fillStyle = '#FFFFFF';
            g.fillText('INSERT COIN TO CONTINUE', 0, y);
        }
        y += insertCoinLineHeight;

        // draw credits
        y += insertCoinToCreditsDistance;
        y = drawCredits(this._timePassed, creditsLineHeight, y);

        g.restore();
    };

    var update = function(delta) {
        this._timePassed += delta;

        if (!this._intro) {
            if (this._timePassed > 1000) {
                currState = states.playing;
            }
        }
    };

    var keyPress = function(e) {
        keyPressToggleSettings(e);

        switch (e.keyCode) {
            case 32: // SPACE
                if (this._intro) {
                    this._intro = false;
                    this._timePassed = 0;

                    // if the intro music is still playing, fade it out
                    if (settings.music) music.introMusic.fadeOut(0, 1500);
                }
                // prevent space from scrolling the page
                return false;

            default:
                break;
        }
    };

    ///////// private methods

    var drawCredits = function(timePassed, lineHeight, y) {
        var offset = (timePassed / 3) % 500;
        var gradient = g.createLinearGradient(-offset, 0, 1000 - offset, 0);
        gradient.addColorStop(0 / 12, '#f00');
        gradient.addColorStop(1 / 12, '#ff0');
        gradient.addColorStop(2 / 12, '#0f0');
        gradient.addColorStop(3 / 12, '#0ff');
        gradient.addColorStop(4 / 12, '#00f');
        gradient.addColorStop(5 / 12, '#f0f');
        gradient.addColorStop(6 / 12, '#f00');
        gradient.addColorStop(7 / 12, '#ff0');
        gradient.addColorStop(8 / 12, '#0f0');
        gradient.addColorStop(9 / 12, '#0ff');
        gradient.addColorStop(10 / 12, '#00f');
        gradient.addColorStop(11 / 12, '#f0f');
        gradient.addColorStop(12 / 12, '#f00');

        g.font = '15px monospace';
        g.fillStyle = gradient;
        g.fillText('Francesco Cagnin and Marco Gasparini', 0, y);
        y += lineHeight;
        g.fillText('© 2014', 0, y);
        y += lineHeight;

        return y;
    };

    ///////// constructor

    var constructor = function IntroState() {
        // public methods
        this.render = render;
        this.update = update;
        this.keyPress = keyPress;

        // init
        this._intro = true;
        this._timePassed = 0;
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
            ],
            [
                ' __  _   ____  ____  ____   ____  ____    ___  ____  ___   ',
                '|  |/ ] /    ||    \\|    \\ /    ||    \\  /   \\|    ||   \\  ',
                '|  \' / |  o  ||  o  )  o  )  o  ||  _  ||     ||  | |    \\ ',
                '|    \\ |     ||   _/|   _/|     ||  |  ||  O  ||  | |  D  |',
                '|     ||  _  ||  |  |  |  |  _  ||  |  ||     ||  | |     |',
                '|  .  ||  |  ||  |  |  |  |  |  ||  |  ||     ||  | |     |',
                '|__|\\_||__|__||__|  |__|  |__|__||__|__| \\___/|____||_____|'
            ],
            [
                '.-. .-.  .--.  .----. .----.  .--.  .-. .-. .----. .-..----. ',
                '| |/ /  / {} \\ | {}  }| {}  }/ {} \\ |  `| |/  {}  \\| || {}  \\',
                '| |\\ \\ /  /\\  \\| .--\' | .--\'/  /\\  \\| |\\  |\\      /| ||     /',
                '`-\' `-\'`-\'  `-\'`-\'    `-\'   `-\'  `-\'`-\' `-\' `----\' `-\'`----\' '
            ],
            [
                ' ___   _  _______  _______  _______  _______  __    _  _______  ___   ______  ',
                '|   | | ||   _   ||       ||       ||   _   ||  |  | ||       ||   | |      | ',
                '|   |_| ||  |_|  ||    _  ||    _  ||  |_|  ||   |_| ||   _   ||   | |  _    |',
                '|      _||       ||   |_| ||   |_| ||       ||       ||  | |  ||   | | | |   |',
                '|     |_ |       ||    ___||    ___||       ||  _    ||  |_|  ||   | | |_|   |',
                '|    _  ||   _   ||   |    |   |    |   _   || | |   ||       ||   | |       |',
                '|___| |_||__| |__||___|    |___|    |__| |__||_|  |__||_______||___| |______| '
            ],
            [
                ',--. ,--.                                             ,--.   ,--.',
                '|  .\'   / ,--,--. ,---.  ,---.  ,--,--.,--,--,  ,---. `--\' ,-|  |',
                '|  .   \' \' ,-.  || .-. || .-. |\' ,-.  ||      \\| .-. |,--.\' .-. |',
                '|  |\\   \\\\ \'-\'  || \'-\' \'| \'-\' \'\\ \'-\'  ||  ||  |\' \'-\' \'|  |\\ `-\' |',
                '`--\' \'--\' `--`--\'|  |-\' |  |-\'  `--`--\'`--\'\'--\' `---\' `--\' `---\' ',
                '                 `--\'   `--\'                                      '
            ],
            [
                ' __  __     ______     ______   ______   ______     __   __     ______     __     _____   ',
                '/\\ \\/ /    /\\  __ \\   /\\  == \\ /\\  == \\ /\\  __ \\   /\\ "-.\\ \\   /\\  __ \\   /\\ \\   /\\  __-. ',
                '\\ \\  _"-.  \\ \\  __ \\  \\ \\  _-/ \\ \\  _-/ \\ \\  __ \\  \\ \\ \\-.  \\  \\ \\ \\/\\ \\  \\ \\ \\  \\ \\ \\/\\ \\',
                ' \\ \\_\\ \\_\\  \\ \\_\\ \\_\\  \\ \\_\\    \\ \\_\\    \\ \\_\\ \\_\\  \\ \\_\\\\"\\_\\  \\ \\_____\\  \\ \\_\\  \\ \\____-',
                '  \\/_/\\/_/   \\/_/\\/_/   \\/_/     \\/_/     \\/_/\\/_/   \\/_/ \\/_/   \\/_____/   \\/_/   \\/____/'
            ],
            [
                '  _  __            _ __    _ __                             _        _  ',
                ' | |/ /   __ _    | \'_ \\  | \'_ \\  __ _    _ _      ___     (_)    __| | ',
                ' | \' <   / _` |   | .__/  | .__/ / _` |  | \' \\    / _ \\    | |   / _` | ',
                ' |_|\\_\\  \\__,_|   |_|__   |_|__  \\__,_|  |_||_|   \\___/   _|_|_  \\__,_| ',
                '_|"""""|_|"""""|_|"""""|_|"""""|_|"""""|_|"""""|_|"""""|_|"""""|_|"""""|',
                '"`-0-0-\'"`-0-0-\'"`-0-0-\'"`-0-0-\'"`-0-0-\'"`-0-0-\'"`-0-0-\'"`-0-0-\'"`-0-0-\''
            ],
            [
                ' __  __                                       __     __ ',
                '|  |/  |.---.-.-----.-----.---.-.-----.-----.|__|.--|  |',
                '|     < |  _  |  _  |  _  |  _  |     |  _  ||  ||  _  |',
                '|__|\\__||___._|   __|   __|___._|__|__|_____||__||_____|',
                '              |__|  |__|                                '
            ],
            [
                '   __   __)                            ',
                '  (, ) /                         ,   /)',
                '    /(   _  __  __   _  __   ___   _(/ ',
                ' ) /  \\_(_(_/_)_/_)_(_(_/ (_(_)_(_(_(_ ',
                '(_/      .-/ .-/                       ',
                '        (_/ (_/                        '
            ],
            [
                '    _/    _/                                                              _/        _/',
                '   _/  _/      _/_/_/  _/_/_/    _/_/_/      _/_/_/  _/_/_/      _/_/          _/_/_/ ',
                '  _/_/      _/    _/  _/    _/  _/    _/  _/    _/  _/    _/  _/    _/  _/  _/    _/  ',
                ' _/  _/    _/    _/  _/    _/  _/    _/  _/    _/  _/    _/  _/    _/  _/  _/    _/   ',
                '_/    _/    _/_/_/  _/_/_/    _/_/_/      _/_/_/  _/    _/    _/_/    _/    _/_/_/    ',
                '                   _/        _/                                                       ',
                '                  _/        _/                                                        '
            ],
            [
                'oooo    oooo                                                                  o8o        .o8 ',
                '`888   .8P\'                                                                   `"\'       "888 ',
                ' 888  d8\'     .oooo.   oo.ooooo.  oo.ooooo.   .oooo.   ooo. .oo.    .ooooo.  oooo   .oooo888 ',
                ' 88888[      `P  )88b   888\' `88b  888\' `88b `P  )88b  `888P"Y88b  d88\' `88b `888  d88\' `888 ',
                ' 888`88b.     .oP"888   888   888  888   888  .oP"888   888   888  888   888  888  888   888 ',
                ' 888  `88b.  d8(  888   888   888  888   888 d8(  888   888   888  888   888  888  888   888 ',
                'o888o  o888o `Y888""8o  888bod8P\'  888bod8P\' `Y888""8o o888o o888o `Y8bod8P\' o888o `Y8bod88P"',
                '                        888        888                                                       ',
                '                       o888o      o888o                                                      '
            ],
            [
                '______ __                                          ______________',
                '___  //_/_____ ______________________ ________________(_)_____  /',
                '__  ,<  _  __ `/__  __ \\__  __ \\  __ `/_  __ \\  __ \\_  /_  __  / ',
                '_  /| | / /_/ /__  /_/ /_  /_/ / /_/ /_  / / / /_/ /  / / /_/ /  ',
                '/_/ |_| \\__,_/ _  .___/_  .___/\\__,_/ /_/ /_/\\____//_/  \\__,_/   ',
                '               /_/     /_/                                       '
            ],
            [
                '.   .                                     . ',
                '|  /                                o     | ',
                '|-\'  .-.  .,-. .,-.  .-.  .--. .-.  .  .-.| ',
                '|  \\(   ) |   )|   )(   ) |  |(   ) | (   | ',
                '\'   ``-\'`-|`-\' |`-\'  `-\'`-\'  `-`-\'-\' `-`-\'`-',
                '          |    |                            ',
                '          \'    \'                            '
            ],
            [
                '|   /                              o    |',
                '|__/ ,---.,---.,---.,---.,---.,---..,---|',
                '|  \\ ,---||   ||   |,---||   ||   |||   |',
                '`   ``---^|---\'|---\'`---^`   \'`---\'``---\'',
                '          |    |                         '
            ]
        ];
        this._selectedLogo = this.logos[randomInt(this.logos.length)];

        if (settings.music) music.introMusic.play();
    };

    return constructor;
}();