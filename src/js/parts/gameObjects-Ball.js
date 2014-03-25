var Ball = (function() {
    var baseBall = Object.defineProperties({}, {
        _center: {
            writable: true
        },
        get center() {
            return this._center;
        },
        set center(vector) {
            console.assert(vector instanceof Vector2);
            this._center = vector;
        },

        radius: {
            writable: true
        },

        color: {
            writable: true
        },

        render: {
            value: function(g) {
                g.save();
                g.fillStyle = this.color;
                g.beginPath();
                g.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI);
                g.fill();
                g.restore();
            }
        },

        clone: {
            value: function() {
                return new Ball(this.center, this.radius, this.color);
            }
        },

        toString: {
            value: function() {
                return 'Ball(center: ' + this.center + ', radius: ' + this.radius + ', color: ' + this.color + ')';
            }
        }
    });

    var Ball = function(center, radius, color) {
        console.assert(center !== undefined && center instanceof Vector2, center.toString());
        this.center = center;

        console.assert(radius !== undefined && typeof radius == 'number', radius.toString());
        this.radius = radius;

        console.assert(color !== undefined && typeof color == 'string', color.toString());
        this.color = color;
    };
    Ball.prototype = baseBall;
    return Ball;
}());

function testBall() {
    var center1 = new Vector2(3, 4);
    var radius1 = 10;
    var ball1 = new Ball(center1, radius1, '#fff');
    console.assert(JSON.stringify(ball1.center) === JSON.stringify(center1) && ball1.radius === radius1 && ball1.color === '#fff', ball1.toString());

    var ball2 = ball1.clone();
    console.assert(JSON.stringify(ball1) === JSON.stringify(ball2));
}