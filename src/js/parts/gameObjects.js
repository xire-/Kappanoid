var baseBrick = Object.defineProperties({}, {
    _center: {
        value: new Vector2(),
        writable: true
    },
    get center() {
        return this._center;
    },
    set center(vector) {
        console.assert(vector instanceof Vector2);

        this._center = center;
    },

    life: {
        value: 1,
        writable: true
    },

    color: {
        value: '#f00',
        writable: true
    },

    clone: {
        value: function() {
            return new Brick(this.center, this.life, this.color);
        }
    },

    toString: {
        value: function() {
            return 'Brick(center: ' + this.center + ', life: ' + this.life + ', color: ' + this.color + ')';
        }
    }
});

var Brick = function(center, life, color) {
    if (center !== undefined && center instanceof Vector2) {
        this.center = center;
    }

    if (life !== undefined && typeof life == 'number') {
        this.life = life;
    }

    if (color !== undefined && typeof color == 'string') {
        this.color = color;
    }
};
Brick.prototype = baseBrick;

function testBrick() {
    var brick1 = new Brick();
    console.assert(brick1.center.x === 0 && brick1.center.y === 0 && brick1.life === 1 && brick1.color === '#f00', brick1.toString());

    brick1 = new Brick(new Vector2(3, 4));
    console.assert(brick1.center.x === 3 && brick1.center.y === 4 && brick1.life === 1 && brick1.color === '#f00', brick1.toString());

    brick1 = new Brick(new Vector2(3, 4), 2);
    console.assert(brick1.center.x === 3 && brick1.center.y === 4 && brick1.life === 2 && brick1.color === '#f00', brick1.toString());

    brick1 = new Brick(new Vector2(3, 4), 2, '#fff');
    console.assert(brick1.center.x === 3 && brick1.center.y === 4 && brick1.life === 2 && brick1.color === '#fff', brick1.toString());
}