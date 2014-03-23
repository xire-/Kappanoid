var baseVector2 = Object.defineProperties({}, {
    x: {
        value: 0,
        writable: true
    },

    y: {
        value: 0,
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

    clone: {
        value: function() {
            return new Vector2(this.x, this.y);
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

    toString: {
        value: function() {
            return 'Vector2(x: ' + this.x + ' y: ' + this.y + ')';
        }
    }
});

var Vector2 = function(x, y) {
    if (x !== undefined && y !== undefined) {
        this.x = x;
        this.y = y;
    }
};
Vector2.prototype = baseVector2;

function testVector2() {
    var vec1, vec2, tmp;
    vec1 = new Vector2();
    console.assert(vec1.x === 0 && vec1.y === 0, vec1.x, vec1.y);

    vec1 = new Vector2(3);
    console.assert(vec1.x === 0 && vec1.y === 0, vec1.x, vec1.y);

    vec1 = new Vector2(3, 4);
    console.assert(vec1.x === 3 && vec1.y === 4, vec1.x, vec1.y);
    console.assert(vec1.length() === 5, vec1.length());
    console.assert(vec1.squaredLength() === 25, vec1.squaredLength());
    console.assert((tmp = vec1.clone().normalize()).length() === 1, tmp.length());

    vec2 = new Vector2(3, 4);
    console.assert(vec1.distance(vec2) === 0, vec1.x, vec1.y);
    console.assert(vec1.squaredDistance(vec2) === 0, vec1.squaredDistance(vec2));
}