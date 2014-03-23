/* Generated: 2014/03/23 02:10:07 */

/*
 * Kappanoid game
 * Authors: Francesco Cagnin, Marco Gasparini
 */

/*jslint browser: true, devel: true */
/*global $*/

// trick to create a namespace
var kappanoid = (function() {
    'use strict';
    // private stuff

    // keep count of the current mean frame per second
    var currentFPS = 0;

    // millisecond spent in one iteration of the main loop
    var loopTime = 0;

    // graphic context, used by the rendering process
    var g;

    // store all the configurable settings
    var settings = {
        canvasWidth: 800,
        canvasHeight: 600,
        canvasBackgroundColor: '#babbe0'
    };


    var init = function() {
        // TODO bind keys to actions
        // TODO generate settings interface
        initCanvas();

        startMainLoop();
    };

    var initCanvas = function() {
        var canvas = $('#gameCanvas')[0];
        g = canvas.getContext('2d');

        canvas.width = settings.canvasWidth;
        canvas.height = settings.canvasHeight;
    };

    var startMainLoop = function() {
        // timestamp of last game loop iteration (used to calculate delta time)
        var lastTime = Date.now();
        // frames since last FPS update
        var count = 0;
        // sum of all FPS since last update
        var totalFps = 0;

        setInterval(
            function() {
                var currentTime = Date.now();
                var elapsed = currentTime - lastTime;
                lastTime = currentTime;

                // calculate fps
                totalFps += 1000 / elapsed;
                count += 1;
                if (count % 50 === 0) {
                    currentFPS = totalFps / 50;
                    totalFps = 0;
                    count = 0;
                }

                var steps = 10;
                var ministep = elapsed / steps;

                while (steps > 0) {
                    updateGame(ministep);
                    steps -= 1;
                }

                renderGame(elapsed);

                loopTime = Date.now() - lastTime;
            },
            16
        );
    };

    var renderGame = function(delta) {
        var w = settings.canvasWidth;
        var h = settings.canvasHeight;

        g.clearRect(0, 0, w, h);

        g.save();
        g.fillStyle = settings.canvasBackgroundColor;
        g.fillRect(0, 0, w, h);
        g.strokeStyle = '#ff0000';
        g.strokeRect(0.5, 0.5, w - 1, h - 1);
        g.restore();

        g.textAlign = 'left';
        g.textBaseline = 'top';
        g.strokeText('FPS: ' + currentFPS, 5, 5);
        g.strokeText('DELTA: ' + delta, 5, 15);
        g.strokeText('LOOP: ' + loopTime, 5, 25);
    };

    var updateGame = function(delta) {
        // TODO update physics

    };

    /////////////////////////////////// Physics
    var baseVector2 = Object.defineProperties({}, {
        x: {
            value: 0,
            writable: true
        },

        y: {
            value: 0,
            writable: true
        },

        set: {
            value: function(vector) {
                console.assert(vector instanceof Vector2, vector);

                this.x = vector.x;
                this.y = vector.y;
                return this;
            }
        },

        clone: {
            value: function() {
                return new Vector2(this.x, this.y);
            }
        },

        add: {
            value: function(vector) {
                console.assert(vector instanceof Vector2, vector);

                this.x += vector.x;
                this.y += vector.y;
                return this;
            }
        },

        sub: {
            value: function(vector) {
                console.assert(vector instanceof Vector2, vector);

                this.x -= vector.x;
                this.y -= vector.y;
                return this;
            }
        },

        mul: {
            value: function(scale) {
                this.x *= scale;
                this.y *= scale;
                return this;
            }
        },

        dot: {
            value: function(vector) {
                console.assert(vector instanceof Vector2, vector);

                return this.x * vector.x + this.y * vector.y;
            }
        },

        normalize: {
            value: function() {
                var scale = this.length();
                this.x /= scale;
                this.y /= scale;

                console.assert(this.length() === 1, this.length());
                return this;
            }
        },

        distance: {
            value: function(vector) {
                console.assert(vector instanceof Vector2, vector);

                return Math.sqrt(this.squaredDistance(vector));
            }
        },

        squaredDistance: {
            value: function(vector) {
                console.assert(vector instanceof Vector2, vector);

                return (this.x - vector.x) * (this.x - vector.x) + (this.y - vector.y) * (this.y - vector.y);
            }
        },

        length: {
            value: function() {
                return Math.sqrt(this.squaredLength());
            }
        },

        squaredLength: {
            value: function() {
                return this.x * this.x + this.y * this.y;
            }
        },

        toString: {
            value: function() {
                return 'Vector2(x: ' + this.x + ' y: ' + this.y + ')';
            }
        }
    });

    var Vector2 = function(x, y) {
        if (x !== undefined && y !== undefined) {
            this.x = x;
            this.y = y;
        }
    };
    Vector2.prototype = baseVector2;

    function testVector2() {
        var vec1, vec2, tmp;
        vec1 = new Vector2();
        console.assert(vec1.x === 0 && vec1.y === 0, vec1.x, vec1.y);

        vec1 = new Vector2(3);
        console.assert(vec1.x === 0 && vec1.y === 0, vec1.x, vec1.y);

        vec1 = new Vector2(3, 4);
        console.assert(vec1.x === 3 && vec1.y === 4, vec1.x, vec1.y);
        console.assert(vec1.length() === 5, vec1.length());
        console.assert(vec1.squaredLength() === 25, vec1.squaredLength());
        console.assert((tmp = vec1.clone().normalize()).length() === 1, tmp.length());

        vec2 = new Vector2(3, 4);
        console.assert(vec1.distance(vec2) === 0, vec1.x, vec1.y);
        console.assert(vec1.squaredDistance(vec2) === 0, vec1.squaredDistance(vec2));
    }

    /////////////////////////////////// Game Objects
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

    // public stuff
    return {
        version: '0.0',
        init: init
    };
}());

// function to execute once the document is ready
$(document).ready(function() {
    'use strict';
    kappanoid.init();
});