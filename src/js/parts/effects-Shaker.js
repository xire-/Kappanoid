var Shaker = function() {

    ///////// public methods

    var shake = function(direction) {
        this._timePassed = 0;
        this._direction.set(direction);
    };


    var update = function(delta) {
        this._timePassed += delta;
        if (this._timePassed > 800) {
            this._target.x = 0;
            this._target.y = 0;
        } else {
            this._target.x = Math.pow(2, -4 * this._timePassed / 1000) * this._shakePower * this._direction.x * Math.sin(5 * Math.PI * this._timePassed / 1000);
            this._target.y = Math.pow(2, -4 * this._timePassed / 1000) * this._shakePower * this._direction.y * Math.sin(5 * Math.PI * this._timePassed / 1000);
        }
    };

    ///////// constructor

    var constructor = function Shaker(target) {
        // public methods
        this.shake = shake;
        this.update = update;

        // init
        this._target = target;
        this._direction = new Vector2(0, 0);
        this._shakePower = 7;

        this._timePassed = 0;
    };

    return constructor;
}();