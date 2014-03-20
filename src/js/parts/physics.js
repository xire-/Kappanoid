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
            console.assert(vector instanceof Vector2);

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
            console.assert(vector instanceof Vector2);

            this.x += vector.x;
            this.y += vector.y;
            return this;
        }
    },

    sub: {
        value: function(vector) {
            console.assert(vector instanceof Vector2);

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
            console.assert(vector instanceof Vector2);

            return this.x * vector.x + this.y * vector.y;
        }
    },

    normalize: {
        value: function() {
            var scale = this.len();
            this.x /= scale;
            this.y /= scale;
            return this;
        }
    },

    distance: {
        value: function(vector) {
            console.assert(vector instanceof Vector2);

            return Math.sqrt(this.squaredDistance(vector));
        }
    },

    squaredDistance: {
        value: function(vector) {
            console.assert(vector instanceof Vector2);

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
    this.prototype = baseVector2;
    if (x !== undefined && y !== undefined) {
        this.x = x;
        this.y = y;
    }
};
Vector2.prototype = baseVector2;
