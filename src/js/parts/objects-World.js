var World = function() {

    ///////// public methods

    var action = function() {
        // if the ball can be released, release it
        releaseBall.call(this);

        // if lazors con be shooted, shoot them
        if (this.paddle.lazored) {
            var lzr1 = new Lazor(new Vector2(this.paddle.center.x - this.paddle.halfSize.x * 0.75, this.paddle.center.y - this.paddle.halfSize.y));
            var lzr2 = new Lazor(new Vector2(this.paddle.center.x + this.paddle.halfSize.x * 0.75, this.paddle.center.y - this.paddle.halfSize.y));
            this.lazors.push(lzr1);
            this.lazors.push(lzr2);

            if (settings.sounds) sounds.lazer.play();
        }

        // if victory, load next level
        if (this.update === updateLevelCompleted) {
            if (this._currentLevel === levels.length - 1) {
                // no more levels, grats!
                currState = states.gameover;
                localStorage.highscore = Math.max(localStorage.highscore, this.score);

                if (settings.music) music.gameOverMusic.play();
            } else {
                this._currentLevel++;

                this.reset(false);

                this._timePassed = 1000;
                this.render = renderIntroFalling;
                this.update = updateIntro;
            }
        }
    };

    var changeTemporaryPowerup = function(type) {
        // remove all temporary powerups
        this.paddle.enlarged = false;
        this.paddle.lazored = false;
        this.paddle.sticky = false;
        if (type !== PowerUp.types.CATCH) {
            releaseBall.call(this);
        }

        // add current powerup
        if (type === PowerUp.types.ENLARGE) {
            this.paddle.enlarged = true;
        } else if (type === PowerUp.types.LASER) {
            this.paddle.lazored = true;
        } else if (type === PowerUp.types.CATCH) {
            this.paddle.sticky = true;
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
        this.bordersColor = levels[this._currentLevel].bordersColor;

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
        this.lazors = [];

        this.levelTime = null;
        this.shakeAmount.x = 0;
        this.shakeAmount.y = 0;
    };

    ///////// private methods

    var drawEmptyWorld = function() {
        // WARNING don't use save and restore here

        // render borders (as background)
        g.fillStyle = settings.colors ? getColorString(this.bordersColor) : '#FFFFFF';
        g.fillRect(0, 60, this.containerSize.x + constants.bordersRelativeThickness * 2, this.containerSize.y + constants.bordersRelativeThickness);

        // translate to render the world area
        g.translate(this.containerOffset.x + this.shakeAmount.x, this.containerOffset.y + this.shakeAmount.y);

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
        g.fillStyle = settings.colors ? getColorString(this.paddle.color) : getColorString({
            r: 255,
            g: 255,
            b: 255
        });
        for (var i = 0; i < this.paddle.life; i++) {
            g.fillText('❤', 5 + 20 * i, 578);
        }
    };


    var releaseBall = function() {
        if (this._canReleaseBall) {
            this.balls.forEach(function(ball) {
                ball.direction = new Vector2(randomFloat(-1, 1), -1);
                ball.speed = 300;
                ball.trail.reset(true);

                if (settings.sounds) sounds.release.play();
            }, this);

            if (this.levelTime === null) {
                this.levelTime = new Date();
            }

            this.update = updatePlaying;
            this._canReleaseBall = false;
        }
        if (this.paddle.ballIsStuck) {
            this.paddle.ballIsStuck = false;
            this.balls[0].speed = 300;
            this.balls[0].trail.reset(true);

            if (settings.sounds) sounds.release.play();
        }
    };

    var killBrick = function(brick) {
        // remove brick from all bricks
        this.bricks.splice(this.bricks.indexOf(brick), 1);
        // remove brick from breakable bricks
        this._breakableBricks.splice(this._breakableBricks.indexOf(brick), 1);
        // remove brick from pruning grid
        this.pruningGrid.removeAABB(brick);

        this.score += brick.value;

        // TODO maybe spawn powerup (not silver and 1 in 10 chance)
        if (this.fallingPowerup === null && this.balls.length === 1 && brick.type !== Brick.types.SILVER && randomFloat(1) < 1) {
            var pType = PowerUp.types[Object.keys(PowerUp.types)[randomInt(Object.keys(PowerUp.types).length)]];
            this.fallingPowerup = new PowerUp(brick.center.clone(), brick.halfSize.clone(), pType);
        }

        if (settings.particles) Particle.spawnExplosion(this.particles, brick);
    };


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

    ///// initial state

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

            if (settings.music && music.levelStartMusic.pos() === 0) music.levelStartMusic.play();
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

    ///// playing state

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
        this.lazors.forEach(function(lazor) {
            lazor.render();
        });
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
        this._canReleaseBall = true;
        this.shaker.update(delta);

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

    var updatePlaying = function(delta) {
        if (delta === 0) {
            return;
        }

        this.shaker.update(delta);

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
            for (j = this.lazors.length - 1; j >= 0; j--) {
                this.lazors[j].update(delta / steps);
            }

            handleLazorsCollisions.call(this);
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

        // increment ball speed over time
        this.ballSpeedMult = Math.min(3, this.ballSpeedMult + (delta / 120000));

        // level finished?
        if (this._breakableBricks.length === 0) {
            // turn off peggle effect
            settings.timeScale = 1;

            this._timePassed = 0;
            this.render = renderLevelCompleted;
            this.update = updateLevelCompleted;
        }
    };

    ///// respawn state

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
        drawPaddleLifes.call(this);

        // render particles
        this.particles.forEach(function(particle) {
            particle.render();
        });

        g.restore();
    };

    var updateRespawn = function(delta) {
        this._timePassed += delta;

        this.shaker.update(delta);

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

    ///// level completed state

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
        g.font = '30px emulogic';
        g.textAlign = 'center';
        g.textBaseline = 'middle';

        g.fillStyle = getColorString({
            r: 255,
            g: 255,
            b: 255,
        });
        g.fillText('LEVEL ' + (this._currentLevel + 1) + ' COMPLETE!', constants.worldRelativeWidth / 2, constants.worldRelativeHeight / 2);
        g.strokeStyle = getColorString({
            r: 0,
            g: 0,
            b: 0,
        });
        g.strokeText('LEVEL ' + (this._currentLevel + 1) + ' COMPLETE!', constants.worldRelativeWidth / 2, constants.worldRelativeHeight / 2);

        g.restore();
    };

    var updateLevelCompleted = function(delta) {
        this._timePassed += delta;

        this.shaker.update(delta);

        // fireworks
        this._fireworksTime += delta;
        if (this._fireworksTime > 500) {
            this._fireworksTime = 0;

            if (settings.particles) Particle.spawnVictoryFireworks(this.particles);
        }

        // remove all powerups before changing level
        this.changeTemporaryPowerup(null);

        this.paddle.update(delta);

        this.balls.forEach(function(ball) {
            ball.update(delta);
        });

        // update particles
        updateParticles.call(this, delta);
    };

    ///// collisions

    var handleLazorsCollisions = function() {
        var deadLazors = [];
        var hitBricks = [];
        this.lazors.forEach(function(lazor) {
            // check and handle collisions with top border
            if (lazor.center.y < 0) {
                deadLazors.push(lazor);
                if (settings.particles) Particle.spawnCollisionEffect(this.particles, lazor.center.x, 0, 0, -1, this.bordersColor);
            }

            // check and handle collisions with bricks
            var closerBricks = this.pruningGrid.getNearby(lazor.center);

            closerBricks.forEach(function(brick) {
                var brickPoint = collisionDetection.closestPtPointAABB(lazor.center, brick);
                if (brickPoint.x === lazor.center.x && brickPoint.y === lazor.center.y) {
                    // collision collision collision collision
                    hitBricks.push(brick);
                    deadLazors.push(lazor);
                    if (settings.particles) Particle.spawnCollisionEffect(this.particles, lazor.center.x, lazor.center.y, 0, -1, brick.color);
                }
            }, this);
        }, this);

        deadLazors.forEach(function(lazor) {
            this.lazors.splice(this.lazors.indexOf(lazor), 1);
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
                if (settings.worldShake) this.shaker.shake(ball.direction);

                ball.center.x = -ball.center.x + ball.radius * 2;
                ball.direction.x *= -1;

                ball.trail.addVertex(ball.center);
                if (settings.particles) Particle.spawnCollisionEffect(this.particles, 0, ball.center.y, ball.direction.x, ball.direction.y, this.bordersColor);
            }
            if (ball.center.y - ball.radius < 0) {
                // shake screen before changing direction
                if (settings.worldShake) this.shaker.shake(ball.direction);

                ball.center.y = -ball.center.y + ball.radius * 2;
                ball.direction.y *= -1;

                ball.trail.addVertex(ball.center);

                if (settings.particles) Particle.spawnCollisionEffect(this.particles, ball.center.x, 0, ball.direction.x, ball.direction.y, this.bordersColor);
            }
            if (ball.center.x + ball.radius >= constants.worldRelativeWidth) {
                // shake screen before changing direction
                if (settings.worldShake) this.shaker.shake(ball.direction);

                ball.center.x = constants.worldRelativeWidth - ((ball.center.x + ball.radius) - constants.worldRelativeWidth) - ball.radius;
                ball.direction.x *= -1;

                ball.trail.addVertex(ball.center);

                if (settings.particles) Particle.spawnCollisionEffect(this.particles, 800, ball.center.y, ball.direction.x, ball.direction.y, this.bordersColor);
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

                    if (settings.worldShake) this.shaker.shake(ball.direction);

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

                    if (settings.particles) Particle.spawnCollisionEffect(this.particles, collisionPoint.x, collisionPoint.y, ball.direction.x, ball.direction.y, brick.color);
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
        this.balls.forEach(function(ball, i) {
            // check ball vs bottom and paddle
            if (ball.center.y + ball.radius >= this.paddle.center.y - this.paddle.halfSize.y) {
                // if it's actualy going down
                if (ball.direction.y > 0) {
                    var collisionPoint = collisionDetection.testSphereAABB(ball, this.paddle);
                    if (collisionPoint !== null) {
                        if (settings.worldShake) this.shaker.shake(ball.direction);
                        
                        // determine resultant direction based on collisionPoint
                        var angle = (collisionPoint.x - this.paddle.center.x) / this.paddle.halfSize.x;
                        ball.direction.x = Math.sin(angle);
                        ball.direction.y = -Math.cos(angle);

                        if (this.paddle.sticky) {
                            ball.center.x = collisionPoint.x;
                            ball.center.y = this.paddle.center.y - this.paddle.halfSize.y - ball.radius;
                            ball.speed = 0;
                            this.paddle.ballIsStuck = true;

                            if (settings.sounds) sounds.collect.play();
                        } else {
                            ball.trail.addVertex(ball.center);

                            if (settings.particles) Particle.spawnCollisionEffect(this.particles, collisionPoint.x, collisionPoint.y, ball.direction.x, ball.direction.y, this.paddle.color);

                            if (settings.sounds) sounds.release.play();
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

                this.balls.push(new Ball(new Vector2(400, 600 - 50 - 7), 7, 0, new Vector2(0, -1), levels[this._currentLevel].ballColor));
                this.update = updateRespawn;
                this.render = renderRespawn;
                this.changeTemporaryPowerup(null);
                this.ballSpeedMult = 1;
                this.lazors = [];
                this._timePassed = 0;

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
        this.shakeAmount = new Vector2(0, 0);
        this.shaker = new Shaker(this.shakeAmount);
        this._backgroundColor = constants.worldBackgroundColor;
        this.bordersColor = undefined;
        this._canReleaseBall = false;
        this._timePassed = 0;
        this._brickMillisOffset = 0;
        this._currentLevel = 0;
        this._breakableBricks = [];
        this._unbreakableBricks = [];
        this.lazors = [];
        this.score = 0;
        this._fireworksTime = 0;
        this.levelTime = null;

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
    };

    return constructor;
}();