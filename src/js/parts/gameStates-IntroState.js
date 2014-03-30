var IntroState = function() {

    var renderIntroIdle = function( /*delta*/ ) {
        g.save();

        // clear the previous frame
        g.fillStyle = '#000';
        g.fillRect(0, 0, defaultWidth, defaultHeight);

        var titlePosX = settings.worldBorderThickness + 400;
        var titlePosY = easing.easeOutBounce(clamp(0, this.timePassed, 1000), 0, defaultHeight / 2, 1000);

        g.translate(titlePosX, titlePosY);

        g.fillStyle = '#fff';
        g.textAlign = 'center';
        g.textBaseline = 'middle';
        g.font = '15px monospace';

        var lineHeightLogo = 15;
        var lineHeightText = 20;
        var logoImageDistance = 40;
        var imageTextDistance = 220;

        // calculate starting position
        var y = -((lineHeightLogo * this.selectedLogo.length + this.insertCoinImage.height + lineHeightText * this.text.length) + logoImageDistance + imageTextDistance) / 2;

        // draw previously randomly selected logo
        for (var i = 0; i < this.selectedLogo.length; i++) {
            g.fillText(this.selectedLogo[i], 0, y);
            y += lineHeightLogo;
        }

        // draw insert coin image
        y += logoImageDistance;
        if (Math.max(0, this.timePassed - 2000) % 2000 < 1500) {
            g.drawImage(this.insertCoinImage, -this.insertCoinImage.width / 2, y);
        }
        y += this.insertCoinImage.height;

        // draw text
        y += imageTextDistance;
        g.fillStyle = getColorString({
            h: (this.timePassed / 3),
            s: 100,
            l: 50
        })
        for (var j = 0; j < this.text.length; j++) {
            g.fillText(this.text[j], 0, y);
            y += lineHeightText;
        }

        g.restore();
    };

    var renderOutro = function( /*delta*/ ) {
        g.save();

        // clear the previous frame
        g.fillStyle = '#000';
        g.fillRect(0, 0, defaultWidth, defaultHeight);

        var titleScale = easing.easeInBack(clamp(0, this.timePassed, 1000), 1, -1, 1000);
        var titleRotation = easing.easeInBack(clamp(0, this.timePassed, 1000), 0, Math.PI * 2, 1000);

        g.translate(settings.worldBorderThickness + 400, defaultHeight / 2);
        g.scale(titleScale, titleScale);
        g.rotate(titleRotation);

        g.fillStyle = '#fff';
        g.textAlign = 'center';
        g.textBaseline = 'middle';
        g.font = '15px monospace';

        var lineHeightLogo = 15;
        var lineHeightText = 20;
        var logoImageDistance = 40;
        var imageTextDistance = 220;

        // calculate starting position
        var y = -((lineHeightLogo * this.selectedLogo.length + this.insertCoinImage.height + lineHeightText * this.text.length) + logoImageDistance + imageTextDistance) / 2;

        // draw previously randomly selected logo
        for (var i = 0; i < this.selectedLogo.length; i++) {
            g.fillText(this.selectedLogo[i], 0, y);
            y += lineHeightLogo;
        }

        // draw insert coin image
        y += logoImageDistance;
        if (this.drawInsertCoinImage) {
            g.drawImage(this.insertCoinImage, -this.insertCoinImage.width / 2, y);
        }
        y += this.insertCoinImage.height;

        // draw text
        y += imageTextDistance;
        for (var j = 0; j < this.text.length; j++) {
            g.fillText(this.text[j], 0, y);
            y += lineHeightText;
        }

        g.restore();
    };

    var updateIdle = function(delta) {
        this.timePassed += delta;
    };

    var updateOutro = function(delta) {
        this.timePassed += delta;
        if (this.timePassed > 1000) {
            currState = states.playing;
        }
    };

    var keyPress = function(e) {
        switch (e.keyCode) {
            case 32: // SPACE
                if (this.update === updateIdle) {
                    this.update = updateOutro;
                    this.render = renderOutro;
                    this.timePassed = 0;
                }
                // prevent space from scrolling the page
                return false;
            default:
                // alert(e.keyCode);
                break;
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
        this.selectedLogo = this.logos[randomInt(this.logos.length)];
        this.insertCoinImage = new Image();
        this.insertCoinImage.src = 'img/insert_coin.png';
        this.drawInsertCoinImage = true;
        this.text = [
            'Francesco Cagnin and Marco Gasparini',
            '© 2014'
        ];

        this.titlePosX = settings.worldBorderThickness + 400;
        this.titlePosY = defaultHeight / 2;
        this.timePassed = 0;
        this.titleScale = 1;
        this.titleRotation = 0;

        this.render = renderIntroIdle;
        this.update = updateIdle;
        this.keyPress = keyPress;
    };

    return constructor;
}();