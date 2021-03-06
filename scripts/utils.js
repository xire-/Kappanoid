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
 * test equality of two reasonably floats numbers (not too big nor too small)
 */
var floatEquals = function(f1, f2) {
    var epsilon = 0.0000001;
    return Math.abs(f1 - f2) < epsilon;
};


/*
 * convert a rgb color to an hsl color
 */
var rgbToHsl = function(color) {
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
};

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
 * key names to codes map
 */
var keycodes = {
    'space': 32,

    'd': 100,
    'i': 105,
    'l': 108,
    'n': 110,
    'o': 111,
    'p': 112,
    'r': 114,
    'u': 117,
    'y': 121,

    '0': 48,
    '1': 49,
    '2': 50,
    '3': 51,
    '4': 52,
    '5': 53,
    '6': 54,
    '7': 55,
    '8': 56,
    '9': 57,
};

/*
 * common keycode checks needed in all game states
 */
var keyPressToggleSettings = function(e) {
    var code = e.keyCode || e.charCode;
    switch (code) {
        case keycodes['d']:
            settings.debug = !settings.debug;
            break;

        case keycodes['p']:
            if (settings.timeScale === 0) {
                settings.timeScale = 1;
            } else {
                settings.timeScale = 0;
            }
            break;

        case keycodes['0']:
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
            break;
        case keycodes['1']:
            settings.colors = !settings.colors;
            break;
        case keycodes['2']:
            settings.particles = !settings.particles;
            break;
        case keycodes['3']:
            settings.sounds = !settings.sounds;
            break;
        case keycodes['4']:
            settings.music = !settings.music;
            break;
        case keycodes['5']:
            if (!settings.ballTrail) {
                world.balls.forEach(function(ball) {
                    ball.trail.reset();
                });
            }
            settings.ballTrail = !settings.ballTrail;
            break;
        case keycodes['6']:
            settings.lastBrickSlowMo = !settings.lastBrickSlowMo;
            break;
        case keycodes['7']:
            settings.paddleSpeedDistortion = !settings.paddleSpeedDistortion;
            break;
        case keycodes['8']:
            settings.worldShake = !settings.worldShake;
            break;
        case keycodes['9']:
            break;
    }
};