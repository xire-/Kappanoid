var Ball = function() {
    var _render = function(g) {
        g.save();
        g.fillStyle = this.color;
        g.beginPath();
        g.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI);
        g.fill();
        g.restore();
    };

    var _update = function(delta) {
        this.center.add(this.velocity.clone().mul(delta / 1000));
    };

    var _clone = function() {
        return new Ball(this.center, this.radius, this.velocity, this.color);
    };

    var _toString = function() {
        return 'Ball(center: ' + this.center + ', radius: ' + this.radius + ', velocity' + this.velocity + ', color: ' + this.color + ')';
    };


    var constructor = function Ball(center, radius, velocity, color) {
        console.assert(center !== undefined && center instanceof Vector2, center.toString());
        this.center = center;

        console.assert(radius !== undefined && typeof radius == 'number', radius.toString());
        this.radius = radius;

        console.assert(velocity !== undefined && velocity instanceof Vector2, velocity.toString());
        this.velocity = velocity;

        console.assert(color !== undefined && typeof color == 'string', color.toString());
        this.color = color;

        this.render = _render;
        this.update = _update;
        this.clone = _clone;
        this.toString = _toString;
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