var World = function() {
    var render = function() {
        g.save();
        g.translate(this.containerOffset.x, this.containerOffset.y);

        // clip the region
        g.beginPath();
        g.rect(0, 0, this.containerSize.x, this.containerSize.y);
        g.clip();

        // render background
        g.fillStyle = settings.worldBackgroundColor;
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
        // update paddle position (clamped)
        var paddle = this.paddle;
        paddle.center.x = Math.min(Math.max(mousePos.x - this.containerOffset.x, 0 + this.paddle.halfSize.x), 800 - this.paddle.halfSize.x);

        this.balls.forEach(function(ball) {
            ball.update(delta);

            // check and handle collisions with borders
            if (ball.center.x - ball.radius < 0) {
                ball.center.x = -ball.center.x + ball.radius * 2;
                ball.velocity.x *= -1;
            }
            if (ball.center.y - ball.radius < 0) {
                ball.center.y = -ball.center.y + ball.radius * 2;
                ball.velocity.y *= -1;
            }
            if (ball.center.x + ball.radius >= 800) {
                ball.center.x = 799 * 2 - ball.center.x - ball.radius;
                ball.velocity.x *= -1;
            }
            if (ball.center.y + ball.radius >= 600) {
                ball.center.y = 599 * 2 - ball.center.y - ball.radius;
                ball.velocity.y *= -1;
            }

            // check ball vs bottom and paddle
            if (ball.center.y + ball.radius >= paddle.center.y - paddle.halfSize.y) {
                // if it's actualy going down
                if (ball.velocity.y > 0) {
                    var collisionPoint = collisionDetection.testSphereAABB(ball, paddle);
                    if (collisionPoint !== null) {
                        // determine resultant direction based on collisionPoint
                        var speed = ball.velocity.length();
                        var angle = (collisionPoint.x - paddle.center.x) / paddle.halfSize.x;
                        ball.velocity.x = Math.sin(angle) * speed;
                        ball.velocity.y = -Math.cos(angle) * speed;
                    }
                }

                // check if ball is dead
                if (ball.center.y >= paddle.center.y + paddle.halfSize.y) {
                    // ball is dead, remove it
                    ball.velocity.x = ball.velocity.y = 0;
                }
            }
        });
    };

    var toString = function() {
        return JSON.stringify(this);
    };


    var constructor = function World(containerOffset, containerSize, levelConf) {
        this.containerOffset = containerOffset;
        this.containerSize = containerSize;
        // todo this.levelConf = levelConf;

        this.render = render;
        this.update = update;
        this.toString = toString;

        // initialize all game objects
        this.balls = [];
        this.balls.push(new Ball(new Vector2(400, 300), 7, new Vector2(100, -100), '#fff'));
        this.balls.push(new Ball(new Vector2(50, 50), 7, new Vector2(-100, -100), '#fff'));
        this.balls.push(new Ball(new Vector2(123, 456), 7, new Vector2(-300, -300), '#fff'));

        this.bricks = [];
        var blockHalfSize = new Vector2(25, 10);
        for (var i = 0; i < 10; i++) {
            for (var j = 0; j < 8; j++) {
                var blockCenter = new Vector2(
                    105 + blockHalfSize.x + (i % 10) * (blockHalfSize.x * 2 + 10),
                    30 + 47 + (j % 8) * (blockHalfSize.y * 2 + 10)
                );
                this.bricks.push(new Brick(blockCenter, blockHalfSize, 1, '#fff'));
            }
        }

        var paddleHalfSize = new Vector2(50, 15);
        this.paddle = new Paddle(new Vector2(800 / 2, 600 + paddleHalfSize.y * 2 / 2 - 50), paddleHalfSize, 1, '#fff');
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