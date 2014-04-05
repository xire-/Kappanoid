var Lazor = function() {

    ///////// public methods

    var render = function() {
        g.save();
        g.translate(this.center.x, this.center.y);
        g.fillStyle = settings.colors ? '#FF0000' : '#FFFFFF';
        g.fillRect(-1, 0, 2, 7);
        g.restore();
    };

    var update = function(delta) {
        // move the Lazor up
        this.center.y = this.center.y - (600 * delta) / 1000;
    };

    ///////// constructor

    var constructor = function Lazor(center) {
        this.center = center;

        // public methods
        this.render = render;
        this.update = update;
    };

    constructor.prototype = {
        set center(value) {
            console.assert(value !== undefined && value instanceof Vector2, JSON.stringify(value));
            this._center = value;
        },
        get center() {
            return this._center;
        },
    };

    return constructor;
}();