var Lazor = function() {

    ///////// public methods

    var render = function() {
        g.save();
        g.translate(this.center.x, this.center.y);
        g.fillStyle = settings.colors ? 'rgba(255, 0, 0, 1)' : 'rgba(255, 255, 255, 1)';
        g.fillRect(-1, 0, 2, 7);
        g.restore();
    };

    var update = function(delta) {
        // move the Lazor up
        this.center.y = this.center.y - (600 * delta) / 1000;
    };

    ///////// constructor

    var constructor = function Lazor(center) {
        // public methods
        this.render = render;
        this.update = update;

        // init
        this.center = center;
    };

    constructor.prototype = {
        set center(value) {
            console.assert(isInstanceOf(value, Vector2), JSON.stringify(value));
            this._center = value;
        },
        get center() {
            return this._center;
        },
    };

    return constructor;
}();