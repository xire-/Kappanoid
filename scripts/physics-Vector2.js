var Vector2 = function() {

    ///////// public static methods

    var lerp = function(start, end, percent) {
        return start.clone().add((end.clone().sub(start)).mul(percent));
    };

    ///////// public methods

    var set = function(vector) {
        console.assert(isInstanceOf(vector, Vector2), vector);
        this.x = vector.x;
        this.y = vector.y;
        return this;
    };


    var add = function(vector) {
        console.assert(isInstanceOf(vector, Vector2), vector);
        this.x += vector.x;
        this.y += vector.y;
        return this;
    };

    var sub = function(vector) {
        console.assert(isInstanceOf(vector, Vector2), vector);
        this.x -= vector.x;
        this.y -= vector.y;
        return this;
    };

    var mul = function(scale) {
        this.x *= scale;
        this.y *= scale;
        return this;
    };

    var dot = function(vector) {
        console.assert(isInstanceOf(vector, Vector2), vector);
        return this.x * vector.x + this.y * vector.y;
    };


    var normalize = function() {
        var scale = this.length();
        this.x /= scale;
        this.y /= scale;
        console.assert(floatEquals(this.length(), 1), this.length());
        return this;
    };

    var distance = function(vector) {
        console.assert(isInstanceOf(vector, Vector2), vector);
        return Math.sqrt((this.x - vector.x) * (this.x - vector.x) + (this.y - vector.y) * (this.y - vector.y));
    };

    var length = function() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    };


    var clone = function() {
        return new Vector2(this.x, this.y);
    };

    ///////// constructor

    var constructor = function Vector2(x, y) {
        // public methods
        this.set = set;
        this.add = add;
        this.sub = sub;
        this.mul = mul;
        this.dot = dot;
        this.normalize = normalize;
        this.distance = distance;
        this.length = length;
        this.clone = clone;

        // init
        this.x = x;
        this.y = y;
    };

    constructor.prototype = {
        set x(value) {
            console.assert(isTypeOf(value, 'number'), JSON.stringify(value));
            this._x = value;
        },
        get x() {
            return this._x;
        },

        set y(value) {
            console.assert(isTypeOf(value, 'number'), JSON.stringify(value));
            this._y = value;
        },
        get y() {
            return this._y;
        },
    };

    constructor.lerp = lerp;

    return constructor;
}();

function testVector2() {
    var vector1 = new Vector2(0, 0);
    console.assert(vector1.x === 0 && vector1.y === 0, JSON.stringify(vector1));

    vector1 = new Vector2(3, 4);
    console.assert(vector1.x === 3 && vector1.y === 4, JSON.stringify(vector1));
    console.assert(floatEquals(vector1.length(), 5), JSON.stringify(vector1));
    console.assert(floatEquals(vector1.normalize().length(), 1), JSON.stringify(vector1));

    vector1 = new Vector2(3, 4);
    var vector2 = new Vector2(3, 4);
    console.assert(floatEquals(vector1.distance(vector2), 0), JSON.stringify(vector1), JSON.stringify(vector2));

    console.log('testVector2 OK');
}