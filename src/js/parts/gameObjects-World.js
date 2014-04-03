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

        this.fallingPowerup = null;

        this.balls = [];
        this.balls.push(new Ball(new Vector2(400, 600 - 50 - 7), 7, 0, new Vector2(0, -1), constants.ballColor));

        this.pruningGrid = new PruningGrid(new Vector2(20, 15), new Vector2(0, 0), new Vector2(800, 600), 7);

        this.bricks = levels[this._currentLevel].bricks();
        this._breakableBricks = [];
        this._unbreakableBricks = [];
        this.bricks.forEach(function(brick) {
            // randomize falling animation offset
            this._brickMillisOffset.push(randomInt(300));

            if (brick.life !== Number.POSITIVE_INFINITY) {
                this._breakableBricks.push(brick);
            } else {
                this._unbreakableBricks.push(brick);
            }

            this.pruningGrid.addAABB(brick);
        }, this);

        var paddleHalfSize = new Vector2(50, 15);
        var oldLifes = this.paddle !== undefined ? this.paddle.life : 2;
        this.paddle = new Paddle(new Vector2(800 / 2, 600 + paddleHalfSize.y - 50), paddleHalfSize, oldLifes, constants.paddleColor);

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
        g.fillStyle = settings.colors ? getColorString(this._backgroundColor) : getColorString({
            r: 0,
            g: 0,
            b: 0
        });
        g.fillRect(0, 0, this.containerSize.x, this.containerSize.y);
    };

    var drawPaddleLifes = function() {
        g.font = '18px emulogic';
        g.textBaseline = 'top';
        g.fillStyle = settings.colors ? this.paddle.color : getColorString({
            r: 255,
            g: 255,
            b: 255
        });
        for (var i = 0; i < this.paddle.life - 1; i++) {
            g.fillText('❤', 5 + 20 * i, 578);
        }
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
        this.paddle.update(delta);

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
        drawPaddleLifes.call(this);

        // render powerup
        if (this.fallingPowerup !== null) {
            this.fallingPowerup.render();
        }

        // render particles
        this.particles.forEach(function(particle) {
            particle.render();
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
            particle.render();
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

        this.bricks.forEach(function(brick) {
            brick.update(delta);
        });

        // update powerup
        if (this.fallingPowerup !== null) {
            this.fallingPowerup.update(delta);
        }

        this.paddle.update(delta);

        var steps = 10;
        for (var i = 0; i < steps; i++) {
            for (var j = this.balls.length - 1; j >= 0; j--) {
                this.balls[j].update(delta / steps);
            }

            handleBallBordersCollisions.call(this);
            handleBallBrickCollisions.call(this);
            handleBallPaddleCollisions.call(this);
            handlePowerUpPaddleCollisions.call(this);
        }

        // peggle effect
        if (settings.lastBrickSlowMo) {
            if (this._breakableBricks.length === 1 && this._breakableBricks[0].life === 1) {
                var lastBrick = this._breakableBricks[0];
                var distance;
                var ballNear = this.balls.some(function(ball) {
                    // check if ball is near the last brick
                    var brickPoint = collisionDetection.closestPtPointAABB(ball.center, lastBrick);
                    distance = ball.center.distance(brickPoint);
                    return distance <= 50;
                });

                // to slow or not to slow
                settings.timeScale = ballNear ? clamp(0.15, (distance - 30) / 20, 1) : 1;
            }
        }

        // update particles
        updateParticles.call(this, delta);

        // level finished?
        if (this._breakableBricks.length === 0) {
            // turn off peggle effect
            settings.timeScale = 1;

            new Audio('sound/levelCompletedFanfare.mp3').play();

            this._timePassed = 0;
            this.render = renderLevelCompleted;
            this.update = updateLevelCompleted;
        }
    };


    var releaseBalls = function() {
        if (this._canReleaseBalls) {
            this.balls.forEach(function(ball) {
                ball.direction = new Vector2(randomFloat(-1, 1), -1);
                ball.speed = 300;
                ball.resetTrail();
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

        this._unbreakableBricks.forEach(function(brick) {
            brick.render();
        });

        this.paddle.render();
        drawPaddleLifes.call(this);

        // render particles
        this.particles.forEach(function(particle) {
            particle.render();
        });


        g.lineWidth = 2;
        g.textAlign = 'center';
        g.textBaseline = 'middle';
        g.font = '30px emulogic';
        g.fillStyle = '#FFFFFF';
        g.fillText('LEVEL ' + (this._currentLevel + 1), 400, 250);
        g.fillText('COMPLETE!', 400, 280);
        g.strokeStyle = '#000000';
        g.strokeText('LEVEL ' + (this._currentLevel + 1), 400, 250);
        g.strokeText('COMPLETE!', 400, 280);

        g.restore();
    };

    var updateLevelCompleted = function(delta) {
        this._timePassed += delta;

        // fireworks
        this._fireworksTime += delta;
        if (this._fireworksTime > 500) {
            this._fireworksTime = 0;

            var p = this.particles;
            var callback = function(parent) {
                Particle.spawn(p, parent.position, new Vector2(-randomInt(60, 110), -randomInt(80, 110)), 0, 2 * Math.PI, 30, 3000, Particle.shapes.MEDIUM_RECTANGLE, parent.color);
            };
            Particle.spawn(this.particles, new Vector2(0, constants.worldRelativeHeight), new Vector2(randomInt(20, 500), -randomInt(300, 700)), Math.PI / 4, 0.3, 1, 1000, Particle.shapes.FIREWORK, '#00FF00', callback);
            Particle.spawn(this.particles, new Vector2(constants.worldRelativeWidth, constants.worldRelativeHeight), new Vector2(-randomInt(20, 500), -randomInt(300, 700)), Math.PI / 4, 0.3, 1, 1000, Particle.shapes.FIREWORK, '#00FF00', callback);
        }

        if (this._timePassed < 1000) {
            // [0, 1000)
        } else if (this._timePassed < 2300) {
            // [1000, 2300)
        } else if (this._timePassed < 5000) {
            // [2300, 5000)
        } else {
            // >3000 end of animation, enter the next level
            this._currentLevel = (this._currentLevel + 1) % levels.length;
            this.reset(false);

            this._timePassed = 1000;
            this.render = renderIntroFalling;
            this.update = updateIntro;
        }

        this.paddle.update(delta);

        // update particles
        updateParticles.call(this, delta);
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

                ball.addTrailVertex(ball.center);

                Particle.spawn(this.particles, new Vector2(0, ball.center.y), new Vector2(-randomInt(60, 110), -randomInt(80, 110)), -Math.PI - Math.atan2(ball.direction.y, ball.direction.x), 0.7, 4, 3000, Particle.shapes.SMALL_RECTANGLE, this.bordersColor);
            }
            if (ball.center.y - ball.radius < 0) {
                ball.center.y = -ball.center.y + ball.radius * 2;
                ball.direction.y *= -1;

                ball.addTrailVertex(ball.center);

                Particle.spawn(this.particles, new Vector2(ball.center.x, 0), new Vector2(-randomInt(60, 110), -randomInt(80, 110)), -Math.atan2(ball.direction.y, ball.direction.x), 0.7, 4, 3000, Particle.shapes.SMALL_RECTANGLE, this.bordersColor);
            }
            if (ball.center.x + ball.radius >= constants.worldRelativeWidth) {
                ball.center.x = constants.worldRelativeWidth - ((ball.center.x + ball.radius) - constants.worldRelativeWidth) - ball.radius;
                ball.direction.x *= -1;

                ball.addTrailVertex(ball.center);

                Particle.spawn(this.particles, ball.center, new Vector2(-randomInt(60, 110), -randomInt(80, 110)), -Math.PI - Math.atan2(ball.direction.y, ball.direction.x), 0.7, 4, 3000, Particle.shapes.SMALL_RECTANGLE, this.bordersColor);
            }
        }, this);
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
                            Particle.spawn(this.particles, collisionPoint, new Vector2(-randomInt(60, 110), -randomInt(80, 110)), -Math.PI - Math.atan2(ball.direction.y, ball.direction.x), 0.7, 4, 3000, Particle.shapes.SMALL_RECTANGLE, brick.color);
                        }
                        if (yDir) {
                            ball.direction.y = -ball.direction.y;
                            Particle.spawn(this.particles, collisionPoint, new Vector2(-randomInt(60, 110), -randomInt(80, 110)), -Math.atan2(ball.direction.y, ball.direction.x), 0.7, 4, 3000, Particle.shapes.SMALL_RECTANGLE, brick.color);
                        }
                    } else {
                        if (xColl) {
                            ball.direction.x = -ball.direction.x;
                            Particle.spawn(this.particles, collisionPoint, new Vector2(-randomInt(60, 110), -randomInt(80, 110)), -Math.PI - Math.atan2(ball.direction.y, ball.direction.x), 0.7, 4, 3000, Particle.shapes.SMALL_RECTANGLE, brick.color);
                        } else if (yColl) {
                            ball.direction.y = -ball.direction.y;
                            Particle.spawn(this.particles, collisionPoint, new Vector2(-randomInt(60, 110), -randomInt(80, 110)), -Math.atan2(ball.direction.y, ball.direction.x), 0.7, 4, 3000, Particle.shapes.SMALL_RECTANGLE, brick.color);
                        }
                    }

                    ball.addTrailVertex(ball.center);

                    hitBricks.push(brick);
                }
            }, this);

            for (var i = hitBricks.length - 1; i >= 0; i--) {
                var hitbrick = hitBricks[i];
                hitbrick.hit();
                if (hitbrick.life <= 0) {
                    // remove hitbrick from all bricks
                    this.bricks.splice(this.bricks.indexOf(hitbrick), 1);
                    // remove hitbrick from breakable bricks
                    this._breakableBricks.splice(this._breakableBricks.indexOf(hitbrick), 1);
                    // remove hitbrick from pruning grid
                    this.pruningGrid.removeAABB(hitbrick);

                    this.score += hitbrick.value;

                    // TODO maybe spawn powerup (not silver and 1 in 10 chance)
                    if (this.fallingPowerup === null && this.balls.length === 1 && hitbrick.type !== Brick.types.SILVER && randomFloat(1) < 1) {
                        var pType = PowerUp.types[Object.keys(PowerUp.types)[randomInt(Object.keys(PowerUp.types).length)]];
                        var pType = PowerUp.types.ENLARGE;
                        this.fallingPowerup = new PowerUp(hitbrick.center.clone(), hitbrick.halfSize.clone(), pType);
                    }

                    Particle.spawn(this.particles, hitbrick.center, new Vector2(-randomInt(60, 110), -randomInt(80, 110)), 0, 2 * Math.PI, 30, 3000, Particle.shapes.MEDIUM_RECTANGLE, hitbrick.color);
                }
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

                        ball.addTrailVertex(ball.center);

                        Particle.spawn(this.particles, collisionPoint, new Vector2(-randomInt(60, 110), -randomInt(80, 110)), -Math.atan2(ball.direction.y, ball.direction.x), 0.7, 4, 3000, Particle.shapes.SMALL_RECTANGLE, this.paddle.color);
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
            this.paddle.life -= 1;
            if (this.paddle.life > 0) {
                //delete all falling powerup
                this.fallingPowerup = null;

                this.balls.push(new Ball(new Vector2(400, 600 - 50 - 7), 7, 0, new Vector2(0, -1), constants.ballColor));
                this.update = updateRespawn;
                this.render = renderRespawn;
                this._timePassed = 0;
            } else {
                currState = states.gameover;
            }
        }
    };

    var handlePowerUpPaddleCollisions = function() {
        if (this.fallingPowerup === null) return;
        // check powerUp vs bottom and paddle
        if (this.fallingPowerup.center.y + this.fallingPowerup.halfSize.y >= this.paddle.center.y - this.paddle.halfSize.y) {
            // if they are intersecting
            if (Math.abs(this.fallingPowerup.center.x - this.paddle.center.x) < this.fallingPowerup.halfSize.x + this.paddle.halfSize.x) {
                // activate powerup
                this.fallingPowerup.onActivate();
                // remove powerup
                this.fallingPowerup = null;
                return;
            }

            if (this.fallingPowerup.center.y - this.fallingPowerup.halfSize.y >= this.paddle.center.y + this.paddle.halfSize.y) {
                // powerUp is under the paddle and can be removed
                this.fallingPowerup = null;
            }
        }
    };

    var activateTemporaryPowerup = function(type) {
        //remove all temporary powerups
        this.paddle.enlarged = false;

        //add current powerup
        if (type === PowerUp.types.ENLARGE) {
            this.paddle.enlarged = true;
        }
    };

    var constructor = function World(containerOffset, containerSize) {
        this.containerOffset = containerOffset;
        this.containerSize = containerSize;
        this._backgroundColor = constants.worldBackgroundColor;
        this.bordersColor = constants.bordersColor;
        this._canReleaseBalls = false;
        this._timePassed = 0;
        this._brickMillisOffset = 0;
        this._currentLevel = 0;
        this._breakableBricks = [];
        this._unbreakableBricks = [];
        this.score = 0;
        this._fireworksTime = 0;

        this.reset = reset;
        this.render = renderIntro;
        this.update = updateIntro;
        this.releaseBalls = releaseBalls;
        this.activateTemporaryPowerup = activateTemporaryPowerup;

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