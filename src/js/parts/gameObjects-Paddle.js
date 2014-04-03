var Paddle = function() {
    var render = function() {
        g.save();
        g.translate(this.center.x, this.center.y);
        if (settings.paddleSpeedDistortion) {
            // even if it may seem this belong to the update method, it must stay here
            // since it is dependant on the frame rate
            var speedScale = clamp(0.5, 1 - (Math.abs(this.center.x - this._oldPosX) - 20) / 60, 1);

            g.scale(1 / speedScale, speedScale);
        }

        g.beginPath();
        g.rect(-this.halfSize.x, -this.halfSize.y, this.halfSize.x * 2, this.halfSize.y * 2);
        g.fillStyle = settings.colors ? this.color : '#FFFFFF';
        g.fill();

        g.fillStyle = '#000';
        g.fillText(this.life, 0, 0);

        g.restore();
    };

    var update = function(delta) {
        // enlarge or not paddle
        var sign = this.enlarged ? 1 : -1;
        this._timeElapsed = clamp(250, this._timeElapsed + sign * delta, 750);

        this.halfSize.x = easing.easeInOutElastic(this._timeElapsed, this._origWidth, this._origWidth * 0.5, 1000);

        // update paddle position (clamped)
        this._oldPosX = this.center.x;
        this.center.x = clamp(this.halfSize.x, mousePos.x - world.containerOffset.x, 800 - this.halfSize.x);
    };


    var constructor = function Paddle(center, halfSize, life, color) {
        this.center = center;
        this.halfSize = halfSize;
        this.life = life;
        this.color = color;

        this._oldPosX = 200;
        this.enlarged = false;
        this._timeElapsed = 0;
        this._origWidth = halfSize.x;


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
            this._life = Math.min(value, 10);
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