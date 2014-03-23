var baseWorld = Object.defineProperties({}, {
    _containerOffset: {
        value: new Vector2(),
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
        value: new Vector2(720, 540),
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
        value: [],
        writable: true
    },

    bricks: {
        value: [],
        writable: true
    },

    paddle: {
        value: new Paddle(),
        writable: true
    },

    containerBox: {
        value: new ContainerBox(),
        writable: true
    },

    render: {
        value: function(g) {
            g.save();
            g.translate(this.containerOffset.x, this.containerOffset.y);
            // render background

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

    toString: {
        value: function() {
            return 'World(balls: ' + this.balls + ', bricks: ' + this.bricks + ', paddle: ' + this.paddle + ', containerBox: ' + this.containerBox + ')';
        }
    }
});

var World = function(containerOffset, containerSize, levelConf) {
    if (containerOffset !== undefined && containerOffset instanceof Vector2) {
        this.containerOffset = containerOffset;
    }

    if (containerSize !== undefined && containerSize instanceof Vector2) {
        this.containerSize = containerSize;
    }

    if (levelConf !== undefined) {
        console.assert(false, 'todo');
    }

    // initialize all game objects
    this.balls.push(new Ball(new Vector2(400, 300), 5, '#00f'));
    this.bricks.push(new Brick(new Vector2(200, 200), new Vector2(10, 3), 1, '#ff0'));
    this.paddle = new Paddle(new Vector2(400, 500), new Vector2(50, 5), 1, '#0f0');
};
World.prototype = baseWorld;

function testWorld() {
    var world1 = new World();
    console.assert(JSON.stringify(world1.balls) === JSON.stringify([]) && JSON.stringify(world1.bricks) === JSON.stringify([]) && JSON.stringify(world1.paddle) === JSON.stringify(new Paddle()) && JSON.stringify(world1.containerBox) === JSON.stringify(new ContainerBox()));

    var containerBox1 = new ContainerBox(new Vector2(400, 300));
    world1 = new World(containerBox1);
    console.assert(JSON.stringify(world1.balls) === JSON.stringify([]) && JSON.stringify(world1.bricks) === JSON.stringify([]) && JSON.stringify(world1.paddle) === JSON.stringify(new Paddle()) && JSON.stringify(world1.containerBox) === JSON.stringify(containerBox1));
}