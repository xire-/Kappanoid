var PowerUp = function() {
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
                world.balls.forEach(function(ball) {
                    ball.speed = Math.max(225, ball.speed * 0.75);
                });
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
                world.balls.push(new Ball(ball.center.clone(), ball.radius, ball.speed, new Vector2(-1 + rand, -1), constants.ballColor));

                world.balls[1].resetTrail();
                world.balls[1].stoppedMovingDate = null;
                world.balls[1].stoppedMovingPosition = null;

                rand = randomFloat(-0.1, 0.1);
                world.balls.push(new Ball(ball.center.clone(), ball.radius, ball.speed, new Vector2(1 + rand, -1), constants.ballColor));

                world.balls[2].resetTrail();
                world.balls[2].stoppedMovingDate = null;
                world.balls[2].stoppedMovingPosition = null;
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
            }
        },
    };

    var render = function() {
        g.save();
        g.translate(this.center.x, this.center.y);
        g.beginPath();
        g.rect(-this.halfSize.x, -this.halfSize.y, this.halfSize.x * 2, this.halfSize.y * 2);
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


    var constructor = function PowerUp(center, halfSize, type) {
        this.center = center;
        this.halfSize = halfSize;
        this.color = type.color;
        this.character = type.character;
        this.onActivate = type.onActivate;

        this.render = render;
        this.update = update;
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

}