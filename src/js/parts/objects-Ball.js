var Ball = function() {

    ///////// public methods

    var render = function() {
        g.save();

        // draw ball trail
        if (settings.ballTrail) {
            this.trail.render();
        }

        // draw ball
        g.translate(this.center.x, this.center.y);

        if (world.paddle.ballIsStuck === false) {
            g.rotate(Math.atan2(this.direction.y, this.direction.x));
        }

        g.shadowOffsetX = 3;
        g.shadowOffsetY = 3;
        g.shadowBlur = 5;
        g.shadowColor = getColorString({
            r: 0,
            g: 0,
            b: 0,
        });

        g.fillStyle = settings.colors ? getColorString(this.color) : getColorString({
            r: 255,
            g: 255,
            b: 255
        });
        g.fillRect(-this.radius, -this.radius, this.radius * 2, this.radius * 2);

        g.restore();
    };

    var update = function(delta) {
        this.center.add(this.direction.clone().mul(this.speed * world.ballSpeedMult * delta / 1000));
    };

    ///////// constructor

    var constructor = function Ball(center, radius, speed, direction, color) {
        // public methods
        this.render = render;
        this.update = update;

        // init
        this.center = center;
        this.radius = radius;
        this.speed = speed;
        this.direction = direction;
        this.color = color;

        this.trail = new Trail(this);
    };

    constructor.prototype = {
        set center(value) {
            console.assert(value !== undefined && value instanceof Vector2, JSON.stringify(value));
            this._center = value;
        },
        get center() {
            return this._center;
        },

        set radius(value) {
            console.assert(value !== undefined && typeof value == 'number', JSON.stringify(value));
            this._radius = value;
        },
        get radius() {
            return this._radius;
        },

        set speed(value) {
            console.assert(value !== undefined && typeof value == 'number', JSON.stringify(value));
            this._speed = value;
        },
        get speed() {
            return this._speed;
        },

        set direction(value) {
            console.assert(value !== undefined && value instanceof Vector2, JSON.stringify(value));
            this._direction = value.normalize();
        },
        get direction() {
            return this._direction;
        },

        set color(value) {
            console.assert(isColor(value), JSON.stringify(value));
            this._color = value;
        },
        get color() {
            return this._color;
        },
    };

    return constructor;
}();

function testBall() {
    var center1 = new Vector2(3, 4);
    var radius1 = 10;
    var velocity1 = new Vector2(20, 20);
    var speed1 = velocity1.length();
    var direction1 = velocity1.clone().normalize();
    var color1 = {
        r: 234,
        g: 245,
        b: 23
    };
    var ball1 = new Ball(center1, radius1, speed1, direction1, color1);
    console.assert(JSON.stringify(ball1.center) === JSON.stringify(center1) && ball1.radius === radius1 && ball1.speed === speed1 && JSON.stringify(ball1.direction) === JSON.stringify(direction1) && JSON.stringify(ball1.color) === JSON.stringify(color1), ball1.toString()); // JSON.stringify causes CircularException

    console.log('testBall OK');
}