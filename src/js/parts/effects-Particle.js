var Particle = function() {

    ///////// public static methods / variables

    var shapes = {
        SMALL_RECTANGLE: {
            render: function() {
                //g.globalAlpha = this.life / this._initialLife;
                g.globalAlpha = easing.easeInQuart(this._initialLife - this.life, 1, -1, this._initialLife);

                g.fillStyle = settings.colors ? getColorString(this.color) : 'white';
                g.fillRect(this.position.x - 1, this.position.y - 1, 2, 2);
            }
        },
        MEDIUM_RECTANGLE: {
            render: function() {
                //g.globalAlpha = this.life / this._initialLife;
                g.globalAlpha = easing.easeInQuart(this._initialLife - this.life, 1, -1, this._initialLife);

                g.fillStyle = 'rgba(0, 0, 0, 0.5)';
                g.fillRect(this.position.x - 1, this.position.y - 1, 4, 4);

                g.fillStyle = settings.colors ? getColorString(this.color) : 'white';
                g.fillRect(this.position.x - 2, this.position.y - 2, 4, 4);
            }
        },
        BIG_RECTANGLE: {
            render: function() {
                //g.globalAlpha = this.life / this._initialLife;
                g.globalAlpha = easing.easeInQuart(this._initialLife - this.life, 1, -1, this._initialLife);

                g.fillStyle = 'rgba(0, 0, 0, 0.5)';
                g.fillRect(this.position.x - 3, this.position.y - 3, 8, 8);

                g.fillStyle = settings.colors ? getColorString(this.color) : 'white';
                g.fillRect(this.position.x - 4, this.position.y - 4, 8, 8);
            }
        },
        SMALL_CIRCLE: {
            render: function() {
                g.globalAlpha = easing.easeInQuart(this._initialLife - this.life, 1, -1, this._initialLife);

                g.beginPath();
                g.fillStyle = 'rgba(0, 0, 0, 0.5)';
                g.arc(this.position.x + 1, this.position.y, 1+1, 0, 2 * Math.PI);
                g.fill();
                g.closePath();

                g.beginPath();
                g.fillStyle = settings.colors ? getColorString(this.color) : 'white';
                g.arc(this.position.x, this.position.y, 1, 0, 2 * Math.PI);
                g.fill();
                g.closePath();
            }
        },
        MEDIUM_CIRCLE: {
            render: function() {
                g.globalAlpha = easing.easeInQuart(this._initialLife - this.life, 1, -1, this._initialLife);

                g.beginPath();
                g.fillStyle = 'rgba(0, 0, 0, 0.5)';
                g.arc(this.position.x + 1, this.position.y+1, 2, 0, 2 * Math.PI);
                g.fill();
                g.closePath();

                g.beginPath();
                g.fillStyle = settings.colors ? getColorString(this.color) : 'white';
                g.arc(this.position.x, this.position.y, 2, 0, 2 * Math.PI);
                g.fill();
                g.closePath();
            }
        },
        FIREWORK: {
            render: function() {
                g.fillStyle = 'rgba(0, 0, 0, 0.5)';
                g.fillRect(this.position.x - 1, this.position.y - 1, 4, 4);

                g.fillStyle = settings.colors ? getColorString(this.color) : 'white';
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

    var spawnExplosion = function(container, brick) {
        if (settings.particles === false) return;

        for (var i = 0; i < 50; i++) {
            var rx = randomInt(-brick.halfSize.x, brick.halfSize.x);
            var ry = randomInt(-brick.halfSize.y, brick.halfSize.y);
            var position = new Vector2(brick.center.x + rx, brick.center.y + ry);

            var velocity = new Vector2(2 * rx, 2 * ry);

            var acceleration = new Vector2(0, 110);

            var life = 1500 + randomInt(-200, 200);

            var shape;
            if (i % 10 < 6) {
                shape = Particle.shapes.BIG_RECTANGLE;
            } else {
                shape = Particle.shapes.MEDIUM_RECTANGLE;
            }

            var hslColor = rgbToHsl(brick.color);
            hslColor.l += randomInt(-10, 11);

            container.push(new Particle(position, velocity, acceleration, life, shape, hslColor));
        }
    };

    var spawnCollisionEffect = function(container, posX, posY, dirX, dirY, color) {
        if (settings.particles === false) return;

        for (var i = 0; i < 10; i++) {
            var position = new Vector2(posX, posY);
            var dir = Math.atan2(dirY, dirX) + randomFloat(-0.3, 0.3);
            var spd = randomInt(200);
            var velocity = new Vector2(Math.cos(dir) * spd, Math.sin(dir) * spd);
            var acceleration = new Vector2(0, 110);
            var life = 750 + randomInt(-100, 100);
            var shape = i < 5 ? Particle.shapes.MEDIUM_RECTANGLE : Particle.shapes.SMALL_RECTANGLE;

            var hslColor = rgbToHsl(color);
            hslColor.l += randomInt(-10, 11);
            var drag = 2;

            container.push(new Particle(position, velocity, acceleration, life, shape, hslColor, undefined, drag));
        }
    };

    var spawnVictoryFireworks = function(container) {
        if (settings.particles === false) return;

        var callback = function(parent) {
            for (var i = 0; i < 50; i++) {
                var position = parent.position.clone();
                var angle = randomFloat(Math.PI * 2);
                var velocity = new Vector2(randomInt(200) * Math.sin(angle), randomInt(200) * Math.cos(angle));
                var acceleration = new Vector2(0, 110);
                var life = 1500 + randomInt(-200, 200);
                var shape = i % 2 === 0 ? Particle.shapes.MEDIUM_CIRCLE : Particle.shapes.SMALL_CIRCLE;
                var color = {
                    h: parent.color.h,
                    s: parent.color.s,
                    l: parent.color.l + randomInt(-10, 11),
                };
                var drag = 2;

                container.push(new Particle(position, velocity, acceleration, life, shape, color, undefined, drag));
            }
        };
        for (var i = 0; i < 2; i++) {
            var position = new Vector2(0, constants.worldRelativeHeight);
            var velocity = new Vector2(randomInt(20, 400), -randomInt(300, 600));
            var acceleration = new Vector2(0, 110);
            var life = 1000 + randomInt(-200, 200);
            var shape = Particle.shapes.FIREWORK;
            var color = {
                h: randomInt(12) * 30,
                s: 100,
                l: 50,
            };
            container.push(new Particle(position, velocity, acceleration, life, shape, color, callback));

            position = new Vector2(constants.worldRelativeWidth, constants.worldRelativeHeight);
            velocity = new Vector2(-randomInt(20, 400), -randomInt(300, 600));
            life = 1000 + randomInt(-200, 200);
            color = {
                h: randomInt(12) * 30,
                s: 100,
                l: 50,
            };
            container.push(new Particle(position, velocity, acceleration, life, shape, color, callback));
        }
    };

    ///////// public methods

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
        // calculate drag
        this.velocity.x = this.velocity.x * Math.exp(-this.drag * (delta / 1000));
        this.velocity.y = this.velocity.y * Math.exp(-this.drag * (delta / 1000));

        this._tmpVector.set(this.velocity);
        this.position.add(this._tmpVector.mul(delta / 1000));
    };

    ///////// constructor

    var constructor = function Particle(position, velocity, acceleration, life, shape, color, callback, drag) {
        // public methods
        this.render = render;
        this.update = update;

        // init
        this.position = position;
        this.velocity = velocity;
        this.acceleration = acceleration;
        this.life = life;
        this._initialLife = life;
        this.shape = shape;
        this.color = color;
        this.drag = drag || 0;
        this._callback = callback;
        this._tmpVector = new Vector2(0, 0);
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
    constructor.spawnExplosion = spawnExplosion;
    constructor.spawnVictoryFireworks = spawnVictoryFireworks;
    constructor.spawnCollisionEffect = spawnCollisionEffect;


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