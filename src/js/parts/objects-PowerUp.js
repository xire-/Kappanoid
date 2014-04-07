var PowerUp = function() {

    ///////// public static methods / variables

    var types = {
        LASER: {
            character: 'L',
            color: 'red',
            onActivate: function() {
                world.changeTemporaryPowerup(PowerUp.types.LASER);
            }
        },
        ENLARGE: {
            character: 'E',
            color: 'blue',
            onActivate: function() {
                world.changeTemporaryPowerup(PowerUp.types.ENLARGE);
                if (settings.sounds) sounds.longship.play();
            }
        },
        CATCH: {
            character: 'C',
            color: 'green',
            onActivate: function() {
                world.changeTemporaryPowerup(PowerUp.types.CATCH);
            }
        },
        SLOW: {
            character: 'S',
            color: 'orange',
            onActivate: function() {
                world.ballSpeedMult = Math.max(0.5, world.ballSpeedMult - 0.25);
            }
        },
        DISRUPTION: {
            character: 'D',
            color: 'cyan',
            onActivate: function() {
                // remove other current powerup
                world.changeTemporaryPowerup(null);

                var ball = world.balls[0];
                var rand;
                rand = randomFloat(-0.1, 0.1);
                world.balls.push(new Ball(ball.center.clone(), ball.radius, ball.speed, new Vector2(-1 + rand, -1), ball.color));

                world.balls[1].trail.reset();
                world.balls[1].trail.stoppedMovingDate = null;
                world.balls[1].trail.stoppedMovingPosition = null;

                rand = randomFloat(-0.1, 0.1);
                world.balls.push(new Ball(ball.center.clone(), ball.radius, ball.speed, new Vector2(1 + rand, -1), ball.color));

                world.balls[2].trail.reset();
                world.balls[2].trail.stoppedMovingDate = null;
                world.balls[2].trail.stoppedMovingPosition = null;
            }
        },
        PLAYER: {
            character: 'P',
            color: 'gray',
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
        g.beginPath();
        g.shadowBlur = 3;
        g.shadowColor = 'black';
        g.shadowOffsetX = 3;
        g.shadowOffsetY = 3;

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

        g.fillStyle = settings.colors ? this.color : '#FFFFFF';
        g.fill();

        g.font = ((this.halfSize.y - 1) * 2) + 'px emulogic';
        g.textAlign = 'center';
        g.textBaseline = 'middle';
        var charcolor = this.character === 'P' ? 'cyan' : 'yellow';
        g.fillStyle = settings.colors ? charcolor : '#000000';
        g.fillText(this.character, 0, 0);

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
            console.assert(value !== undefined && value instanceof Vector2, JSON.stringify(value));
            this._center = value;
        },
        get center() {
            return this._center;
        },

        set halfSize(value) {
            console.assert(value !== undefined && value instanceof Vector2, JSON.stringify(value));
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