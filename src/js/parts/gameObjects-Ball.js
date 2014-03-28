var Ball = function() {
    var render = function() {
        g.save();

        if (settings.colors) {
            g.fillStyle = this.color;
        } else {
            g.fillStyle = '#fff';
        }

        g.translate(this.center.x, this.center.y);
        if (settings.ballFaceDirection) {
            g.rotate(-Math.atan2(this.direction.x, this.direction.y));
        }
        g.fillRect(-this.radius, -this.radius, this.radius * 2, this.radius * 2);

        g.restore();
    };

    var update = function(delta) {
        this.center.add(this.direction.clone().mul(this.speed * delta / 1000));
    };

    var clone = function() {
        return new Ball(this.center.clone(), this.radius, this.speed, this.direction.clone(), this.color);
    };

    var toString = function() {
        return JSON.stringify(this);
    };


    var constructor = function Ball(center, radius, speed, direction, color) {
        this.center = center;
        this.radius = radius;
        this.speed = speed;
        this.direction = direction;
        this.color = color;

        this.render = render;
        this.update = update;
        this.clone = clone;
        this.toString = toString;
    };

    constructor.prototype = {
        set center(value) {
            console.assert(value !== undefined && value instanceof Vector2, value.toString());
            this._center = value;
        },
        get center() {
            return this._center;
        },

        set radius(value) {
            console.assert(value !== undefined && typeof value == 'number', value.toString());
            this._radius = value;
        },
        get radius() {
            return this._radius;
        },

        set speed(value) {
            console.assert(value !== undefined && typeof value == 'number', value.toString());
            this._speed = value;
        },
        get speed() {
            return this._speed;
        },

        set direction(value) {
            console.assert(value !== undefined && value instanceof Vector2, value.toString());
            this._direction = value.normalize();
        },
        get direction() {
            return this._direction;
        },

        set color(value) {
            console.assert(value !== undefined && typeof value == 'string', value.toString());
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
    var ball1 = new Ball(center1, radius1, speed1, direction1, '#fff');
    console.assert(JSON.stringify(ball1.center) === JSON.stringify(center1) && ball1.radius === radius1 && ball1.color === '#fff', ball1.toString());

    var ball2 = ball1.clone();
    console.assert(JSON.stringify(ball1) === JSON.stringify(ball2));
}