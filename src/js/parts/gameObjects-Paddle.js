var Paddle = (function() {
    var basePaddle = Object.defineProperties({}, {
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
                return new Paddle(this.center, this.halfSize, this.life, this.color);
            }
        },

        toString: {
            value: function() {
                return 'Paddle(center: ' + this.center + ', halfSize: ' + this.halfSize + ', life: ' + this.life + ', color: ' + this.color + ')';
            }
        }
    });

    var Paddle = function(center, halfSize, life, color) {
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
    Paddle.prototype = basePaddle;
    return Paddle;
}());

function testPaddle() {
    var paddle1 = new Paddle();
    console.assert(JSON.stringify(paddle1.center) === JSON.stringify(new Vector2()) && JSON.stringify(paddle1.halfSize) === JSON.stringify(new Vector2(10, 20)) && paddle1.life === 1 && paddle1.color === '#f00', paddle1.toString());

    var center1 = new Vector2(3, 4);
    paddle1 = new Brick(center1);
    console.assert(JSON.stringify(paddle1.center) === JSON.stringify(center1) && JSON.stringify(paddle1.halfSize) === JSON.stringify(new Vector2(10, 20)) && paddle1.life === 1 && paddle1.color === '#f00', paddle1.toString());

    var halfSize1 = new Vector2(100, 300);
    paddle1 = new Brick(center1, halfSize1);
    console.assert(JSON.stringify(paddle1.center) === JSON.stringify(center1) && JSON.stringify(paddle1.halfSize) === JSON.stringify(halfSize1) && paddle1.life === 1 && paddle1.color === '#f00', paddle1.toString());

    paddle1 = new Brick(center1, halfSize1, 4);
    console.assert(JSON.stringify(paddle1.center) === JSON.stringify(center1) && JSON.stringify(paddle1.halfSize) === JSON.stringify(halfSize1) && paddle1.life === 4 && paddle1.color === '#f00', paddle1.toString());

    paddle1 = new Brick(center1, halfSize1, 4, '#fff');
    console.assert(JSON.stringify(paddle1.center) === JSON.stringify(center1) && JSON.stringify(paddle1.halfSize) === JSON.stringify(halfSize1) && paddle1.life === 4 && paddle1.color === '#fff', paddle1.toString());

    var paddle2 = paddle1.clone();
    console.assert(JSON.stringify(paddle1) === JSON.stringify(paddle2));
}