var Paddle = function() {
    var oldPosX = 200;
    var render = function() {
        // even if it may seem this belong to the update method, it must stay here
        // since it is dependant on the frame rate
        var speedScale = clamp(0.5, 1 - (Math.abs(mousePos.x - oldPosX) - 8) / 50, 1);
        oldPosX = mousePos.x;

        g.save();

        if (settings.colors) {
            g.fillStyle = this.color;
        } else {
            g.fillStyle = '#fff';
        }

        g.translate(this.center.x, this.center.y);
        if (settings.paddleSpeedDistortion) {
            g.scale(1 / speedScale, speedScale);
        }

        g.beginPath();
        g.rect(-this.halfSize.x, -this.halfSize.y, this.halfSize.x * 2, this.halfSize.y * 2);
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
    var life1 = 5;
    var color1 = '#abc';
    var paddle1 = new Paddle(center1, halfSize1, life1, color1);
    console.assert(JSON.stringify(paddle1.center) === JSON.stringify(center1) && JSON.stringify(paddle1.halfSize) === JSON.stringify(halfSize1) && paddle1.life === life1 && paddle1.color === color1, JSON.stringify(paddle1));

    console.log('testPaddle OK');
}