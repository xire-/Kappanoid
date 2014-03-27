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

    var toString = function() {
        return 'Vector2(x: ' + this.x + ' y: ' + this.y + ')';
    };


    var constructor = function Vector2(x, y) {
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
        this.toString = toString;
    };

    constructor.prototype = {
        set x(value) {
            console.assert(value !== undefined && typeof value == 'number', value.toString());
            this._x = value;
        },
        get x() {
            return this._x;
        },

        set y(value) {
            console.assert(value !== undefined && typeof value == 'number', value.toString());
            this._y = value;
        },
        get y() {
            return this._y;
        },
    };

    return constructor;
}();

function testVector2() {
    var vec1 = new Vector2(0, 0);
    console.assert(vec1.x === 0 && vec1.y === 0, vec1.x, vec1.y);

    vec1 = new Vector2(3, 4);
    console.assert(vec1.x === 3 && vec1.y === 4, vec1.x, vec1.y);
    console.assert(vec1.length() === 5, vec1.length());
    console.assert(vec1.squaredLength() === 25, vec1.squaredLength());
    console.assert(vec1.normalize().length() === 1, vec1.length());

    var vec2 = new Vector2(3, 4);
    vec1 = new Vector2(3, 4);
    console.assert(vec1.distance(vec2) === 0, vec1.x, vec1.y);
    console.assert(vec1.squaredDistance(vec2) === 0, vec1.squaredDistance(vec2));
}