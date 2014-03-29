var Particle = function() {
    var render = function() {
        g.save();

        g.globalAlpha = this.life / this.initialLife;
        g.fillStyle = '#fff';
        g.fillRect(this.position.x - 2, this.position.y - 2, 4, 4);

        g.restore();
    };

    var update = function(delta) {
        this.life -= delta;

        this.tmpVector2.set(this.acceleration);
        this.velocity.add(this.tmpVector2.mul(delta / 1000));

        this.tmpVector2.set(this.velocity);
        this.position.add(this.tmpVector2.mul(delta / 1000));
    };


    var constructor = function Particle(position, velocity, acceleration, color, life) {
        this.position = position;
        this.velocity = velocity;
        this.acceleration = acceleration;
        this.color = color;
        this.life = life;
        this.initialLife = life;
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

        set life(value) {
            console.assert(value !== undefined && typeof value == 'number', JSON.stringify(value));
            this._life = value;
        },
        get life() {
            return this._life;
        },
    };

    return constructor;
}();

function testParticle() {
    // TODO
}