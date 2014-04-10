var PowerUp = function() {

    ///////// public static variables / methods

    var types = {
        LASER: {
            character: 'L',
            color: {
                r: 255,
                g: 102,
                b: 102,
            },
            onActivate: function() {
                world.changeTemporaryPowerup(PowerUp.types.LASER);
            }
        },
        ENLARGE: {
            character: 'E',
            color: {
                r: 102,
                g: 178,
                b: 255,
            },
            onActivate: function() {
                world.changeTemporaryPowerup(PowerUp.types.ENLARGE);
                if (settings.sounds) sounds.longship.play();
            }
        },
        CATCH: {
            character: 'C',
            color: {
                r: 102,
                g: 255,
                b: 102,
            },
            onActivate: function() {
                world.changeTemporaryPowerup(PowerUp.types.CATCH);
            }
        },
        SLOW: {
            character: 'S',
            color: {
                r: 255,
                g: 178,
                b: 102,
            },
            onActivate: function() {
                world.ballSpeedMult = Math.max(0.5, world.ballSpeedMult - 0.25);
            }
        },
        DISRUPTION: {
            character: 'D',
            color: {
                r: 102,
                g: 255,
                b: 255,
            },
            onActivate: function() {
                // remove other current powerup
                world.changeTemporaryPowerup(null);

                var ball = world.balls[0];
                var rand;
                rand = randomFloat(-0.1, 0.1);
                world.balls.push(new Ball(ball.center.clone(), ball.radius, ball.speed, new Vector2(-1 + rand, -1), ball.color));

                world.balls[1].trail.reset(true);

                rand = randomFloat(-0.1, 0.1);
                world.balls.push(new Ball(ball.center.clone(), ball.radius, ball.speed, new Vector2(1 + rand, -1), ball.color));

                world.balls[2].trail.reset(true);
            }
        },
        PLAYER: {
            character: 'P',
            color: {
                r: 192,
                g: 192,
                b: 192,
            },
            onActivate: function() {
                if (world.paddle.life >= 5) {
                    world.score += 200;
                } else {
                    world.paddle.life += 1;
                }
                if (settings.sounds) sounds.life.play();
            }
        },
    };

    ///////// public methods

    var render = function() {
        g.save();
        g.translate(this.center.x, this.center.y);

        g.save();

        if (settings.colors) {
            g.shadowBlur = 3;
            g.shadowColor = 'rgb(0, 0, 0)';
            g.shadowOffsetX = 3;
            g.shadowOffsetY = 3;
        }

        var rad = 5;
        g.moveTo(-(this.halfSize.x - rad), -this.halfSize.y);

        g.lineTo(+(this.halfSize.x - rad), -this.halfSize.y);
        g.arcTo(this.halfSize.x, -this.halfSize.y, this.halfSize.x, -(this.halfSize.y - rad), rad);
        g.lineTo(this.halfSize.x, (this.halfSize.y - rad));
        g.arcTo(this.halfSize.x, this.halfSize.y, this.halfSize.x - rad, this.halfSize.y, rad);
        g.lineTo(-(this.halfSize.x - rad), this.halfSize.y);
        g.arcTo(-this.halfSize.x, this.halfSize.y, -this.halfSize.x, this.halfSize.y - rad, rad);
        g.lineTo(-this.halfSize.x, -(this.halfSize.y - rad));
        g.arcTo(-this.halfSize.x, -this.halfSize.y, -(this.halfSize.x - rad), -this.halfSize.y, rad);

        g.fillStyle = settings.colors ? getColorString(this.color) : getColorString({
            r: 255,
            g: 255,
            b: 255,
        });
        g.fill();

        g.restore();

        g.font = ((this.halfSize.y - 4) * 2) + 'px emulogic';
        g.textAlign = 'center';
        g.textBaseline = 'middle';
        var charcolor = this.character === 'P' ? getColorString({
            r: 102,
            g: 255,
            b: 255,
        }) : getColorString({
            r: 255,
            g: 255,
            b: 102,
        });
        g.fillStyle = settings.colors ? charcolor : 'rgba(0, 0, 0, 1)';
        g.fillText(this.character, 0, 0);

        if (settings.colors) {
            g.strokeStyle = settings.colors ? charcolor : 'rgba(0, 0, 0, 1)';
            g.strokeText(this.character, 0, 0);
        }

        g.restore();
    };

    var update = function(delta) {
        // move the powerup down
        this.center.y = this.center.y + (100 * delta) / 1000;
    };

    ///////// constructor

    var constructor = function PowerUp(center, halfSize, type) {
        // public methods
        this.render = render;
        this.update = update;

        // init
        this.center = center;
        this.halfSize = halfSize;
        this.color = type.color;
        this.character = type.character;
        this.onActivate = type.onActivate;
    };

    constructor.prototype = {
        set center(value) {
            console.assert(isInstanceOf(value, Vector2), JSON.stringify(value));
            this._center = value;
        },
        get center() {
            return this._center;
        },

        set halfSize(value) {
            console.assert(isInstanceOf(value, Vector2), JSON.stringify(value));
            this._halfSize = value;
        },
        get halfSize() {
            return this._halfSize;
        },
    };

    constructor.types = types;

    return constructor;
}();

function testPowerUp() {
    // TODO

    console.log('testPowerUp OK');
}