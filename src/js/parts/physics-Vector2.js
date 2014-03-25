var Vector2 = (function() {
    var baseVector2 = Object.defineProperties({}, {
        x: {
            writable: true
        },

        y: {
            writable: true
        },

        set: {
            value: function(vector) {
                console.assert(vector instanceof Vector2, vector);

                this.x = vector.x;
                this.y = vector.y;
                return this;
            }
        },

        add: {
            value: function(vector) {
                console.assert(vector instanceof Vector2, vector);

                this.x += vector.x;
                this.y += vector.y;
                return this;
            }
        },

        sub: {
            value: function(vector) {
                console.assert(vector instanceof Vector2, vector);

                this.x -= vector.x;
                this.y -= vector.y;
                return this;
            }
        },

        mul: {
            value: function(scale) {
                this.x *= scale;
                this.y *= scale;
                return this;
            }
        },

        dot: {
            value: function(vector) {
                console.assert(vector instanceof Vector2, vector);

                return this.x * vector.x + this.y * vector.y;
            }
        },

        normalize: {
            value: function() {
                var scale = this.length();
                this.x /= scale;
                this.y /= scale;

                console.assert(this.length() === 1, this.length());
                return this;
            }
        },

        distance: {
            value: function(vector) {
                console.assert(vector instanceof Vector2, vector);

                return Math.sqrt(this.squaredDistance(vector));
            }
        },

        squaredDistance: {
            value: function(vector) {
                console.assert(vector instanceof Vector2, vector);

                return (this.x - vector.x) * (this.x - vector.x) + (this.y - vector.y) * (this.y - vector.y);
            }
        },

        length: {
            value: function() {
                return Math.sqrt(this.squaredLength());
            }
        },

        squaredLength: {
            value: function() {
                return this.x * this.x + this.y * this.y;
            }
        },

        clone: {
            value: function() {
                return new Vector2(this.x, this.y);
            }
        },

        toString: {
            value: function() {
                return 'Vector2(x: ' + this.x + ' y: ' + this.y + ')';
            }
        }
    });

    var Vector2 = function(x, y) {
        console.assert(x !== undefined && typeof x == 'number', x.toString());
        this.x = x;

        console.assert(y !== undefined && typeof y == 'number', y.toString());
        this.y = y;
    };
    Vector2.prototype = baseVector2;
    return Vector2;
}());

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