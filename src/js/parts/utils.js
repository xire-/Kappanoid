var isColor = function(value) {
    return (value.r !== undefined && value.g !== undefined && value.b !== undefined) || (value.h !== undefined && value.s !== undefined && value.l !== undefined);
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
        var h = color.h % 360;
        var s = clamp(0, color.s, 100);
        var l = clamp(0, color.l, 100);

        return 'hsla(' + h + ', ' + s + '%, ' + l + '%, ' + a + ')';
    }
};