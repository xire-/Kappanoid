var Shaker = function() {

    ///////// public methods

    var update = function(delta) {
        this._timePassed += delta;
        if (this._timePassed > 800) {
            this.target.x = 0;
            this.target.y = 0;
        } else {
            this.target.x = Math.pow(2, -4 * this._timePassed / 1000) * this.shakePower * this.direction.x * Math.sin(5 * Math.PI * this._timePassed / 1000);
            this.target.y = Math.pow(2, -4 * this._timePassed / 1000) * this.shakePower * this.direction.y * Math.sin(5 * Math.PI * this._timePassed / 1000);
        }
    };

    var shake = function(directionX, directionY) {
        if (this.enabled === false) return;

        this.direction.x = directionX;
        this.direction.y = directionY;

        this._timePassed = 0;
    };

    ///////// constructor

    var constructor = function Shaker(target) {
        // public methods
        this.update = update;
        this.shake = shake;

        // init
        this.target = target;
        this.direction = new Vector2(0, 0);
        this.shakePower = 7;
        this.enabled = false;
        this._timePassed = 0;
    };

    return constructor;
}();