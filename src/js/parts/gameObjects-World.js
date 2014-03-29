var World = function() {
    var reset = function() {
        // reset intro animation parameters
        timePassed = 0;
        brickSecsOff = [];

        this.render = renderIntro;
        this.update = updateIntro;

        this.balls = [];
        this.balls.push(new Ball(new Vector2(400, 500), 7, 300, new Vector2(1, -1), settings.ballDefaultColor));
        this.balls.push(new Ball(new Vector2(90, 57 - 20), 7, 300, new Vector2(1, 2), settings.ballDefaultColor));
        this.balls.push(new Ball(new Vector2(123, 456), 7, 300, new Vector2(-1, -1), settings.ballDefaultColor));

        this.bricks = [];
        var blockHalfSize = new Vector2(25, 10);
        for (var i = 0; i < 10; i++) {
            for (var j = 0; j < 8; j++) {
                // randomize falling animation offset
                brickSecsOff.push(randomInt(300));

                var blockCenter = new Vector2(
                    105 + blockHalfSize.x + i * (blockHalfSize.x * 2 + 10),
                    30 + 47 + j * (blockHalfSize.y * 2 + 10)
                );
                var life = randomInt(1, 5);
                this.bricks.push(new Brick(blockCenter, blockHalfSize, life, settings.brickDefaultColor));
            }
        }

        var paddleHalfSize = new Vector2(50, 15);
        this.paddle = new Paddle(new Vector2(800 / 2, 600 + paddleHalfSize.y * 2 / 2 - 50), paddleHalfSize, 1, settings.paddleDefaultColor);

        this.particles = [];
    };

    var drawEmptyWorld = function() {
        // render borders (as background)
        if (settings.colors) {
            g.fillStyle = this.bordersColor;
        } else {
            g.fillStyle = '#fff';
        }
        g.fillRect(0, 0, this.containerSize.x + this.containerOffset.x * 2, this.containerSize.y + this.containerOffset.y);

        // translate to render the world area
        g.translate(this.containerOffset.x, this.containerOffset.y);

        // clip the region
        g.beginPath();
        g.rect(0, 0, this.containerSize.x, this.containerSize.y);
        g.clip();

        // render background
        if (settings.colors) {
            g.fillStyle = this.backgroundColor;
        } else {
            g.fillStyle = '#000';
        }
        g.fillRect(0, 0, this.containerSize.x, this.containerSize.y);
    };

    // INTRO STATE ////////////////////////////////////////////////////////////

    var timePassed = 0;
    var brickSecsOff;
    var renderIntro = function() {
        g.save();

        var tx = this.containerSize.x / 2 + this.containerOffset.x;
        var ty = (this.containerSize.y + this.containerOffset.y) / 2;
        var animScale = easing.easeOutBack(clamp(0, timePassed, 1000), 0, 1, 1000);

        g.translate(tx, ty);
        g.scale(animScale, animScale);
        g.rotate(animScale * Math.PI * 2);
        g.translate(-tx, -ty);

        drawEmptyWorld.call(this);

        g.restore();
    };

    var renderIntroFalling = function() {
        g.save();

        drawEmptyWorld.call(this);


        this.bricks.forEach(function(brick, i) {
            g.save();

            var offy = easing.easeOutBack(clamp(0, -brickSecsOff[i] + timePassed - 1000, 1000), -1, 1, 1000);
            g.translate(0, 500 * offy);

            brick.render();
            g.restore();
        });

        g.globalAlpha = easing.easeInQuad(clamp(0, timePassed - 2300, 700), 0, 1, 700);

        // render balls and paddle
        this.balls.forEach(function(ball) {
            ball.render();
        });

        this.paddle.render();

        g.restore();
    };

    var updateIntro = function(delta) {
        timePassed += delta;

        if (timePassed < 1000) {
            // [0, 1000) zoom in with rotation
        } else if (timePassed < 2300) {
            // [1000, 2300) falling bricks
            this.render = renderIntroFalling;
        } else if (timePassed < 3000) {
            // [2300, 3000) paddle and balls fade in
        } else {
            // >3000 end of animation, transition to next state
            this.render = renderPlaying;
            this.update = updatePlaying;
        }

        // update paddle position (clamped)
        this.paddle.center.x = Math.min(Math.max(mousePos.x - this.containerOffset.x, 0 + this.paddle.halfSize.x), 800 - this.paddle.halfSize.x);

    };

    // PLAYING STATE //////////////////////////////////////////////////////////

    var renderPlaying = function() {
        g.save();

        drawEmptyWorld.call(this);

        // render balls, bricks and paddle
        this.balls.forEach(function(ball) {
            ball.render();
        });

        this.bricks.forEach(function(brick) {
            brick.render();
        });

        this.paddle.render();

        // render particles
        this.particles.forEach(function(particle) {
            particle.render(g);
        });

        g.restore();
    };

    var updatePlaying = function(delta) {
        if (delta === 0) {
            return;
        }

        // update single components
        this.balls.forEach(function(ball) {
            ball.update(delta);
        });
        this.bricks.forEach(function(brick) {
            brick.update(delta);
        });
        this.paddle.update(delta);

        // compute interaction between components

        // update paddle position (clamped)
        this.paddle.center.x = Math.min(Math.max(mousePos.x - this.containerOffset.x, 0 + this.paddle.halfSize.x), 800 - this.paddle.halfSize.x);

        handleBallBordersCollisions.call(this);
        handleBallPaddleCollisions.call(this);
        handleBallBrickCollisions.call(this);

        // update particles
        var deadParticles = [];
        this.particles.forEach(function(particle, i) {
            particle.update(delta);
            if (particle.life <= 0) {
                deadParticles.push(i);
            }
        }, this);

        for (var i = deadParticles.length - 1; i >= 0; i--) {
            var index = deadParticles[i];
            this.particles.splice(index, 1);
        }
    };

    // COLLISIONS /////////////////////////////////////////////////////////////

    var handleBallBordersCollisions = function() {
        this.balls.forEach(function(ball) {
            // check and handle collisions with borders
            if (ball.center.x - ball.radius < 0) {
                ball.center.x = -ball.center.x + ball.radius * 2;
                ball.direction.x *= -1;
            }
            if (ball.center.y - ball.radius < 0) {
                ball.center.y = -ball.center.y + ball.radius * 2;
                ball.direction.y *= -1;
            }
            if (ball.center.x + ball.radius >= 800) {
                ball.center.x = 799 * 2 - ball.center.x - ball.radius;
                ball.direction.x *= -1;
            }
            if (ball.center.y + ball.radius >= 600) {
                ball.center.y = 599 * 2 - ball.center.y - ball.radius;
                ball.direction.y *= -1;
            }
        }, this);
    };

    var handleBallPaddleCollisions = function() {
        var deadBalls = [];
        this.balls.forEach(function(ball, i) {
            // check ball vs bottom and paddle
            if (ball.center.y + ball.radius >= this.paddle.center.y - this.paddle.halfSize.y) {
                // if it's actualy going down
                if (ball.direction.y > 0) {
                    var collisionPoint = collisionDetection.testSphereAABB(ball, this.paddle);
                    if (collisionPoint !== null) {
                        // determine resultant direction based on collisionPoint
                        var angle = (collisionPoint.x - this.paddle.center.x) / this.paddle.halfSize.x;
                        ball.direction.x = Math.sin(angle);
                        ball.direction.y = -Math.cos(angle);

                        if (settings.particles) {
                            for (var p = 0; p < 4; p++) {
                                var particleAngle = (p % 2 === 0) ? randomFloat(Math.PI / 4, Math.PI / 2) : randomFloat(Math.PI / 2, Math.PI * 3 / 4);
                                var particleSpeedX = -randomInt(60, 110);
                                var particleSpeedY = -randomInt(80, 110);
                                var particleGravity = 110;
                                var particleLife = 3000;
                                this.particles.push(new Particle(new Vector2(collisionPoint.x, collisionPoint.y), new Vector2(particleSpeedX * Math.cos(particleAngle), particleSpeedY * Math.sin(particleAngle)), new Vector2(0, particleGravity), '#fff', particleLife));
                            }
                        }
                    }
                }

                // check if ball is dead
                if (ball.center.y >= this.paddle.center.y + this.paddle.halfSize.y) {
                    // ball is dead
                    deadBalls.push(i);
                }
            }
        }, this);

        for (var i = deadBalls.length - 1; i >= 0; i--) {
            var index = deadBalls[i];
            // ball.die();
            this.balls.splice(index, 1);
        }
    };

    var handleBallBrickCollisions = function() {
        this.balls.forEach(function(ball) {
            // TODO get closer bricks from pruning structure
            var closerBricks = this.bricks;
            var hitBricks = [];
            var tmpVec = new Vector2(0, 0);

            closerBricks.forEach(function(brick, index) {
                var collisionPoint = collisionDetection.testSphereAABB(ball, brick);
                if (collisionPoint !== null) {
                    var xColl = collisionPoint.x == brick.center.x - brick.halfSize.x || collisionPoint.x == brick.center.x + brick.halfSize.x;
                    var yColl = collisionPoint.y == brick.center.y - brick.halfSize.y || collisionPoint.y == brick.center.y + brick.halfSize.y;

                    if (xColl && yColl) {
                        tmpVec.set(brick.center).sub(collisionPoint);
                        var xDir = ball.direction.x * tmpVec.x > 0;
                        var yDir = ball.direction.y * tmpVec.y > 0;
                        if (xDir && yDir) {
                            var ang = Math.atan2(-ball.direction.x, -ball.direction.y);
                            ang = ang + randomFloat(-0.25, 0.25);
                            ball.direction.x = Math.cos(ang);
                            ball.direction.y = Math.sin(ang);
                        } else {
                            if (xDir) {
                                ball.direction.x *= -1;
                            } else {
                                ball.direction.y *= -1;
                            }
                        }

                    } else {
                        if (xColl) {
                            ball.direction.x *= -1;
                        } else if (yColl) {
                            ball.direction.y *= -1;
                        }
                    }

                    hitBricks.push(index);

                    if (settings.particles) {
                        for (var p = 0; p < 4; p++) {
                            var particleAngle = (p % 2 === 0) ? randomFloat(Math.PI / 4, Math.PI / 2) : randomFloat(Math.PI / 2, Math.PI * 3 / 4);
                            var particleSpeedX = -randomInt(60, 110);
                            var particleSpeedY = -randomInt(80, 110);
                            var particleGravity = 110;
                            var particleLife = 3000;
                            this.particles.push(new Particle(new Vector2(collisionPoint.x, collisionPoint.y), new Vector2(particleSpeedX * Math.cos(particleAngle), particleSpeedY * Math.sin(particleAngle)), new Vector2(0, particleGravity), '#fff', particleLife));
                        }
                    }
                }
            }, this);

            for (var i = hitBricks.length - 1; i >= 0; i--) {
                var index = hitBricks[i];
                var brick = this.bricks[index];
                brick.hit();
                if (brick.life <= 0) {
                    this.bricks.splice(index, 1);
                }
            }
        }, this);
    };

    var constructor = function World(containerOffset, containerSize) {
        this.containerOffset = containerOffset;
        this.containerSize = containerSize;
        // TODO this.levelConf = levelConf;
        this.backgroundColor = settings.backgroundDefaultColor;
        this.bordersColor = settings.bordersDefaultColor;

        this.reset = reset;
        this.render = renderIntro;
        this.update = updateIntro;

        // initialize all game objects
        this.reset();
    };

    constructor.prototype = {
        set containerOffset(value) {
            console.assert(value !== undefined && value instanceof Vector2, JSON.stringify(value));
            this._containerOffset = value;
        },
        get containerOffset() {
            return this._containerOffset;
        },

        set containerSize(value) {
            console.assert(value !== undefined && value instanceof Vector2, JSON.stringify(value));
            this._containerSize = value;
        },
        get containerSize() {
            return this._containerSize;
        }
    };

    return constructor;
}();