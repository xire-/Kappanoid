var Brick = (function() {
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
            this._center = vector;
        },

        _halfSize: {
            value: new Vector2(10, 20),
            writable: true
        },
        get halfSize() {
            return this._halfSize;
        },
        set halfSize(vector) {
            console.assert(vector instanceof Vector2);
            this._halfSize = vector;
        },

        life: {
            value: 1,
            writable: true
        },

        color: {
            value: '#f00',
            writable: true
        },

        render: {
            value: function(g) {
                g.save();
                g.fillStyle = this.color;
                g.beginPath();
                g.rect(this.center.x - this.halfSize.x, this.center.y - this.halfSize.y, this.halfSize.x * 2, this.halfSize.y * 2);
                g.fill();
                g.restore();
            }
        },

        clone: {
            value: function() {
                return new Brick(this.center, this.halfSize, this.life, this.color);
            }
        },

        toString: {
            value: function() {
                return 'Brick(center: ' + this.center + ', halfSize: ' + this.halfSize + ', life: ' + this.life + ', color: ' + this.color + ')';
            }
        }
    });

    var Brick = function(center, halfSize, life, color) {
        if (center !== undefined && center instanceof Vector2) {
            this.center = center;
        }

        if (halfSize !== undefined && halfSize instanceof Vector2) {
            this.halfSize = halfSize;
        }

        if (life !== undefined && typeof life == 'number') {
            this.life = life;
        }

        if (color !== undefined && typeof color == 'string') {
            this.color = color;
        }
    };
    Brick.prototype = baseBrick;
    return Brick;
}());

function testBrick() {
    var brick1 = new Brick();
    console.assert(JSON.stringify(brick1.center) === JSON.stringify(new Vector2()) && JSON.stringify(brick1.halfSize) === JSON.stringify(new Vector2(10, 20)) && brick1.life === 1 && brick1.color === '#f00', brick1.toString());

    var center1 = new Vector2(3, 4);
    brick1 = new Brick(center1);
    console.assert(JSON.stringify(brick1.center) === JSON.stringify(center1) && JSON.stringify(brick1.halfSize) === JSON.stringify(new Vector2(10, 20)) && brick1.life === 1 && brick1.color === '#f00', brick1.toString());

    var halfSize1 = new Vector2(100, 300);
    brick1 = new Brick(center1, halfSize1);
    console.assert(JSON.stringify(brick1.center) === JSON.stringify(center1) && JSON.stringify(brick1.halfSize) === JSON.stringify(halfSize1) && brick1.life === 1 && brick1.color === '#f00', brick1.toString());

    brick1 = new Brick(center1, halfSize1, 4);
    console.assert(JSON.stringify(brick1.center) === JSON.stringify(center1) && JSON.stringify(brick1.halfSize) === JSON.stringify(halfSize1) && brick1.life === 4 && brick1.color === '#f00', brick1.toString());

    brick1 = new Brick(center1, halfSize1, 4, '#fff');
    console.assert(JSON.stringify(brick1.center) === JSON.stringify(center1) && JSON.stringify(brick1.halfSize) === JSON.stringify(halfSize1) && brick1.life === 4 && brick1.color === '#fff', brick1.toString());

    var brick2 = brick1.clone();
    console.assert(JSON.stringify(brick1) === JSON.stringify(brick2));
}