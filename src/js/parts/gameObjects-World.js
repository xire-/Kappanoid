var World = function() {
    var reset = function() {
        animScale = 1;
        timePassed = 0;
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
                var blockCenter = new Vector2(
                    105 + blockHalfSize.x + i * (blockHalfSize.x * 2 + 10),
                    30 + 47 + j * (blockHalfSize.y * 2 + 10)
                );
                var life = Math.floor(1 + Math.random() * 10);
                this.bricks.push(new Brick(blockCenter, blockHalfSize, life, settings.brickDefaultColor));
            }
        }

        var paddleHalfSize = new Vector2(50, 15);
        this.paddle = new Paddle(new Vector2(800 / 2, 600 + paddleHalfSize.y * 2 / 2 - 50), paddleHalfSize, 1, settings.paddleDefaultColor);
    };

    var animScale = 1;
    var timePassed = 0;
    var renderIntro = function() {
        g.save();

        var tx = this.containerSize.x / 2 + this.containerOffset.x;
        var ty = (this.containerSize.y + this.containerOffset.y) / 2;

        g.translate(tx, ty);
        g.scale(animScale, animScale);
        g.rotate(animScale * Math.PI * 2);
        g.translate(-tx, -ty);

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

        g.restore();
    };

    var updateIntro = function(delta) {
        timePassed += delta;
        if (timePassed < 1000) {
            animScale = easing.easeOutBack(timePassed, 0, 1, 1000);
        } else if (timePassed < 2000) {
            animScale = 1;

            this.render = renderPlaying;
            this.update = updatePlaying;
        } else {
            // TODO finire animazione
        }
    };

    var renderPlaying = function() {
        g.save();

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

        // render balls, bricks and paddle
        this.balls.forEach(function(ball) {
            ball.render(g);
        });

        this.bricks.forEach(function(brick) {
            brick.render(g);
        });

        this.paddle.render(g);
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
    };

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

            closerBricks.forEach(function(brick, index) {
                var collisionPoint = collisionDetection.testSphereAABB(ball, brick);
                if (collisionPoint !== null) {
                    if (collisionPoint.x == brick.center.x - brick.halfSize.x || collisionPoint.x == brick.center.x + brick.halfSize.x) {
                        ball.direction.x *= -1;
                    }
                    if (collisionPoint.y == brick.center.y - brick.halfSize.y || collisionPoint.y == brick.center.y + brick.halfSize.y) {
                        ball.direction.y *= -1;
                    }
                    hitBricks.push(index);
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