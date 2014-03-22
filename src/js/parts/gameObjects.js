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
        writable: true
    },

    color: {
        value: '#f00',
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
            return new Brick(this.x, this.y, this.life, this.color);
        }
    },

    toString: {
        value: function() {
            return 'Brick(x: ' + this.x + ' y: ' + this.y + ' life: ' + this.life + ' color: ' + this.color + ')';
        }
    }
});

var Brick = function(x, y, life, color) {
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
Brick.prototype = baseBrick;

function testBrick() {
    var brick1 = new Brick();
    console.assert(brick1.x === 0 && brick1.y === 0 && brick1.life === 1 && brick1.color === '#f00', brick1.x, brick1.y, brick1.life, brick1.color);

    brick1 = new Brick(3);
    console.assert(brick1.x === 0 && brick1.y === 0 && brick1.life === 1 && brick1.color === '#f00', brick1.x, brick1.y, brick1.life, brick1.color);

    brick1 = new Brick(3, 4);
    console.assert(brick1.x === 3 && brick1.y === 4 && brick1.life === 1 && brick1.color === '#f00', brick1.x, brick1.y, brick1.life, brick1.color);

    brick1 = new Brick(3, 4, 2);
    console.assert(brick1.x === 3 && brick1.y === 4 && brick1.life === 2 && brick1.color === '#f00', brick1.x, brick1.y, brick1.life, brick1.color);

    brick1 = new Brick(3, 4, 2, '#fff');
    console.assert(brick1.x === 3 && brick1.y === 4 && brick1.life === 2 && brick1.color === '#fff', brick1.x, brick1.y, brick1.life, brick1.color);
}