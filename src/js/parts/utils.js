var isTypeOf = function(value, type) {
    return value !== undefined && typeof value === type;
};

var isInstanceOf = function(value, instance) {
    return value !== undefined && value instanceof instance;
};

var isColor = function(value) {
    return value !== undefined && ((value.r !== undefined && value.g !== undefined && value.b !== undefined) || (value.h !== undefined && value.s !== undefined && value.l !== undefined));
};

/*
 * clamp val to the interval [min, max]
 */
var clamp = function(min, val, max) {
    return Math.min(Math.max(val, min), max);
};

/*
 * return a random number in the interval [min, max)
 * or [0, max) if only one value is given
 */
var randomFloat = function(min, max) {
    if (max === undefined) {
        max = min;
        min = 0;
    }
    return Math.random() * (max - min) + min;
};

/*
 * return a random integer in the interval [min, max)
 * or [0, max) if only one value is given
 */
var randomInt = function(min, max) {
    if (max === undefined) {
        max = min;
        min = 0;
    }
    return Math.floor(Math.random() * (max - min)) + min;
};

/*
 * convert a rgb color to an hsl color
 */
function rgbToHsl(color) {
    var r = color.r / 255;
    var g = color.g / 255;
    var b = color.b / 255;

    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if (max == min) {
        h = s = 0; // achromatic
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }

    return {
        h: Math.floor(h * 360),
        s: Math.floor(s * 100),
        l: Math.floor(l * 100),
    };
}

/*
 * given an object with rgb or hsl properties, returns the corresponding string
 * an optional alpha value can be added to the object, with name 'a'
 */
var getColorString = function(color) {
    console.assert(color !== undefined, 'color is undefined');

    var a = (color.a !== undefined) ? clamp(0, color.a, 1).toFixed(3) : 1;

    if (color.r !== undefined) {
        // it's rgb or rgba
        var r = clamp(0, Math.floor(color.r), 255);
        var g = clamp(0, Math.floor(color.g), 255);
        var b = clamp(0, Math.floor(color.b), 255);

        return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
    }
    if (color.h !== undefined) {
        // it's hsl or hsla
        var h = (color.h % 360).toFixed(3);
        var s = clamp(0, color.s, 100).toFixed(3);
        var l = clamp(0, color.l, 100).toFixed(3);

        return 'hsla(' + h + ', ' + s + '%, ' + l + '%, ' + a + ')';
    }
};

/*
 * common keycode checks needed in all game states
 */
var keyPressToggleSettings = function(e) {
    switch (e.keyCode) {
        case 48: // 0
            settings.colors = true;
            settings.particles = true;
            settings.sounds = true;
            settings.music = true;

            world.balls.forEach(function(ball) {
                ball.trail.reset();
            });
            settings.ballTrail = true;

            settings.lastBrickSlowMo = true;
            settings.paddleSpeedDistortion = true;

            settings.worldShake = true;
            world.shaker.enabled = settings.worldShake;
            break;
        case 49: // 1
            settings.colors = !settings.colors;
            break;
        case 50: // 2
            settings.particles = !settings.particles;
            break;
        case 51: // 3
            settings.sounds = !settings.sounds;
            break;
        case 52: // 4
            settings.music = !settings.music;
            break;
        case 53: // 5
            if (!settings.ballTrail) {
                world.balls.forEach(function(ball) {
                    ball.trail.reset();
                });
            }
            settings.ballTrail = !settings.ballTrail;
            break;
        case 54: // 6
            settings.lastBrickSlowMo = !settings.lastBrickSlowMo;
            break;
        case 55: // 7
            settings.paddleSpeedDistortion = !settings.paddleSpeedDistortion;
            break;
        case 56: // 8
            settings.worldShake = !settings.worldShake;
            world.shaker.enabled = settings.worldShake;
            break;
        case 57: // 9
            break;

        case 100: // D
            settings.debug = !settings.debug;
            break;
    }
};