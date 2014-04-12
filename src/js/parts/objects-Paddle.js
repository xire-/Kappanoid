var Paddle = function() {

    ///////// public methods

    var render = function() {
        g.save();
        g.translate(this.center.x, this.center.y);
        if (settings.paddleSpeedDistortion) {
            // even if it may seem this belong to the update method, it must stay here
            // since it is dependant on the frame rate
            var speedScale = clamp(0.5, 1 - (Math.abs(this.center.x - this._oldPosX) - 20) / 60, 1);
            g.scale(1 / speedScale, speedScale);
        }

        g.shadowBlur = 5;
        g.shadowColor = 'rgba(0, 0, 0, 1)';
        g.shadowOffsetX = 3;
        g.shadowOffsetY = 3;

        g.fillStyle = settings.colors ? getColorString(this.color) : 'rgba(255, 255, 255, 1)';
        g.fillRect(-this.halfSize.x, -this.halfSize.y, this.halfSize.x * 2, this.halfSize.y * 2);

        g.restore();
    };

    var update = function(delta) {
        // to enlarge or not to enlarge
        var sign = this.enlarged ? 1 : -1;
        this._timeElapsed = clamp(250, this._timeElapsed + sign * delta, 750);
        this.halfSize.x = easing.easeInOutElastic(this._timeElapsed, this._origWidth, this._origWidth * 0.5, 1000);

        // update paddle position
        this._oldPosX = this.center.x;
        this.center.x = clamp(this.halfSize.x, mousePos.x - world.containerOffset.x, 800 - this.halfSize.x);

        if (this.sticky && this.ballCaught) {
            // bring ball along
            world.balls[0].center.x += this.center.x - this._oldPosX;
            world.balls[0].trail.fade();
        }
    };

    ///////// constructor

    var constructor = function Paddle(center, halfSize, life, color) {
        // public methods
        this.render = render;
        this.update = update;

        // init
        this.center = center;
        this.halfSize = halfSize;
        this.life = life;
        this.color = color;

        this.lazored = false;
        this.enlarged = false;
        this.sticky = false;
        this.ballCaught = false;

        this._oldPosX = 200;
        this._timeElapsed = 0;
        this._origWidth = halfSize.x;
    };

    constructor.prototype = {
        set center(value) {
            console.assert(isInstanceOf(value, Vector2), JSON.stringify(value));
            this._center = value;
        },
        get center() {
            return this._center;
        },

        set halfSize(value) {
            console.assert(isInstanceOf(value, Vector2), JSON.stringify(value));
            this._halfSize = value;
        },
        get halfSize() {
            return this._halfSize;
        },

        set life(value) {
            console.assert(isTypeOf(value, 'number'), JSON.stringify(value));
            this._life = Math.min(value, 5);
        },
        get life() {
            return this._life;
        },

        set color(value) {
            console.assert(isColor(value), JSON.stringify(value));
            this._color = value;
        },
        get color() {
            return this._color;
        },

        set lazored(value) {
            console.assert(isTypeOf(value, 'boolean'), JSON.stringify(value));
            this._lazored = value;
        },
        get lazored() {
            return this._lazored;
        },

        set enlarged(value) {
            console.assert(isTypeOf(value, 'boolean'), JSON.stringify(value));
            this._enlarged = value;
        },
        get enlarged() {
            return this._enlarged;
        },

        set sticky(value) {
            console.assert(isTypeOf(value, 'boolean'), JSON.stringify(value));
            this._sticky = value;
        },
        get sticky() {
            return this._sticky;
        },

        set ballCaught(value) {
            console.assert(isTypeOf(value, 'boolean'), JSON.stringify(value));
            this._ballCaught = value;
        },
        get ballCaught() {
            return this._ballCaught;
        },
    };

    return constructor;
}();

function testPaddle() {
    var center1 = new Vector2(3, 4);
    var halfSize1 = new Vector2(100, 300);
    var life1 = 6;
    var color1 = {
        r: 234,
        g: 245,
        b: 23
    };
    var paddle1 = new Paddle(center1, halfSize1, life1, color1);
    console.assert(JSON.stringify(paddle1.center) === JSON.stringify(center1) && JSON.stringify(paddle1.halfSize) === JSON.stringify(halfSize1) && paddle1.life === 5 && JSON.stringify(paddle1.color) === JSON.stringify(color1), JSON.stringify(paddle1));

    console.log('testPaddle OK');
}