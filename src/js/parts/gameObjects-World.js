var World = function() {
    var reset = function(skipIntro) {
        // reset intro animation parameters
        this._timePassed = 0;
        this._brickMillisOffset = [];

        if (skipIntro) {
            this.render = renderPlaying;
            this.update = updatePrePlaying;
        } else {
            this.render = renderIntro;
            this.update = updateIntro;
        }

        this.balls = [];
        this.balls.push(new Ball(new Vector2(400, 600 - 50 - 7), 7, 0, new Vector2(0, -1), constants.ballColor));

        this.pruningGrid = new PruningGrid(new Vector2(20, 15), new Vector2(0, 0), new Vector2(800, 600), 7);

        this.bricks = [];
        levels[0].bricks.forEach(function(brick) {
            this.bricks.push(brick);
            this.pruningGrid.addAABB(brick);
        }, this);

        /*
        var blockHalfSize = new Vector2(25, 10);
        for (var i = 0; i < 10; i++) {
            for (var j = 0; j < 8; j++) {
                // randomize falling animation offset
                this._brickMillisOffset.push(randomInt(300));

                var blockCenter = new Vector2(
                    105 + blockHalfSize.x + i * (blockHalfSize.x * 2 + 10),
                    30 + 47 + j * (blockHalfSize.y * 2 + 10)
                );
                var life = randomInt(1, 5);

                var newBrick = new Brick(blockCenter, blockHalfSize, life, constants.brickColor);
                this.bricks.push(newBrick);
                this.pruningGrid.addAABB(newBrick);
            }
        }
        */

        var paddleHalfSize = new Vector2(50, 15);
        this.paddle = new Paddle(new Vector2(800 / 2, 600 + paddleHalfSize.y - 50), paddleHalfSize, 3, constants.paddleColor);

        this.particles = [];
    };

    var drawEmptyWorld = function() {
        // WARNING don't use save and restore here

        // render borders (as background)
        g.fillStyle = settings.colors ? this.bordersColor : '#FFFFFF';
        g.fillRect(0, 60, this.containerSize.x + constants.bordersRelativeThickness * 2, this.containerSize.y + constants.bordersRelativeThickness);

        // translate to render the world area
        g.translate(this.containerOffset.x, this.containerOffset.y);

        // clip the region
        g.beginPath();
        g.rect(0, 0, this.containerSize.x, this.containerSize.y);
        g.clip();

        // render background
        g.fillStyle = settings.colors ? this.backgroundColor : '#000000';
        g.fillRect(0, 0, this.containerSize.x, this.containerSize.y);
    };

    ///////// initial state

    var renderIntro = function() {
        g.save();

        var tx = this.containerSize.x / 2 + this.containerOffset.x;
        var ty = (this.containerSize.y + this.containerOffset.y) / 2;
        var animScale = easing.easeOutBack(clamp(0, this._timePassed, 1000), 0, 1, 1000);
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

            var offy = easing.easeOutBack(clamp(0, -this._brickMillisOffset[i] + this._timePassed - 1000, 1000), -1, 1, 1000);
            g.translate(0, 500 * offy);

            brick.render();

            g.restore();
        }, this);

        g.globalAlpha = easing.easeInQuad(clamp(0, this._timePassed - 2300, 700), 0, 1, 700);

        // render balls and paddle
        this.balls.forEach(function(ball) {
            ball.render();
        });

        this.paddle.render();

        g.restore();
    };

    var updateIntro = function(delta) {
        this._timePassed += delta;

        if (this._timePassed < 1000) {
            // [0, 1000) zoom in with rotation
        } else if (this._timePassed < 2300) {
            // [1000, 2300) falling bricks
            this.render = renderIntroFalling;
        } else if (this._timePassed < 3000) {
            // [2300, 3000) paddle and balls fade in
        } else {
            // >3000 end of animation, transition to next state
            this.render = renderPlaying;
            this.update = updatePrePlaying;
        }

        // update paddle position (clamped)
        this.paddle.center.x = Math.min(Math.max(mousePos.x - this.containerOffset.x, 0 + this.paddle.halfSize.x), 800 - this.paddle.halfSize.x);

        // bring balls along
        this.balls.forEach(function(ball) {
            ball.center.x = this.paddle.center.x;
        }, this);
    };

    ///////// playing state

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

    var updatePrePlaying = function(delta) {
        this._canReleaseBalls = true;

        // update single components
        this.balls.forEach(function(ball) {
            ball.update(delta);
        });

        this.bricks.forEach(function(brick) {
            brick.update(delta);
        });

        this.paddle.update(delta);

        // update paddle position (clamped)
        this.paddle.center.x = Math.min(Math.max(mousePos.x - this.containerOffset.x, 0 + this.paddle.halfSize.x), constants.worldRelativeWidth - this.paddle.halfSize.x);

        // bring balls along
        this.balls.forEach(function(ball) {
            ball.center.x = this.paddle.center.x;
        }, this);

        // update particles
        updateParticles.call(this, delta);
    };


    var renderRespawn = function() {
        g.save();

        drawEmptyWorld.call(this);

        // render balls, bricks and paddle
        if (clamp(0, this._timePassed - 2000, 2000) % 500 > 250) {
            this.balls.forEach(function(ball) {
                ball.render();
            });
        }

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

    var updateRespawn = function(delta) {
        this._timePassed += delta;

        // update single components
        this.balls.forEach(function(ball) {
            ball.update(delta);
        });

        this.bricks.forEach(function(brick) {
            brick.update(delta);
        });

        this.paddle.update(delta);

        // update paddle position (clamped)
        this.paddle.center.x = Math.min(Math.max(mousePos.x - this.containerOffset.x, 0 + this.paddle.halfSize.x), constants.worldRelativeWidth - this.paddle.halfSize.x);

        // bring balls along
        this.balls.forEach(function(ball) {
            ball.center.x = this.paddle.center.x;
        }, this);

        // update particles
        updateParticles.call(this, delta);

        if (this._timePassed > 4000) {
            this.update = updatePrePlaying;
            this.render = renderPlaying;
        }
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

        // peggle effect
        if (settings.lastBrickSlowMo) {
            if (this.bricks.length === 1) {
                var lastBrick = this.bricks[0];
                var distance;
                var ballNear = this.balls.some(function(ball) {
                    // check if ball is near the last brick
                    var brickPoint = collisionDetection.closestPtPointAABB(ball.center, lastBrick);
                    distance = ball.center.distance(brickPoint);
                    return distance <= 50;
                });

                // to slow or not to slow
                settings.timeScale = ballNear ? clamp(0.15, (distance-30) / 20, 1) : 1;
            }
        }

        this.paddle.update(delta);

        // update paddle position (clamped)
        this.paddle.center.x = Math.min(Math.max(mousePos.x - this.containerOffset.x, 0 + this.paddle.halfSize.x), constants.worldRelativeWidth - this.paddle.halfSize.x);

        handleBallBordersCollisions.call(this);
        handleBallPaddleCollisions.call(this);
        handleBallBrickCollisions.call(this);

        // level finished?
        if (this.bricks.length === 0) {
            // turn off peggle effect
            settings.timeScale = 1;

            this.render = renderLevelCompleted;
        }

        // update particles
        updateParticles.call(this, delta);
    };


    var releaseBalls = function() {
        if (this._canReleaseBalls) {
            this.balls.forEach(function(ball) {
                ball.direction = new Vector2(randomFloat(-1, 1), -1);
                ball.speed = 300;
            }, this);

            this.update = updatePlaying;
            this._canReleaseBalls = false;
        }
    };

    ///////// level completed state

    var renderLevelCompleted = function() {
        g.save();

        drawEmptyWorld.call(this);

        // render balls, bricks and paddle
        this.balls.forEach(function(ball) {
            ball.render();
        });

        this.paddle.render();

        // render particles
        this.particles.forEach(function(particle) {
            particle.render(g);
        });

        g.font = '30px emulogic';
        g.fillStyle = '#FFFFFF';
        g.fillText('LEVEL 1', 290, 250);
        g.fillText('COMPLETE!', 290, 280);

        g.restore();
    };

    ///////// particles

    var updateParticles = function(delta) {
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

    ///////// collisions

    var handleBallBordersCollisions = function() {
        this.balls.forEach(function(ball) {
            // check and handle collisions with borders
            if (ball.center.x - ball.radius < 0) {
                ball.center.x = -ball.center.x + ball.radius * 2;
                ball.direction.x *= -1;

                Particle.spawn(this.particles, new Vector2(0, ball.center.y), -Math.PI - Math.atan2(ball.direction.y, ball.direction.x), 0.7, 4, Particle.shapes.SMALL_RECTANGLE, this.bordersColor);
            }
            if (ball.center.y - ball.radius < 0) {
                ball.center.y = -ball.center.y + ball.radius * 2;
                ball.direction.y *= -1;

                Particle.spawn(this.particles, new Vector2(ball.center.x, 0), -Math.atan2(ball.direction.y, ball.direction.x), 0.7, 4, Particle.shapes.SMALL_RECTANGLE, this.bordersColor);
            }
            if (ball.center.x + ball.radius >= constants.worldRelativeWidth) {
                ball.center.x = constants.worldRelativeWidth - ((ball.center.x + ball.radius) - constants.worldRelativeWidth) - ball.radius;
                ball.direction.x *= -1;

                Particle.spawn(this.particles, ball.center, -Math.PI - Math.atan2(ball.direction.y, ball.direction.x), 0.7, 4, Particle.shapes.SMALL_RECTANGLE, this.bordersColor);
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

                        Particle.spawn(this.particles, collisionPoint, -Math.atan2(ball.direction.y, ball.direction.x), 0.7, 4, Particle.shapes.SMALL_RECTANGLE, this.paddle.color);
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
            // TODO ball.die();
            this.balls.splice(index, 1);
        }
        if (this.balls.length === 0) {
            // all balls are dead
            //add new ball if it has lives remaining
            if (this.paddle.life > 0) {
                this.paddle.life -= 1;
                this.balls.push(new Ball(new Vector2(400, 600 - 50 - 7), 7, 0, new Vector2(0, -1), constants.ballColor));
                this.update = updateRespawn;
                this.render = renderRespawn;
                this._timePassed = 0;
            } else {
                // TODO game over!
            }
        }
    };

    var handleBallBrickCollisions = function() {
        this.balls.forEach(function(ball) {
            // get closer bricks from pruning structure
            var closerBricks = this.pruningGrid.getNearby(ball.center);
            var hitBricks = [];
            var tmpVec = new Vector2(0, 0);

            closerBricks.forEach(function(brick) {
                var collisionPoint = collisionDetection.testSphereAABB(ball, brick);
                if (collisionPoint !== null) {
                    var xColl = collisionPoint.x == brick.center.x - brick.halfSize.x || collisionPoint.x == brick.center.x + brick.halfSize.x;
                    var yColl = collisionPoint.y == brick.center.y - brick.halfSize.y || collisionPoint.y == brick.center.y + brick.halfSize.y;

                    if (xColl && yColl) {
                        tmpVec.set(brick.center).sub(collisionPoint);
                        var xDir = ball.direction.x * tmpVec.x > 0;
                        var yDir = ball.direction.y * tmpVec.y > 0;

                        if (xDir) {
                            ball.direction.x = -ball.direction.x;
                            Particle.spawn(this.particles, collisionPoint, -Math.PI - Math.atan2(ball.direction.y, ball.direction.x), 0.7, 4, Particle.shapes.SMALL_RECTANGLE, brick.color);
                        }
                        if (yDir) {
                            ball.direction.y = -ball.direction.y;
                            Particle.spawn(this.particles, collisionPoint, -Math.atan2(ball.direction.y, ball.direction.x), 0.7, 4, Particle.shapes.SMALL_RECTANGLE, brick.color);
                        }
                    } else {
                        if (xColl) {
                            ball.direction.x = -ball.direction.x;
                            Particle.spawn(this.particles, collisionPoint, -Math.PI - Math.atan2(ball.direction.y, ball.direction.x), 0.7, 4, Particle.shapes.SMALL_RECTANGLE, brick.color);
                        } else if (yColl) {
                            ball.direction.y = -ball.direction.y;
                            Particle.spawn(this.particles, collisionPoint, -Math.atan2(ball.direction.y, ball.direction.x), 0.7, 4, Particle.shapes.SMALL_RECTANGLE, brick.color);
                        }
                    }

                    hitBricks.push(brick);
                }
            }, this);

            for (var i = hitBricks.length - 1; i >= 0; i--) {
                var hitbrick = hitBricks[i];
                for (var j = this.bricks.length - 1; j >= 0; j--) {
                    if (this.bricks[j] === hitbrick) {
                        hitbrick.hit();
                        if (hitbrick.life <= 0) {
                            this.bricks.splice(j, 1);
                            this.pruningGrid.removeAABB(hitbrick);

                            Particle.spawn(this.particles, hitbrick.center, 0, 2 * Math.PI, 30, Particle.shapes.MEDIUM_RECTANGLE, hitbrick.color);
                        }
                    }
                }
            }
        }, this);
    };


    var constructor = function World(containerOffset, containerSize) {
        this.containerOffset = containerOffset;
        this.containerSize = containerSize;
        this.backgroundColor = constants.worldBackgroundColor;
        this.bordersColor = constants.bordersColor;
        this._canReleaseBalls = false;
        this._timePassed = 0;
        this._brickMillisOffset = 0;

        this.reset = reset;
        this.render = renderIntro;
        this.update = updateIntro;
        this.releaseBalls = releaseBalls;

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
        },
    };

    return constructor;
}();