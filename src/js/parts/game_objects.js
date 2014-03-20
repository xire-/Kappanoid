var baseBrick = Object.defineProperties({}, {
    x: {
        value: 0,
        writable: true
    },

    y: {
        value: 0,
        writable: true
    },

    life: {
        value: 1,
        writeable: true
    },

    color: {
        value: '#f00'
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
            return new Brick(this.x, this.y);
        }
    },

    toString: {
        value: function() {
            return 'Brick(x: ' + this.x + ' y: ' + this.y + ')';
        }
    }
});

var Brick = function(x, y, life, color) {
    this.prototype = baseBrick;

    if (x !== undefined && y !== undefined) {
        this.x = x;
        this.y = y;
    }

    if (life !== undefined) {
        this.life = life;
    }

    if (color !== undefined) {
        this.color = color;
    }
};