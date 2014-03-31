var Particle = function() {
    var shapes = {
        SMALL_RECTANGLE: {
            render: function() {
                g.globalAlpha = this.life / this._initialLife;

                g.fillStyle = settings.colors ? this.color : '#FFFFFF';
                g.fillRect(this.position.x - 2, this.position.y - 2, 4, 4);
            }
        },
        MEDIUM_RECTANGLE: {
            render: function() {
                g.globalAlpha = this.life / this._initialLife;

                g.fillStyle = settings.colors ? this.color : '#FFFFFF';
                g.fillRect(this.position.x - 4, this.position.y - 4, 8, 8);
            }
        },
    };

    var spawn = function(container, position, baseAngle, spreadAngle, count, shape, color) {
        if (settings.particles) {
            for (var i = 0; i < count; i++) {
                var angle = randomFloat(baseAngle - spreadAngle / 2, baseAngle + spreadAngle / 2);
                var particleSpeedX = randomInt(60, 110) * -Math.cos(angle);
                var particleSpeedY = randomInt(80, 110) * -Math.sin(angle);
                var particleGravity = 110;
                var particleLife = 3000;
                var particleColor = (i % 2 === 0) ? shadeColor(color, 5 * i) : shadeColor(color, -5 * i);
                var particle = new Particle(new Vector2(position.x, position.y), new Vector2(particleSpeedX, particleSpeedY), new Vector2(0, particleGravity), particleLife, shape, particleColor);
                container.push(particle);
            }
        }
    };

    var render = function() {
        g.save();

        this.shape.render.call(this);

        g.restore();
    };

    var update = function(delta) {
        this.life -= delta;

        this._tmpVector.set(this.acceleration);
        this.velocity.add(this._tmpVector.mul(delta / 1000));

        this._tmpVector.set(this.velocity);
        this.position.add(this._tmpVector.mul(delta / 1000));
    };


    var constructor = function Particle(position, velocity, acceleration, life, shape, color) {
        this.position = position;
        this.velocity = velocity;
        this.acceleration = acceleration;
        this.life = life;
        this._initialLife = life;
        this.shape = shape;
        this.color = color;
        this._tmpVector = new Vector2(0, 0);

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

        set life(value) {
            console.assert(value !== undefined && typeof value == 'number', JSON.stringify(value));
            this._life = value;
        },
        get life() {
            return this._life;
        },

        set shape(value) {
            console.assert(value !== undefined && value.render !== undefined, JSON.stringify(value));
            this._shape = value;
        },
        get shape() {
            return this._shape;
        },

        set color(value) {
            console.assert(value !== undefined && typeof value == 'string', JSON.stringify(value));
            this._color = value;
        },
        get color() {
            return this._color;
        },
    };

    constructor.shapes = shapes;
    constructor.spawn = spawn;
    return constructor;
}();

function testParticle() {
    var position1 = new Vector2(4, 5);
    var velocity1 = new Vector2(7, 6);
    var acceleration1 = new Vector2(3, 4);
    var life1 = 4000;
    var shape1 = Particle.shapes.SMALL_RECTANGLE;
    var color1 = '#abc';
    var particle1 = new Particle(position1, velocity1, acceleration1, life1, shape1, color1);
    console.assert(JSON.stringify(particle1.position) === JSON.stringify(position1) && JSON.stringify(particle1.velocity) === JSON.stringify(velocity1) && JSON.stringify(particle1.acceleration) === JSON.stringify(acceleration1) && particle1.life === life1 && JSON.stringify(particle1.shape) === JSON.stringify(shape1) && particle1.color === color1, JSON.stringify(particle1));

    console.log('testParticle OK');
}