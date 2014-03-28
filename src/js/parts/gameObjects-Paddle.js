var Paddle = function() {
    var render = function() {
        g.save();

        if (settings.colors) {
            g.fillStyle = this.color;
        } else {
            g.fillStyle = '#fff';
        }

        g.beginPath();
        g.rect(this.center.x - this.halfSize.x, this.center.y - this.halfSize.y, this.halfSize.x * 2, this.halfSize.y * 2);
        g.fill();

        g.restore();
    };

    var update = function( /*delta*/ ) {};


    var constructor = function Paddle(center, halfSize, life, color) {
        this.center = center;
        this.halfSize = halfSize;
        this.life = life;
        this.color = color;

        this.render = render;
        this.update = update;
    };

    constructor.prototype = {
        set center(value) {
            console.assert(value !== undefined && value instanceof Vector2, JSON.stringify(value));
            this._center = value;
        },
        get center() {
            return this._center;
        },

        set halfSize(value) {
            console.assert(value !== undefined && value instanceof Vector2, JSON.stringify(value));
            this._halfSize = value;
        },
        get halfSize() {
            return this._halfSize;
        },

        set life(value) {
            console.assert(value !== undefined && typeof value == 'number', JSON.stringify(value));
            this._life = value;
        },
        get life() {
            return this._life;
        },

        set color(value) {
            console.assert(value !== undefined && typeof value == 'string', JSON.stringify(value));
            this._color = value;
        },
        get color() {
            return this._color;
        },
    };

    return constructor;
}();

function testPaddle() {
    var center1 = new Vector2(3, 4);
    var halfSize1 = new Vector2(100, 300);
    var paddle1 = new Brick(center1, halfSize1, 4, '#fff');
    console.assert(JSON.stringify(paddle1.center) === JSON.stringify(center1) && JSON.stringify(paddle1.halfSize) === JSON.stringify(halfSize1) && paddle1.life === 4 && paddle1.color === '#fff', JSON.stringify(paddle1));

    var paddle2 = paddle1.clone();
    console.assert(JSON.stringify(paddle1) === JSON.stringify(paddle2));
}