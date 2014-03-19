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
        value: function(point) {
            this.x = point.x;
            this.y = point.y;
            return this;
        }
    },

    clone: {
        value: function() {
            return new Vector2(this.x, this.y);
        }
    },

    add: {
        value: function(displacement) {
            this.x += displacement.x;
            this.y += displacement.y;
            return this;
        }
    },

    sub: {
        value: function(displacement) {
            this.x -= displacement.x;
            this.y -= displacement.y;
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
        value: function(vec) {
            return this.x * vec.x + this.y * vec.y;
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
        value: function(vec) {
            return Math.sqrt(this.squaredDistance(vec));
        }
    },

    squaredDistance: {
        value: function(vec) {
            return (this.x - vec.x) * (this.x - vec.x) + (this.y - vec.y) * (this.y - vec.y);
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
