var Particle = function() {
    var shapes = {
        SMALL_RECTANGLE: {
            render: function() {
                g.globalAlpha = this.life / this._initialLife;

                g.fillStyle = settings.colors ? getColorString(this.color) : getColorString({
                    r: 255,
                    g: 255,
                    b: 255,
                });
                g.fillRect(this.position.x - 2, this.position.y - 2, 4, 4);
            }
        },
        MEDIUM_RECTANGLE: {
            render: function() {
                g.globalAlpha = this.life / this._initialLife;

                g.fillStyle = settings.colors ? getColorString(this.color) : getColorString({
                    r: 255,
                    g: 255,
                    b: 255,
                });
                g.fillRect(this.position.x - 4, this.position.y - 4, 8, 8);
            }
        },
        FIREWORK: {
            render: function() {
                g.fillStyle = settings.colors ? getColorString(this.color) : getColorString({
                    r: 255,
                    g: 255,
                    b: 255,
                });
                g.fillRect(this.position.x - 2, this.position.y - 2, 4, 4);
            }
        },
    };

    var spawn = function(container, position, speed, baseAngle, spreadAngle, count, life, shape, color, callback) {
        if (settings.particles) {
            var hslColor = rgbToHsl(color);

            for (var i = 0; i < count; i++) {
                var angle = randomFloat(baseAngle - spreadAngle / 2, baseAngle + spreadAngle / 2);
                var particleVelocity = new Vector2(randomFloat(speed.x) * Math.cos(angle), randomFloat(speed.y) * Math.sin(angle));
                var particleAcceleration = new Vector2(0, 110);
                var particleLife = life;
                var particleColor = (i % 2 === 0) ? {
                    h: hslColor.h,
                    s: hslColor.s,
                    l: hslColor.l + 30 * i / count,
                } : {
                    h: hslColor.h,
                    s: hslColor.s,
                    l: hslColor.l - 30 * i / count,
                };
                var particle = new Particle(new Vector2(position.x, position.y), particleVelocity, particleAcceleration, particleLife, shape, particleColor, callback);
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
        if (this.life > 0) {
            this.life -= delta;
            if (this.life <= 0) {
                if (this._callback !== undefined) {
                    this._callback(this);
                }
            }
        }

        this._tmpVector.set(this.acceleration);
        this.velocity.add(this._tmpVector.mul(delta / 1000));

        this._tmpVector.set(this.velocity);
        this.position.add(this._tmpVector.mul(delta / 1000));
    };


    var constructor = function Particle(position, velocity, acceleration, life, shape, color, callback) {
        this.position = position;
        this.velocity = velocity;
        this.acceleration = acceleration;
        this.life = life;
        this._initialLife = life;
        this.shape = shape;
        this.color = color;
        this._callback = callback;
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
            console.assert(isColor(value), JSON.stringify(value));
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
    var color1 = {
        r: 1,
        g: 43,
        b: 32,
    };
    var particle1 = new Particle(position1, velocity1, acceleration1, life1, shape1, color1);
    console.assert(JSON.stringify(particle1.position) === JSON.stringify(position1) && JSON.stringify(particle1.velocity) === JSON.stringify(velocity1) && JSON.stringify(particle1.acceleration) === JSON.stringify(acceleration1) && particle1.life === life1 && JSON.stringify(particle1.shape) === JSON.stringify(shape1) && JSON.stringify(particle1.color) === JSON.stringify(color1), JSON.stringify(particle1));

    console.log('testParticle OK');
}