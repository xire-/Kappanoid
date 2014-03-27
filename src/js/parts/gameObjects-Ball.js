var Ball = function() {
    var render = function() {
        g.save();
        g.fillStyle = this.color;
        g.beginPath();
        g.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI);
        g.fill();
        g.restore();
    };

    var update = function(delta) {
        this.center.add(this.velocity.clone().mul(delta / 1000));
    };

    var clone = function() {
        return new Ball(this.center, this.radius, this.velocity, this.color);
    };

    var toString = function() {
        return JSON.stringify(this);
    };


    var constructor = function Ball(center, radius, velocity, color) {
        this.center = center;
        this.radius = radius;
        this.velocity = velocity;
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

        set velocity(value) {
            console.assert(value !== undefined && value instanceof Vector2, value.toString());
            this._velocity = value;
        },
        get velocity() {
            return this._velocity;
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
    var ball1 = new Ball(center1, radius1, velocity1, '#fff');
    console.assert(JSON.stringify(ball1.center) === JSON.stringify(center1) && ball1.radius === radius1 && ball1.color === '#fff', ball1.toString());

    var ball2 = ball1.clone();
    console.assert(JSON.stringify(ball1) === JSON.stringify(ball2));
}