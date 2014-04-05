var Shaker = function() {

    ///////// public methods

    var update = function(delta) {
        this._timePassed += delta;
        if (this._timePassed > 800) {
            this.target.x = 0;
            this.target.y = 0;
        } else {
            this.target.x = Math.pow(2, -4 * this._timePassed / 1000) * this.power.x * Math.sin(5 * Math.PI * this._timePassed / 1000);
            this.target.y = Math.pow(2, -4 * this._timePassed / 1000) * this.power.y * Math.sin(5 * Math.PI * this._timePassed / 1000);
        }
    };

    var shake = function(powerX, powerY) {
        this.power.x = powerX;
        this.power.y = powerY;

        this._timePassed = 0;
    };

    ///////// constructor

    var constructor = function Shaker(target) {
        // public methods
        this.update = update;
        this.shake = shake;

        // init
        this.target = target;
        this.power = new Vector2(0, 0);
        this._timePassed = 0;
    };

    return constructor;
}();