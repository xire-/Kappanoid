var IntroState = function() {
    var keyPress = function(e) {
        switch (e.keyCode) {
            case 32: // SPACE
                if (this.update === updateIdle) {
                    this.update = updateOutro;
                    this.render = renderOutro;
                    this._timePassed = 0;
                }
                // prevent space from scrolling the page
                return false;
            default:
                // alert(e.keyCode);
                break;
        }
    };

    var drawCreditText = function(timePassed, text, lineHeight, y) {
        var offs = (timePassed / 3) % 500;
        var grd = g.createLinearGradient(-offs, 0, 1000 - offs, 0);
        grd.addColorStop(0 / 12, '#f00');
        grd.addColorStop(1 / 12, '#ff0');
        grd.addColorStop(2 / 12, '#0f0');
        grd.addColorStop(3 / 12, '#0ff');
        grd.addColorStop(4 / 12, '#00f');
        grd.addColorStop(5 / 12, '#f0f');
        grd.addColorStop(6 / 12, '#f00');
        grd.addColorStop(7 / 12, '#ff0');
        grd.addColorStop(8 / 12, '#0f0');
        grd.addColorStop(9 / 12, '#0ff');
        grd.addColorStop(10 / 12, '#00f');
        grd.addColorStop(11 / 12, '#f0f');
        grd.addColorStop(12 / 12, '#f00');

        g.fillStyle = grd;
        for (var j = 0; j < text.length; j++) {
            g.fillText(text[j], 0, y);
            y += lineHeight;
        }
        return y;
    };

    var drawLogo = function(selectedLogo, logoHeight, y) {
        // draw previously randomly selected logo
        for (var i = 0; i < selectedLogo.length; i++) {
            g.fillText(selectedLogo[i], 0, y);
            y += logoHeight;
        }
        return y;
    };

    ///////// idle state

    var renderIdle = function() {
        g.save();

        // clear the previous frame
        g.fillStyle = '#000000';
        g.fillRect(0, 0, constants.canvasRelativeWidth, constants.canvasRelativeHeight);

        var titlePosX = constants.bordersRelativeThickness + constants.worldRelativeWidth / 2;
        var titlePosY = easing.easeOutBounce(clamp(0, this._timePassed, 1000), 0, constants.canvasRelativeHeight / 2, 1000);
        g.translate(titlePosX, titlePosY);

        g.textAlign = 'center';
        g.textBaseline = 'middle';
        g.font = '15px monospace';
        g.fillStyle = '#FFFFFF';

        var lineHeightLogo = 15;
        var lineHeightText = 20;
        var logoImageDistance = 40;
        var imageTextDistance = 220;

        // calculate starting position
        var y = -((lineHeightLogo * this._selectedLogo.length + this._insertCoinImage.height + lineHeightText * this._text.length) + logoImageDistance + imageTextDistance) / 2;

        // draw previously randomly selected logo
        y = drawLogo(this._selectedLogo, lineHeightLogo, y);

        // draw insert coin image
        y += logoImageDistance;
        if (this._timePassed % 2000 < 1500) {
            this._drawInsertCoinImage = true;
            g.drawImage(this._insertCoinImage, -this._insertCoinImage.width / 2, y);
        } else {
            this._drawInsertCoinImage = false;
        }
        y += this._insertCoinImage.height;

        // draw text
        y += imageTextDistance;
        y = drawCreditText(this._timePassed, this._text, lineHeightText, y);

        g.restore();
    };

    var updateIdle = function(delta) {
        this._timePassed += delta;
    };

    ///////// outro state

    var renderOutro = function() {
        g.save();

        // clear the previous frame
        g.fillStyle = '#000000';
        g.fillRect(0, 0, constants.canvasRelativeWidth, constants.canvasRelativeHeight);

        var titleScale = easing.easeInBack(clamp(0, this._timePassed, 1000), 1, -1, 1000);
        var titleRotation = easing.easeInBack(clamp(0, this._timePassed, 1000), 0, Math.PI * 2, 1000);

        g.translate(constants.bordersRelativeThickness + constants.worldRelativeWidth / 2, constants.canvasRelativeHeight / 2);
        g.scale(titleScale, titleScale);
        g.rotate(titleRotation);

        g.textAlign = 'center';
        g.textBaseline = 'middle';
        g.font = '15px monospace';
        g.fillStyle = '#FFFFFF';

        var lineHeightLogo = 15;
        var lineHeightText = 20;
        var logoImageDistance = 40;
        var imageTextDistance = 220;

        // calculate starting position
        var y = -((lineHeightLogo * this._selectedLogo.length + this._insertCoinImage.height + lineHeightText * this._text.length) + logoImageDistance + imageTextDistance) / 2;

        // draw previously randomly selected logo
        y = drawLogo(this._selectedLogo, lineHeightLogo, y);

        // draw insert coin image
        y += logoImageDistance;
        if (this._drawInsertCoinImage) {
            g.drawImage(this._insertCoinImage, -this._insertCoinImage.width / 2, y);
        }
        y += this._insertCoinImage.height;

        // draw text
        y += imageTextDistance;
        y = drawCreditText(this._timePassed, this._text, lineHeightText, y);

        g.restore();
    };

    var updateOutro = function(delta) {
        this._timePassed += delta;
        if (this._timePassed > 1000) {
            currState = states.playing;
        }
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
                ',--. ,--.                                             ,--.   ,--. ',
                '|  .\'   / ,--,--. ,---.  ,---.  ,--,--.,--,--,  ,---. `--\' ,-|  | ',
                '|  .   \' \' ,-.  || .-. || .-. |\' ,-.  ||      \\| .-. |,--.\' .-. | ',
                '|  |\\   \\\\ \'-\'  || \'-\' \'| \'-\' \'\\ \'-\'  ||  ||  |\' \'-\' \'|  |\\ `-\' | ',
                '`--\' \'--\' `--`--\'|  |-\' |  |-\'  `--`--\'`--\'\'--\' `---\' `--\' `---\'  ',
                '                 `--\'   `--\'                                      '
            ],
            [
                ' __  __     ______     ______   ______   ______     __   __     ______     __     _____    ',
                '/\\ \\/ /    /\\  __ \\   /\\  == \\ /\\  == \\ /\\  __ \\   /\\ "-.\\ \\   /\\  __ \\   /\\ \\   /\\  __-.  ',
                '\\ \\  _"-.  \\ \\  __ \\  \\ \\  _-/ \\ \\  _-/ \\ \\  __ \\  \\ \\ \\-.  \\  \\ \\ \\/\\ \\  \\ \\ \\  \\ \\ \\/\\ \\ ',
                ' \\ \\_\\ \\_\\  \\ \\_\\ \\_\\  \\ \\_\\    \\ \\_\\    \\ \\_\\ \\_\\  \\ \\_\\\\"\\_\\  \\ \\_____\\  \\ \\_\\  \\ \\____- ',
                '  \\/_/\\/_/   \\/_/\\/_/   \\/_/     \\/_/     \\/_/\\/_/   \\/_/ \\/_/   \\/_____/   \\/_/   \\/____/ '
            ],
            [
                '  _  __            _ __    _ __                             _        _   ',
                ' | |/ /   __ _    | \'_ \\  | \'_ \\  __ _    _ _      ___     (_)    __| |  ',
                ' | \' <   / _` |   | .__/  | .__/ / _` |  | \' \\    / _ \\    | |   / _` |  ',
                ' |_|\\_\\  \\__,_|   |_|__   |_|__  \\__,_|  |_||_|   \\___/   _|_|_  \\__,_|  ',
                '_|"""""|_|"""""|_|"""""|_|"""""|_|"""""|_|"""""|_|"""""|_|"""""|_|"""""| ',
                '"`-0-0-\'"`-0-0-\'"`-0-0-\'"`-0-0-\'"`-0-0-\'"`-0-0-\'"`-0-0-\'"`-0-0-\'"`-0-0-\' '
            ],
            [
                ' __  __                                       __     __ ',
                '|  |/  |.---.-.-----.-----.---.-.-----.-----.|__|.--|  |',
                '|     < |  _  |  _  |  _  |  _  |     |  _  ||  ||  _  |',
                '|__|\\__||___._|   __|   __|___._|__|__|_____||__||_____|',
                '              |__|  |__|                                '
            ],
            [
                '   __   __)                             ',
                '  (, ) /                         ,   /) ',
                '    /(   _  __  __   _  __   ___   _(/  ',
                ' ) /  \\_(_(_/_)_/_)_(_(_/ (_(_)_(_(_(_  ',
                '(_/      .-/ .-/                        ',
                '        (_/ (_/                         '
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
        this._insertCoinImage = new Image();
        this._insertCoinImage.src = 'img/insert_coin.png';
        this._drawInsertCoinImage = true;
        this._text = [
            'Francesco Cagnin and Marco Gasparini',
            '© 2014'
        ];
        this._timePassed = 0;

        this.render = renderIdle;
        this.update = updateIdle;
        this.keyPress = keyPress;
    };

    return constructor;
}();