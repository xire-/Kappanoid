var baseBall = Object.defineProperties({}, {
    _center: {
        value: new Vector2(),
        writable: true
    },
    get center() {
        return this._center;
    },
    set center(vector) {
        console.assert(vector instanceof Vector2);
        this._center = vector;
    },

    radius: {
        value: 5,
        writable: true
    },

    color: {
        value: '#f00',
        writable: true
    },

    clone: {
        value: function() {
            return new Ball(this.center, this.radius, this.color);
        }
    },

    toString: {
        value: function() {
            return 'Ball(center: ' + this.center + ', radius: ' + this.radius + ', color: ' + this.color + ')';
        }
    }
});

var Ball = function(center, radius, color) {
    if (center !== undefined && center instanceof Vector2) {
        this.center = center;
    }

    if (radius !== undefined && typeof radius == 'number') {
        this.radius = radius;
    }

    if (color !== undefined && typeof color == 'string') {
        this.color = color;
    }
};
Ball.prototype = baseBall;

function testBall() {
    var ball1 = new Ball();
    console.assert(JSON.stringify(ball1.center) === JSON.stringify(new Vector2()) && ball1.radius === 5 && ball1.color === '#f00', ball1.toString());

    var center1 = new Vector2(3, 4);
    ball1 = new Ball(center1);
    console.assert(JSON.stringify(ball1.center) === JSON.stringify(center1) && ball1.radius === 5 && ball1.color === '#f00', ball1.toString());

    var radius1 = 10;
    ball1 = new Ball(center1, radius1);
    console.assert(JSON.stringify(ball1.center) === JSON.stringify(center1) && ball1.radius === radius1 && ball1.color === '#f00', ball1.toString());

    ball1 = new Ball(center1, radius1, '#fff');
    console.assert(JSON.stringify(ball1.center) === JSON.stringify(center1) && ball1.radius === radius1 && ball1.color === '#fff', ball1.toString());

    var ball2 = ball1.clone();
    console.assert(JSON.stringify(ball1) === JSON.stringify(ball2));
}


var baseBrick = Object.defineProperties({}, {
    _center: {
        value: new Vector2(),
        writable: true
    },
    get center() {
        return this._center;
    },
    set center(vector) {
        console.assert(vector instanceof Vector2);
        this._center = vector;
    },

    _halfSize: {
        value: new Vector2(10, 20),
        writable: true
    },
    get halfSize() {
        return this._halfSize;
    },
    set halfSize(vector) {
        console.assert(vector instanceof Vector2);
        this._halfSize = vector;
    },

    life: {
        value: 1,
        writable: true
    },

    color: {
        value: '#f00',
        writable: true
    },

    clone: {
        value: function() {
            return new Brick(this.center, this.halfSize, this.life, this.color);
        }
    },

    toString: {
        value: function() {
            return 'Brick(center: ' + this.center + ', halfSize: ' + this.halfSize + ', life: ' + this.life + ', color: ' + this.color + ')';
        }
    }
});

var Brick = function(center, halfSize, life, color) {
    if (center !== undefined && center instanceof Vector2) {
        this.center = center;
    }

    if (halfSize !== undefined && halfSize instanceof Vector2) {
        this.halfSize = halfSize;
    }

    if (life !== undefined && typeof life == 'number') {
        this.life = life;
    }

    if (color !== undefined && typeof color == 'string') {
        this.color = color;
    }
};
Brick.prototype = baseBrick;

function testBrick() {
    var brick1 = new Brick();
    console.assert(JSON.stringify(brick1.center) === JSON.stringify(new Vector2()) && JSON.stringify(brick1.halfSize) === JSON.stringify(new Vector2(10, 20)) && brick1.life === 1 && brick1.color === '#f00', brick1.toString());

    var center1 = new Vector2(3, 4);
    brick1 = new Brick(center1);
    console.assert(JSON.stringify(brick1.center) === JSON.stringify(center1) && JSON.stringify(brick1.halfSize) === JSON.stringify(new Vector2(10, 20)) && brick1.life === 1 && brick1.color === '#f00', brick1.toString());

    var halfSize1 = new Vector2(100, 300);
    brick1 = new Brick(center1, halfSize1);
    console.assert(JSON.stringify(brick1.center) === JSON.stringify(center1) && JSON.stringify(brick1.halfSize) === JSON.stringify(halfSize1) && brick1.life === 1 && brick1.color === '#f00', brick1.toString());

    brick1 = new Brick(center1, halfSize1, 4);
    console.assert(JSON.stringify(brick1.center) === JSON.stringify(center1) && JSON.stringify(brick1.halfSize) === JSON.stringify(halfSize1) && brick1.life === 4 && brick1.color === '#f00', brick1.toString());

    brick1 = new Brick(center1, halfSize1, 4, '#fff');
    console.assert(JSON.stringify(brick1.center) === JSON.stringify(center1) && JSON.stringify(brick1.halfSize) === JSON.stringify(halfSize1) && brick1.life === 4 && brick1.color === '#fff', brick1.toString());

    var brick2 = brick1.clone();
    console.assert(JSON.stringify(brick1) === JSON.stringify(brick2));
}


var basePaddle = Object.defineProperties({}, {
    _center: {
        value: new Vector2(),
        writable: true
    },
    get center() {
        return this._center;
    },
    set center(vector) {
        console.assert(vector instanceof Vector2);
        this._center = vector;
    },

    _halfSize: {
        value: new Vector2(10, 20),
        writable: true
    },
    get halfSize() {
        return this._halfSize;
    },
    set halfSize(vector) {
        console.assert(vector instanceof Vector2);
        this._halfSize = vector;
    },

    life: {
        value: 1,
        writable: true
    },

    color: {
        value: '#f00',
        writable: true
    },

    clone: {
        value: function() {
            return new Paddle(this.center, this.halfSize, this.life, this.color);
        }
    },

    toString: {
        value: function() {
            return 'Paddle(center: ' + this.center + ', halfSize: ' + this.halfSize + ', life: ' + this.life + ', color: ' + this.color + ')';
        }
    }
});

var Paddle = function(center, halfSize, life, color) {
    if (center !== undefined && center instanceof Vector2) {
        this.center = center;
    }

    if (halfSize !== undefined && halfSize instanceof Vector2) {
        this.halfSize = halfSize;
    }

    if (life !== undefined && typeof life == 'number') {
        this.life = life;
    }

    if (color !== undefined && typeof color == 'string') {
        this.color = color;
    }
};
Paddle.prototype = basePaddle;

function testPaddle() {
    var paddle1 = new Paddle();
    console.assert(JSON.stringify(paddle1.center) === JSON.stringify(new Vector2()) && JSON.stringify(paddle1.halfSize) === JSON.stringify(new Vector2(10, 20)) && paddle1.life === 1 && paddle1.color === '#f00', paddle1.toString());

    var center1 = new Vector2(3, 4);
    paddle1 = new Brick(center1);
    console.assert(JSON.stringify(paddle1.center) === JSON.stringify(center1) && JSON.stringify(paddle1.halfSize) === JSON.stringify(new Vector2(10, 20)) && paddle1.life === 1 && paddle1.color === '#f00', paddle1.toString());

    var halfSize1 = new Vector2(100, 300);
    paddle1 = new Brick(center1, halfSize1);
    console.assert(JSON.stringify(paddle1.center) === JSON.stringify(center1) && JSON.stringify(paddle1.halfSize) === JSON.stringify(halfSize1) && paddle1.life === 1 && paddle1.color === '#f00', paddle1.toString());

    paddle1 = new Brick(center1, halfSize1, 4);
    console.assert(JSON.stringify(paddle1.center) === JSON.stringify(center1) && JSON.stringify(paddle1.halfSize) === JSON.stringify(halfSize1) && paddle1.life === 4 && paddle1.color === '#f00', paddle1.toString());

    paddle1 = new Brick(center1, halfSize1, 4, '#fff');
    console.assert(JSON.stringify(paddle1.center) === JSON.stringify(center1) && JSON.stringify(paddle1.halfSize) === JSON.stringify(halfSize1) && paddle1.life === 4 && paddle1.color === '#fff', paddle1.toString());

    var paddle2 = paddle1.clone();
    console.assert(JSON.stringify(paddle1) === JSON.stringify(paddle2));
}


var baseContainerBox = Object.defineProperties({}, {
    _size: {
        value: new Vector2(800, 600),
        writable: true
    },
    get size() {
        return this._size;
    },
    set size(vector) {
        console.assert(vector instanceof Vector2);
        this._size = vector;
    },

    toString: {
        value: function() {
            return 'ContainerBox(size: ' + this.size + ')';
        }
    }
});

var ContainerBox = function(size) {
    if (size !== undefined && size instanceof Vector2) {
        this.size = size;
    }
};
ContainerBox.prototype = baseContainerBox;

function testContainerBox() {
    var containerBox1 = new ContainerBox();
    console.assert(JSON.stringify(containerBox1.size) === JSON.stringify(new Vector2(800, 600)));

    var size1 = new Vector2(400, 200);
    containerBox1 = new ContainerBox(size1);
    console.assert(JSON.stringify(containerBox1.size) === JSON.stringify(size1));
}


var baseWorld = Object.defineProperties({}, {
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

    toString: {
        value: function() {
            return 'World(balls: ' + this.balls + ', balls: ' + this.balls + ', paddle: ' + this.paddle + ', containerBox: ' + this.containerBox + ')';
        }
    }
});

var World = function(containerBox) {
    if (containerBox !== undefined && containerBox instanceof ContainerBox) {
        this.containerBox = containerBox;
    }
};
World.prototype = baseWorld;

function testWorld() {
    var world1 = new World();
    console.assert(JSON.stringify(world1.balls) === JSON.stringify([]) && JSON.stringify(world1.bricks) === JSON.stringify([]) && JSON.stringify(world1.paddle) === JSON.stringify(new Paddle()) && JSON.stringify(world1.containerBox) === JSON.stringify(new ContainerBox()));

    var containerBox1 = new ContainerBox(new Vector2(400, 300));
    world1 = new World(containerBox1);
    console.assert(JSON.stringify(world1.balls) === JSON.stringify([]) && JSON.stringify(world1.bricks) === JSON.stringify([]) && JSON.stringify(world1.paddle) === JSON.stringify(new Paddle()) && JSON.stringify(world1.containerBox) === JSON.stringify(containerBox1));
}


function testGameObjects() {
    testBall();
    testBrick();
    testPaddle();
    testContainerBox();
    testWorld();
}