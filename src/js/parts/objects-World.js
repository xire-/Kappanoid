var World = function() {

    ///////// public methods

    /*
     * handles all the actions the user can do by pressing the action key (spacebar)
     */
    var action = function() {
        // if the ball can be released from the paddle, release it
        releaseBall.call(this);

        // if lazors con be shooted, shoot them
        if (this.paddle.lazored) {
            var leftLazor = new Lazor(new Vector2(this.paddle.center.x - this.paddle.halfSize.x * 0.75, this.paddle.center.y - this.paddle.halfSize.y));
            var rightLazor = new Lazor(new Vector2(this.paddle.center.x + this.paddle.halfSize.x * 0.75, this.paddle.center.y - this.paddle.halfSize.y));
            this._lazors.push(leftLazor);
            this._lazors.push(rightLazor);

            if (settings.sounds) sounds.lazer.play();
        }

        // if the level is completed, load next level
        if (this.update === updateLevelCompleted) {
            // is this the last level?
            if (this._currentLevel === levels.length - 1) {
                // no more levels, grats!
                currState = states.gameover;
                localStorage.highscore = Math.max(localStorage.highscore, this.score);

                if (settings.music) music.gameOverMusic.play();
            } else {
                // advance to the next level and reset the world...
                this._currentLevel++;
                this.reset(false);

                // ...but skip the rotating world intro animation
                this._timePassed = 1000;
                this.render = renderIntroFallingBricks;
                this.update = updateIntro;
            }
        }
    };

    var changeTemporaryPowerup = function(powerUpType) {
        // remove the power-up currently active (if there is one)
        this.paddle.enlarged = false;
        this.paddle.lazored = false;
        this.paddle.sticky = false;

        // release the ball if it is currently caught by the paddle and the new power-up is not CATCH
        if (powerUpType !== PowerUp.types.CATCH) releaseBall.call(this);

        // add the new power-up
        switch (powerUpType) {
            case PowerUp.types.ENLARGE:
                this.paddle.enlarged = true;
                break;
            case PowerUp.types.LASER:
                this.paddle.lazored = true;
                break;
            case PowerUp.types.CATCH:
                this.paddle.sticky = true;
                break;

            default:
                break;
        }
    };


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

        this._backgroundColor = levels[this._currentLevel].backgroundColor;
        this._bordersColor = levels[this._currentLevel].bordersColor;

        this.balls = [];
        this.balls.push(new Ball(new Vector2(400, 600 - 50 - 7), 7, 0, new Vector2(0, -1), levels[this._currentLevel].ballColor));
        this.ballSpeedMult = 1;

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
        this.paddle = new Paddle(new Vector2(800 / 2, 600 + paddleHalfSize.y - 50), paddleHalfSize, oldLifes, levels[this._currentLevel].paddleColor);

        this.particles = [];
        this._lazors = [];

        this.levelTime = 0;
        this._shakeAmount.x = 0;
        this._shakeAmount.y = 0;
    };

    ///////// private methods

    /*
     * handles the release of the ball from the paddle
     */
    var releaseBall = function() {
        if (this._canReleaseBall) {
            this._canReleaseBall = false;

            // release the ball
            this.balls[0].direction = new Vector2(randomFloat(-1, 1), -1);
            this.balls[0].speed = 300;
            this.balls[0].trail.reset(true);

            if (settings.sounds) sounds.release.play();

            // if it's the first time the ball is released, set the level time
            if (this.levelTime === 0) {
                this.levelTime = Date.now();
            }

            this.update = updatePlaying;
        }

        // if the paddle has the power-up CATCH
        if (this.paddle.ballCaught) {
            this.paddle.ballCaught = false;

            this.balls[0].speed = 300;
            this.balls[0].trail.reset(true);

            if (settings.sounds) sounds.release.play();
        }
    };

    /*
     * handles all the actions to be performed when a brick is killed by a ball or a lazor
     */
    var killBrick = function(brick) {
        // remove brick from all bricks, breakable bricks and pruning grid
        this.bricks.splice(this.bricks.indexOf(brick), 1);
        this._breakableBricks.splice(this._breakableBricks.indexOf(brick), 1);
        this.pruningGrid.removeAABB(brick);

        this.score += brick.value;

        // spawn a power-up if: 
        //     - no power-ups are falling
        //     - there is only one ball
        //     - the killed brick is not a silver one
        if (this.fallingPowerup === null && this.balls.length === 1 && brick.type !== Brick.types.SILVER) {
            var powerUpType = PowerUp.types[Object.keys(PowerUp.types)[randomInt(Object.keys(PowerUp.types).length)]];
            this.fallingPowerup = new PowerUp(brick.center.clone(), brick.halfSize.clone(), powerUpType);
        }

        if (settings.particles) Particle.spawnExplosion(this.particles, brick);
    };


    var drawEmptyWorld = function() {
        // render borders (as background rect)
        g.fillStyle = settings.colors ? getColorString(this._bordersColor) : 'rgba(255, 255, 255, 1)';
        g.fillRect(0, constants.gameInfoRelativeHeight, this.containerSize.x + constants.bordersRelativeThickness * 2, this.containerSize.y + constants.bordersRelativeThickness);

        // translate to the world area
        g.translate(this.containerOffset.x + this._shakeAmount.x, this.containerOffset.y + this._shakeAmount.y);

        // clip the world region
        g.beginPath();
        g.rect(0, 0, this.containerSize.x, this.containerSize.y);
        g.clip();
        g.closePath();

        // render world background
        g.fillStyle = settings.colors ? getColorString(this._backgroundColor) : 'rgba(0, 0, 0, 1)';
        g.fillRect(0, 0, this.containerSize.x, this.containerSize.y);
    };

    var drawHearts = function(count) {
        g.font = '18px emulogic';
        g.textBaseline = 'top';
        g.fillStyle = settings.colors ? getColorString(this.paddle.color) : 'rgba(255, 255, 255, 1)';
        for (var i = 0; i < count; i++) {
            g.fillText('❤', 5 + 20 * i, 578);
        }
    };

    var drawLevelCompleted = function() {
        g.font = '30px emulogic';
        g.textAlign = 'center';
        g.textBaseline = 'middle';
        g.lineWidth = 2;

        g.fillStyle = 'rgba(255, 255, 255, 1)';
        g.fillText('LEVEL ' + (this._currentLevel + 1) + ' COMPLETE!', constants.worldRelativeWidth / 2, constants.worldRelativeHeight / 2);
        g.strokeStyle = 'rgba(0, 0, 0, 1)';
        g.strokeText('LEVEL ' + (this._currentLevel + 1) + ' COMPLETE!', constants.worldRelativeWidth / 2, constants.worldRelativeHeight / 2);
    };


    /*
     * updates the status of all particles and removes the dead ones
     */
    var updateParticles = function(delta) {
        var deadParticlesIndexes = [];
        this.particles.forEach(function(particle, i) {
            particle.update(delta);
            if (particle.life <= 0) {
                deadParticlesIndexes.push(i);
            }
        }, this);

        for (var i = deadParticlesIndexes.length - 1; i >= 0; i--) {
            var index = deadParticlesIndexes[i];
            this.particles.splice(index, 1);
        }
    };

    ///// intro state

    /*
     * render the rotating/zooming world
     */
    var renderIntro = function() {
        g.save();

        var translationX = this.containerSize.x / 2 + this.containerOffset.x;
        var translationY = (this.containerSize.y + this.containerOffset.y) / 2;
        g.translate(translationX, translationY);

        var scale = easing.easeOutBack(clamp(0, this._timePassed, 1000), 0, 1, 1000);
        g.scale(scale, scale);
        g.rotate(scale * Math.PI * 2);
        g.translate(-translationX, -translationY);

        drawEmptyWorld.call(this);

        g.restore();
    };

    /*
     * render the bricks falling from top into their position
     */
    var renderIntroFallingBricks = function() {
        g.save();

        drawEmptyWorld.call(this);

        // render bricks
        this.bricks.forEach(function(brick, i) {
            g.save();

            var translationY = easing.easeOutBack(clamp(0, -this._brickMillisOffset[i] + this._timePassed - 1000, 1000), -1, 1, 1000);
            g.translate(0, 500 * translationY);

            brick.render();

            g.restore();
        }, this);

        // render ball and paddle (fading)
        g.globalAlpha = easing.easeInQuad(clamp(0, this._timePassed - 2300, 700), 0, 1, 700);
        this.balls[0].render();
        this.paddle.render();

        g.restore();
    };

    var updateIntro = function(delta) {
        this._timePassed += delta;

        if (this._timePassed < 1000) {
            // [0, 1000) zoom in with rotation
        } else if (this._timePassed < 2300) {
            // [1000, 2300) falling bricks
            this.render = renderIntroFallingBricks;

            // play the starting level music
            if (settings.music && music.levelStartMusic.pos() === 0) music.levelStartMusic.play();
        } else if (this._timePassed < 3000) {
            // [2300, 3000) paddle and balls fade in
        } else {
            // >3000 end of animation, transition to next state
            this.render = renderPlaying;
            this.update = updatePrePlaying;
        }

        // update paddle
        this.paddle.update(delta);
        // stick the ball to the center of the paddle
        this.balls[0].center.x = this.paddle.center.x;
    };

    ///// pre-playing/playing state

    var renderPlaying = function() {
        g.save();

        drawEmptyWorld.call(this);

        // render balls
        this.balls.forEach(function(ball) {
            ball.render();
        });

        // render bricks
        this.bricks.forEach(function(brick) {
            brick.render();
        });

        // render falling power-up
        if (this.fallingPowerup !== null) this.fallingPowerup.render();

        // render paddle, paddle lifes and lazors
        this.paddle.render();
        drawHearts.call(this, this.paddle.life);
        this._lazors.forEach(function(lazor) {
            lazor.render();
        });

        // render particles
        this.particles.forEach(function(particle) {
            particle.render();
        });

        g.restore();
    };

    /*
     * this update is ran after the intro and after every time the ball dies and respawns
     */
    var updatePrePlaying = function(delta) {
        this._canReleaseBall = true;

        // update shaker
        this._shaker.update(delta);

        // update ball
        this.balls[0].update(delta);

        // update bricks
        this.bricks.forEach(function(brick) {
            brick.update(delta);
        });

        // update paddle
        this.paddle.update(delta);
        // stick the ball to the center of the paddle
        this.balls[0].center.x = this.paddle.center.x;

        // update particles
        updateParticles.call(this, delta);
    };

    var updatePlaying = function(delta) {
        // game paused?
        if (delta === 0) return;

        // update shaker
        this._shaker.update(delta);

        // update bricks
        this.bricks.forEach(function(brick) {
            brick.update(delta);
        });

        // update falling power-up
        if (this.fallingPowerup !== null) this.fallingPowerup.update(delta);

        // update paddle
        this.paddle.update(delta);

        // handle collisions
        var steps = 10;
        for (var i = 0; i < steps; i++) {
            // update balls
            for (var j = this.balls.length - 1; j >= 0; j--) {
                this.balls[j].update(delta / steps);
            }
            // update lazors
            for (j = this._lazors.length - 1; j >= 0; j--) {
                this._lazors[j].update(delta / steps);
            }

            handleLazorsCollisions.call(this);
            handleBallBordersCollisions.call(this);
            handleBallBrickCollisions.call(this);
            handleBallPaddleCollisions.call(this);
            if (this.fallingPowerup !== null) handlePowerUpPaddleCollisions.call(this);
        }

        // peggle effect
        if (settings.lastBrickSlowMo) {
            if (this._breakableBricks.length === 1 && this._breakableBricks[0].life === 1) {
                var lastBrick = this._breakableBricks[0];
                var distanceBallLastBrick;
                // check if a ball is near the last brick
                var ballNear = this.balls.some(function(ball) {
                    var brickPoint = collisionDetection.closestPtPointAABB(ball.center, lastBrick);
                    distanceBallLastBrick = ball.center.distance(brickPoint);
                    return distanceBallLastBrick <= 50;
                });

                // to slow or not to slow
                settings.timeScale = ballNear ? clamp(0.15, (distanceBallLastBrick - 30) / 20, 1) : 1;
            }
        }

        // update particles
        updateParticles.call(this, delta);

        // increment balls speed over time (+1 every 120 seconds)
        this.ballSpeedMult = Math.min(3, this.ballSpeedMult + (delta / 120000));

        // level completed?
        if (this._breakableBricks.length === 0) {
            // turn off peggle effect
            if (settings.lastBrickSlowMo) settings.timeScale = 1;

            this._timePassed = 0;

            this.changeTemporaryPowerup(null);

            this.render = renderLevelCompleted;
            this.update = updateLevelCompleted;
        }
    };

    ///// respawn state

    var renderRespawn = function() {
        g.save();

        drawEmptyWorld.call(this);

        // render ball
        if (clamp(0, this._timePassed - 2000, 2000) % 500 > 250) {
            this.balls[0].render();
        }

        // render bricks
        this.bricks.forEach(function(brick) {
            brick.render();
        });

        // render paddle and paddle lifes
        this.paddle.render();
        if (clamp(251, this._timePassed - 2000, 2000) % 500 > 250) {
            drawHearts.call(this, this.paddle.life);
        }

        // render particles
        this.particles.forEach(function(particle) {
            particle.render();
        });

        g.restore();
    };

    var updateRespawn = function(delta) {
        this._timePassed += delta;

        // update shaker
        this._shaker.update(delta);

        // update ball
        this.balls[0].update(delta);

        // update bricks
        this.bricks.forEach(function(brick) {
            brick.update(delta);
        });

        // update paddle
        this.paddle.update(delta);
        // stick the ball to the center of the paddle
        this.balls[0].center.x = this.paddle.center.x;

        // update particles
        updateParticles.call(this, delta);

        if (this._timePassed > 4000) {
            // respawn state finished, go back to pre-playing state
            this.update = updatePrePlaying;
            this.render = renderPlaying;
        }
    };

    ///// level completed state

    var renderLevelCompleted = function() {
        g.save();

        drawEmptyWorld.call(this);

        // render balls
        this.balls.forEach(function(ball) {
            ball.render();
        });

        // render unbreakable bricks only
        this._unbreakableBricks.forEach(function(brick) {
            brick.render();
        });

        // render paddle and paddle lifes
        this.paddle.render();
        drawHearts.call(this, this.paddle.life);

        // render particles
        this.particles.forEach(function(particle) {
            particle.render();
        });

        // render level completed text
        drawLevelCompleted.call(this);

        g.restore();
    };

    var updateLevelCompleted = function(delta) {
        this._timePassed += delta;

        // update shaker
        this._shaker.update(delta);

        // update balls
        this.balls.forEach(function(ball) {
            ball.update(delta);
        });

        // update paddle
        this.paddle.update(delta);

        // spawn fireworks randomly
        if (this._timePassed % 500 < 15) {
            if (settings.particles) Particle.spawnVictoryFireworks(this.particles);
        }

        // update particles
        updateParticles.call(this, delta);
    };

    ///// collision handling

    var handleLazorsCollisions = function() {
        var deadLazors = [];
        var hitBricks = [];
        this._lazors.forEach(function(lazor) {
            // check and handle collisions with top border
            if (lazor.center.y < 0) {
                deadLazors.push(lazor);
                if (settings.particles) Particle.spawnCollisionEffect(this.particles, new Vector2(lazor.center.x, 0), new Vector2(0, -1), this._bordersColor);
            }

            // check and handle collisions with bricks
            var closerBricks = this.pruningGrid.getNearby(lazor.center);

            closerBricks.forEach(function(brick) {
                var brickPoint = collisionDetection.closestPtPointAABB(lazor.center, brick);
                if (brickPoint.x === lazor.center.x && brickPoint.y === lazor.center.y) {
                    // collision collision collision collision
                    hitBricks.push(brick);
                    deadLazors.push(lazor);
                    if (settings.particles) Particle.spawnCollisionEffect(this.particles, lazor.center, new Vector2(0, -1), brick.color);
                }
            }, this);
        }, this);

        deadLazors.forEach(function(lazor) {
            this._lazors.splice(this._lazors.indexOf(lazor), 1);
        }, this);

        hitBricks.forEach(function(brick) {
            brick.hit();
            if (brick.life <= 0) {
                killBrick.call(this, brick);
            }
        }, this);
    };

    var handleBallBordersCollisions = function() {
        this.balls.forEach(function(ball) {
            // check and handle collisions with borders
            if (ball.center.x - ball.radius < 0) {
                // shake screen before changing direction
                if (settings.worldShake) this._shaker.shake(ball.direction);

                ball.center.x = -ball.center.x + ball.radius * 2;
                ball.direction.x *= -1;

                ball.trail.addVertex(ball.center);

                if (settings.particles) Particle.spawnCollisionEffect(this.particles, new Vector2(0, ball.center.y), ball.direction, this._bordersColor);
            }
            if (ball.center.y - ball.radius < 0) {
                // shake screen before changing direction
                if (settings.worldShake) this._shaker.shake(ball.direction);

                ball.center.y = -ball.center.y + ball.radius * 2;
                ball.direction.y *= -1;

                ball.trail.addVertex(ball.center);

                if (settings.particles) Particle.spawnCollisionEffect(this.particles, new Vector2(ball.center.x, 0), ball.direction, this._bordersColor);
            }
            if (ball.center.x + ball.radius >= constants.worldRelativeWidth) {
                // shake screen before changing direction
                if (settings.worldShake) this._shaker.shake(ball.direction);

                ball.center.x = constants.worldRelativeWidth - ((ball.center.x + ball.radius) - constants.worldRelativeWidth) - ball.radius;
                ball.direction.x *= -1;

                ball.trail.addVertex(ball.center);

                if (settings.particles) Particle.spawnCollisionEffect(this.particles, new Vector2(constants.worldRelativeWidth, ball.center.y), ball.direction, this._bordersColor);
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
                    if (settings.worldShake) this._shaker.shake(ball.direction);

                    var xColl = collisionPoint.x == brick.center.x - brick.halfSize.x || collisionPoint.x == brick.center.x + brick.halfSize.x;
                    var yColl = collisionPoint.y == brick.center.y - brick.halfSize.y || collisionPoint.y == brick.center.y + brick.halfSize.y;
                    if (xColl && yColl) {
                        tmpVec.set(brick.center).sub(collisionPoint);
                        var xDir = ball.direction.x * tmpVec.x > 0;
                        var yDir = ball.direction.y * tmpVec.y > 0;

                        if (xDir) {
                            ball.direction.x = -ball.direction.x;
                        }
                        if (yDir) {
                            ball.direction.y = -ball.direction.y;
                        }
                    } else {
                        if (xColl) {
                            ball.direction.x = -ball.direction.x;
                        } else if (yColl) {
                            ball.direction.y = -ball.direction.y;
                        }
                    }
                    hitBricks.push(brick);

                    ball.trail.addVertex(ball.center);

                    if (settings.particles) Particle.spawnCollisionEffect(this.particles, collisionPoint, ball.direction, brick.color);
                }
            }, this);

            for (var i = hitBricks.length - 1; i >= 0; i--) {
                var hitbrick = hitBricks[i];
                hitbrick.hit();
                if (hitbrick.life <= 0) {
                    killBrick.call(this, hitbrick);

                    if (settings.sounds) sounds.bounce.play();
                } else {
                    if (settings.sounds) sounds.bounceMetal.play();
                }
            }
        }, this);
    };

    var handleBallPaddleCollisions = function() {
        var deadBalls = [];
        this.balls.forEach(function(ball) {
            // check ball vs bottom and paddle
            if (ball.center.y + ball.radius >= this.paddle.center.y - this.paddle.halfSize.y) {
                // is the ball going down?
                if (ball.direction.y > 0) {
                    var collisionPoint = collisionDetection.testSphereAABB(ball, this.paddle);
                    if (collisionPoint !== null) {
                        if (settings.worldShake) this._shaker.shake(ball.direction);

                        // determine resultant direction based on collisionPoint
                        var angle = (collisionPoint.x - this.paddle.center.x) / this.paddle.halfSize.x;
                        ball.direction.x = Math.sin(angle);
                        ball.direction.y = -Math.cos(angle);

                        if (this.paddle.sticky) {
                            ball.center.x = collisionPoint.x;
                            ball.center.y = this.paddle.center.y - this.paddle.halfSize.y - ball.radius;
                            ball.speed = 0;
                            this.paddle.ballCaught = true;

                            if (settings.sounds) sounds.collect.play();
                        } else {
                            ball.trail.addVertex(ball.center);

                            if (settings.particles) Particle.spawnCollisionEffect(this.particles, collisionPoint, ball.direction, this.paddle.color);

                            if (settings.sounds) sounds.release.play();
                        }
                    }
                }

                // check if ball is dead
                if (ball.center.y >= this.paddle.center.y + this.paddle.halfSize.y) {
                    deadBalls.push(ball);
                }
            }
        }, this);

        deadBalls.forEach(function(ball) {
            this.balls.splice(this.balls.indexOf(ball), 1);
        }, this);
        if (this.balls.length === 0) {
            // all balls are dead
            this.paddle.life -= 1;

            // respawn new ball if the paddle has lives remaining
            if (this.paddle.life > 0) {
                this.balls.push(new Ball(new Vector2(400, 600 - 50 - 7), 7, 0, new Vector2(0, -1), levels[this._currentLevel].ballColor));

                this.fallingPowerup = null;
                this.changeTemporaryPowerup(null);
                this.ballSpeedMult = 1;
                this._lazors = [];

                this._timePassed = 0;
                this.update = updateRespawn;
                this.render = renderRespawn;

                if (settings.sounds) {
                    if (Math.random() < 0.5) {
                        sounds.die.play();
                    } else {
                        sounds.die2.play();
                    }
                }
            } else {
                currState = states.gameover;
                localStorage.highscore = Math.max(localStorage.highscore, this.score);

                if (settings.music) music.gameOverMusic.play();
            }
        }
    };

    var handlePowerUpPaddleCollisions = function() {
        // check power-up vs bottom and paddle
        if (this.fallingPowerup.center.y + this.fallingPowerup.halfSize.y >= this.paddle.center.y - this.paddle.halfSize.y) {
            // if they are intersecting
            if (Math.abs(this.fallingPowerup.center.x - this.paddle.center.x) < this.fallingPowerup.halfSize.x + this.paddle.halfSize.x) {
                // activate powerup
                this.fallingPowerup.onActivate();
                // remove powerup
                this.fallingPowerup = null;
                return;
            }

            // check if the power-up is under the paddle
            if (this.fallingPowerup.center.y - this.fallingPowerup.halfSize.y >= this.paddle.center.y + this.paddle.halfSize.y) {
                // the power-up can be removed
                this.fallingPowerup = null;
            }
        }
    };

    ///////// constructor

    var constructor = function World(containerOffset, containerSize) {
        // public methods
        this.reset = reset;
        this.render = renderIntro;
        this.update = updateIntro;
        this.action = action;
        this.changeTemporaryPowerup = changeTemporaryPowerup;

        // init
        this.containerOffset = containerOffset;
        this.containerSize = containerSize;
        this.score = 0;
        this.levelTime = 0;

        this._timePassed = 0;

        this._backgroundColor = null;
        this._bordersColor = null;

        this._shakeAmount = new Vector2(0, 0);
        this._shaker = new Shaker(this._shakeAmount);

        this._canReleaseBall = false;
        this._brickMillisOffset = 0;
        this._currentLevel = 0;
        this._breakableBricks = [];
        this._unbreakableBricks = [];
        this._lazors = [];

        // initialize all game objects
        this.reset();
    };

    constructor.prototype = {
        set containerOffset(value) {
            console.assert(isInstanceOf(value, Vector2), JSON.stringify(value));
            this._containerOffset = value;
        },
        get containerOffset() {
            return this._containerOffset;
        },

        set containerSize(value) {
            console.assert(isInstanceOf(value, Vector2), JSON.stringify(value));
            this._containerSize = value;
        },
        get containerSize() {
            return this._containerSize;
        },

        set score(value) {
            console.assert(isTypeOf(value, 'number'), JSON.stringify(value));
            this._score = value;
        },
        get score() {
            return this._score;
        },

        set levelTime(value) {
            console.assert(isTypeOf(value, 'number'), JSON.stringify(value));
            this._levelTime = value;
        },
        get levelTime() {
            return this._levelTime;
        },
    };

    return constructor;
}();