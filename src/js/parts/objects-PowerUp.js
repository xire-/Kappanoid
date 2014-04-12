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
            },
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
            },
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
            },
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
            },
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

                world.balls.push(new Ball(ball.center.clone(), ball.radius, ball.speed, new Vector2(-1 + randomFloat(-0.1, 0.1), -1), ball.color));
                world.balls[1].trail.reset(true);

                world.balls.push(new Ball(ball.center.clone(), ball.radius, ball.speed, new Vector2(1 + randomFloat(-0.1, 0.1), -1), ball.color));
                world.balls[2].trail.reset(true);
            },
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

        // draw power-up shape
        // need to save context for shadows
        g.save();

        if (settings.colors) {
            g.shadowBlur = 3;
            g.shadowColor = 'rgba(0, 0, 0, 1)';
            g.shadowOffsetX = 3;
            g.shadowOffsetY = 3;
        }

        g.beginPath();
        g.moveTo(-(this.halfSize.x - radius), -this.halfSize.y);

        var radius = 5;
        g.lineTo(+(this.halfSize.x - radius), -this.halfSize.y);
        g.arcTo(this.halfSize.x, -this.halfSize.y, this.halfSize.x, -(this.halfSize.y - radius), radius);
        g.lineTo(this.halfSize.x, (this.halfSize.y - radius));
        g.arcTo(this.halfSize.x, this.halfSize.y, this.halfSize.x - radius, this.halfSize.y, radius);
        g.lineTo(-(this.halfSize.x - radius), this.halfSize.y);
        g.arcTo(-this.halfSize.x, this.halfSize.y, -this.halfSize.x, this.halfSize.y - radius, radius);
        g.lineTo(-this.halfSize.x, -(this.halfSize.y - radius));
        g.arcTo(-this.halfSize.x, -this.halfSize.y, -(this.halfSize.x - radius), -this.halfSize.y, radius);

        g.fillStyle = settings.colors ? getColorString(this._color) : 'rgba(255, 255, 255, 1)';
        g.fill();
        g.closePath();

        g.restore();

        // draw power-up character
        g.font = ((this.halfSize.y - 4) * 2) + 'px emulogic';
        g.textAlign = 'center';
        g.textBaseline = 'middle';

        var characterColor = this._character === 'P' ? 'rgba(102, 255, 255, 1)' : 'rgba(255, 255, 102, 1)';
        g.fillStyle = settings.colors ? characterColor : 'rgba(0, 0, 0, 1)';
        g.fillText(this._character, 0, 0);
        if (settings.colors) {
            g.strokeStyle = settings.colors ? characterColor : 'rgba(0, 0, 0, 1)';
            g.strokeText(this._character, 0, 0);
        }

        g.restore();
    };

    var update = function(delta) {
        // move the power-up down
        this.center.y = this.center.y + (100 * delta) / 1000;
    };

    ///////// constructor

    var constructor = function PowerUp(center, halfSize, type) {
        // public methods
        this.onActivate = type.onActivate;
        this.render = render;
        this.update = update;

        // init
        this.center = center;
        this.halfSize = halfSize;

        this._color = type.color;
        this._character = type.character;
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