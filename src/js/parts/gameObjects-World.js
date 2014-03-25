var World = (function() {
    var baseWorld = Object.defineProperties({}, {
        _containerOffset: {
            writable: true
        },
        get containerOffset() {
            return this._containerOffset;
        },
        set containerOffset(vector) {
            console.assert(vector instanceof Vector2);
            this._containerOffset = vector;
        },

        _containerSize: {
            writable: true
        },
        get containerSize() {
            return this._containerSize;
        },
        set containerSize(vector) {
            console.assert(vector instanceof Vector2);
            this._containerSize = vector;
        },

        balls: {
            writable: true
        },

        bricks: {
            writable: true
        },

        paddle: {
            writable: true
        },

        render: {
            value: function(delta) {
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
            }
        },

        update: {
            value: function(delta) {
                // update paddle position (clamped)
                this.paddle.center.x = Math.min(Math.max(mousePos.x - this.containerOffset.x, 0 + this.paddle.halfSize.x), 800 - this.paddle.halfSize.x);
            }
        },

        toString: {
            value: function() {
                return 'World(balls: ' + this.balls + ', bricks: ' + this.bricks + ', paddle: ' + this.paddle + ')';
            }
        }
    });

    var World = function(containerOffset, containerSize, levelConf) {
        console.assert(containerOffset !== undefined && containerOffset instanceof Vector2, containerOffset.toString());
        this.containerOffset = containerOffset;

        console.assert(containerSize !== undefined && containerSize instanceof Vector2, containerSize.toString());
        this.containerSize = containerSize;

        // todo
        // console.assert(levelConf !== undefined, levelConf.toString());
        // this.levelConf = levelConf

        // initialize all game objects
        this.balls = [];
        this.balls.push(new Ball(new Vector2(400, 300), 7, '#00f'));

        this.bricks = [];
        this.bricks.push(new Brick(new Vector2(200, 200), new Vector2(25, 10), 1, '#ff0'));

        this.paddle = new Paddle(new Vector2(400, 500), new Vector2(50, 15), 1, '#0f0');
    };
    World.prototype = baseWorld;
    return World;
}());