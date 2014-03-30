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


    var constructor = function Particle(position, velocity, acceleration, life, color) {
        this.position = position;
        this.velocity = velocity;
        this.acceleration = acceleration;
        this.life = life;
        this.initialLife = life;
        this.color = color;
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
    var position1 = new Vector2(4, 5);
    var velocity1 = new Vector2(7, 6);
    var acceleration1 = new Vector2(3, 4);
    var life1 = 4000;
    var color1 = '#abc';
    var particle1 = new Particle(position1, velocity1, acceleration1, life1, color1);
    console.assert(JSON.stringify(particle1.position) === JSON.stringify(position1) && JSON.stringify(particle1.velocity) === JSON.stringify(velocity1) && JSON.stringify(particle1.acceleration) === JSON.stringify(acceleration1) && particle1.life === life1 && particle1.color === color1, JSON.stringify(particle1));

    console.log('testParticle OK');
}