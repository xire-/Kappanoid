var World = function() {
    var reset = function() {
        this.balls = [];
        this.balls.push(new Ball(new Vector2(400, 500), 7, 300, new Vector2(1, -1), settings.ballDefaultColor));
        this.balls.push(new Ball(new Vector2(90, 57-20), 7, 300, new Vector2(1, 2), settings.ballDefaultColor));
        this.balls.push(new Ball(new Vector2(123, 456), 7, 300, new Vector2(-1, -1), settings.ballDefaultColor));

        this.bricks = [];
        var blockHalfSize = new Vector2(25, 10);
        for (var i = 0; i < 10; i++) {
            for (var j = 0; j < 8; j++) {
                var blockCenter = new Vector2(
                    105 + blockHalfSize.x + i * (blockHalfSize.x * 2 + 10),
                    30 + 47 + j * (blockHalfSize.y * 2 + 10)
                );
                this.bricks.push(new Brick(blockCenter, blockHalfSize, 1, settings.brickDefaultColor));
            }
        }

        var paddleHalfSize = new Vector2(50, 15);
        this.paddle = new Paddle(new Vector2(800 / 2, 600 + paddleHalfSize.y * 2 / 2 - 50), paddleHalfSize, 1, settings.paddleDefaultColor);
    };

    var render = function() {
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

    var update = function(delta) {
        if (delta === 0) {
            return;
        }

        // update paddle position (clamped)
        var paddle = this.paddle;
        var bricks = this.bricks;
        paddle.center.x = Math.min(Math.max(mousePos.x - this.containerOffset.x, 0 + this.paddle.halfSize.x), 800 - this.paddle.halfSize.x);

        this.balls.forEach(function(ball) {
            ball.update(delta);

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

            // check ball vs bottom and paddle
            if (ball.center.y + ball.radius >= paddle.center.y - paddle.halfSize.y) {
                // if it's actualy going down
                if (ball.direction.y > 0) {
                    var collisionPoint = collisionDetection.testSphereAABB(ball, paddle);
                    if (collisionPoint !== null) {
                        // determine resultant direction based on collisionPoint
                        var angle = (collisionPoint.x - paddle.center.x) / paddle.halfSize.x;
                        ball.direction.x = Math.sin(angle);
                        ball.direction.y = -Math.cos(angle);
                    }
                }

                // check if ball is dead
                if (ball.center.y >= paddle.center.y + paddle.halfSize.y) {
                    // ball is dead, remove it
                    ball.direction.x = ball.direction.y = 0;
                }
            }

            // TODO get closer bricks from pruning structure
            var closerBricks = bricks;
            closerBricks.forEach(function(brick) {
                var collisionPoint = collisionDetection.testSphereAABB(ball, brick);
                if (collisionPoint !== null) {
                    if (collisionPoint.x == brick.center.x - brick.halfSize.x || collisionPoint.x == brick.center.x + brick.halfSize.x) {
                        ball.direction.x *= -1;
                    }
                    if (collisionPoint.y == brick.center.y - brick.halfSize.y || collisionPoint.y == brick.center.y + brick.halfSize.y) {
                        ball.direction.y *= -1;
                    }
                }
            });
        });
    };

    var toString = function() {
        return JSON.stringify(this);
    };


    var constructor = function World(containerOffset, containerSize) {
        this.containerOffset = containerOffset;
        this.containerSize = containerSize;
        // TODO this.levelConf = levelConf;
        this.backgroundColor = settings.backgroundDefaultColor;
        this.bordersColor = settings.bordersDefaultColor;

        this.reset = reset;
        this.render = render;
        this.update = update;
        this.toString = toString;

        // initialize all game objects
        this.reset();
    };

    constructor.prototype = {
        set containerOffset(value) {
            console.assert(value !== undefined && value instanceof Vector2, value.toString());
            this._containerOffset = value;
        },
        get containerOffset() {
            return this._containerOffset;
        },

        set containerSize(value) {
            console.assert(value !== undefined && value instanceof Vector2, value.toString());
            this._containerSize = value;
        },
        get containerSize() {
            return this._containerSize;
        }
    };

    return constructor;
}();