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
 * given an object with rgb or hsl properties, returns the corresponding string
 * an optional alpha value can be added to the object, with name 'a'
 */
var getColorString = function(color) {
    console.assert(color !== undefined, 'color is undefined');

    var a = (color.a !== undefined) ? clamp(0, color.a, 1).toFixed(3) : 1;

    if (color.r !== undefined) {
        //it's rgb or rgba
        var r = clamp(0, Math.floor(color.r), 255);
        var g = clamp(0, Math.floor(color.g), 255);
        var b = clamp(0, Math.floor(color.b), 255);

        return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
    }
    if (color.h !== undefined) {
        //it's hsl or hsla
        var h = color.h % 360;
        var s = clamp(0, color.s, 100);
        var l = clamp(0, color.l, 100);

        return 'hsla(' + h + ', ' + s + '%, ' + l + '%, ' + a + ')';
    }
};

/*
 * lighten or darken a hex color by a specific percentage
 */
var shadeColor = function(color, percent) {
    var R = parseInt(color.r * (100 + percent) / 100);
    var G = parseInt(color.g * (100 + percent) / 100);
    var B = parseInt(color.b * (100 + percent) / 100);

    R = R + Math.floor((percent / 255) * R);
    G = G + Math.floor((percent / 255) * G);
    B = B + Math.floor((percent / 255) * B);

    return {
        r: R,
        g: G,
        b: B,
    };
};