var Particle = function() {
    var render = function() {
        g.save();

        g.fillStyle = '#fff';
        g.fillRect(this.position.x, this.position.y, 1, 1);

        g.restore();
    };

    var update = function(delta) {
        this.life -= delta;

        this.tmpVector2.set(this.acceleration);
        this.velocity.add(this.tmpVector2.mul(delta / 1000));

        this.tmpVector2.set(this.velocity);
        this.position.add(this.tmpVector2.mul(delta / 1000));
    };


    var constructor = function Particle(position, velocity, acceleration) {
        this.position = position;
        this.velocity = velocity;
        this.acceleration = acceleration;
        // TODO this.color = color;
        this.life = 2000; // milliseconds
        this.tmpVector2 = new Vector2(0, 0);

        this.render = render;
        this.update = update;
    };

    constructor.prototype = {
        set position(value) {
            console.assert(value !== undefined && value instanceof Vector2, JSON.stringify(value));
            this._position = value;
        },
        get position() {
            return this._position;
        },

        set velocity(value) {
            console.assert(value !== undefined && value instanceof Vector2, JSON.stringify(value));
            this._velocity = value;
        },
        get velocity() {
            return this._velocity;
        },

        set acceleration(value) {
            console.assert(value !== undefined && value instanceof Vector2, JSON.stringify(value));
            this._acceleration = value;
        },
        get acceleration() {
            return this._acceleration;
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

function testParticle() {
    // TODO
}