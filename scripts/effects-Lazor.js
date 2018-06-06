var Lazor = function() {

    ///////// public methods

    var render = function() {
        g.save();
        g.translate(this.center.x, this.center.y);

        g.fillStyle = settings.colors ? getColorString(this.color) : 'rgba(255, 255, 255, 1)';
        g.fillRect(-1, 0, 2, 7);

        g.restore();
    };

    var update = function(delta) {
        // move the lazor up
        this.center.y = this.center.y - (600 * delta) / 1000;
    };

    ///////// constructor

    var constructor = function Lazor(center) {
        // public methods
        this.render = render;
        this.update = update;

        // init
        this.center = center;
        this.color = {
            r: 255,
            g: 0,
            b: 0,
        };
    };

    constructor.prototype = {
        set center(value) {
            console.assert(isInstanceOf(value, Vector2), JSON.stringify(value));
            this._center = value;
        },
        get center() {
            return this._center;
        },

        set color(value) {
            console.assert(isColor(value), JSON.stringify(value));
            this._color = value;
        },
        get color() {
            return this._color;
        },
    };

    return constructor;
}();