var Vector2 = function() {
    var set = function(vector) {
        console.assert(vector instanceof Vector2, vector);

        this.x = vector.x;
        this.y = vector.y;
        return this;
    };

    var add = function(vector) {
        console.assert(vector instanceof Vector2, vector);

        this.x += vector.x;
        this.y += vector.y;
        return this;
    };

    var sub = function(vector) {
        console.assert(vector instanceof Vector2, vector);

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
        console.assert(vector instanceof Vector2, vector);

        return this.x * vector.x + this.y * vector.y;
    };

    var normalize = function() {
        var scale = this.length();
        this.x /= scale;
        this.y /= scale;

        console.assert(this.length() === 1, this.length());
        return this;
    };

    var distance = function(vector) {
        console.assert(vector instanceof Vector2, vector);

        return Math.sqrt(this.squaredDistance(vector));
    };

    var squaredDistance = function(vector) {
        console.assert(vector instanceof Vector2, vector);

        return (this.x - vector.x) * (this.x - vector.x) + (this.y - vector.y) * (this.y - vector.y);
    };

    var length = function() {
        return Math.sqrt(this.squaredLength());
    };

    var squaredLength = function() {
        return this.x * this.x + this.y * this.y;
    };

    var clone = function() {
        return new Vector2(this.x, this.y);
    };


    var lerp = function(start, end, percent) {
        return start.clone().add((end.clone().sub(start)).mul(percent));
    };


    var constructor = function Vector2(x, y) {
        if (x === undefined || y === undefined) {
            x = 0;
            y = 0;
        }
        this.x = x;
        this.y = y;

        this.set = set;
        this.add = add;
        this.sub = sub;
        this.mul = mul;
        this.dot = dot;
        this.normalize = normalize;
        this.distance = distance;
        this.squaredDistance = squaredDistance;
        this.length = length;
        this.squaredLength = squaredLength;
        this.clone = clone;
    };

    constructor.prototype = {
        set x(value) {
            console.assert(value !== undefined && typeof value == 'number', JSON.stringify(value));
            this._x = value;
        },
        get x() {
            return this._x;
        },

        set y(value) {
            console.assert(value !== undefined && typeof value == 'number', JSON.stringify(value));
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
    console.assert(vector1.length() === 5, JSON.stringify(vector1));
    console.assert(vector1.squaredLength() === 25, JSON.stringify(vector1));
    console.assert(vector1.normalize().length() === 1, JSON.stringify(vector1));

    vector1 = new Vector2(3, 4);
    var vector2 = new Vector2(3, 4);
    console.assert(vector1.distance(vector2) === 0, JSON.stringify(vector1), JSON.stringify(vector2));
    console.assert(vector1.squaredDistance(vector2) === 0, JSON.stringify(vector1), JSON.stringify(vector2));

    console.log('testVector2 OK');
}