/* Generated: 2014/03/24 17:32:52 */

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

    // default relative dimensions
    var defaultWidth = 880;
    var defaultHeight = 660;

    // keep count of the current mean frame per second
    var currentFPS = 0;

    // millisecond spent in one iteration of the main loop
    var loopTime = 0;

    // graphic context, used by the rendering process
    var g;

    // world game ogject
    var world;

    // mouse position relative to upper left corner of canvas(scaled to relative coordinate)
    var mousePos;

    // main loop handle
    var mainLoopHandle;

    // store all the configurable settings
    var settings = {
        canvasBackgroundColor: '#000'
    };


    var init = function(width, height) {
        // TODO bind keys to actions
        // TODO generate settings interface
        initCanvas(width, height);

        world = new World(new Vector2(40, 50), new Vector2(800, 600));

        startMainLoop();
    };

    var initCanvas = function(width, height) {
        if (width === undefined || height === undefined) {
            width = defaultWidth;
            height = defaultHeight;
        }

        var canvas = $('#gameCanvas')[0];
        var scaleFactor = Math.min(width / defaultWidth, height / defaultHeight);

        canvas.width = defaultWidth * scaleFactor;
        canvas.height = defaultHeight * scaleFactor;

        g = canvas.getContext('2d');
        g.scale(scaleFactor, scaleFactor);

        mousePos = new Vector2();
        // receive mouse movement update
        window.onmousemove = function(e) {
            var x;
            var y;
            if (e.pageX !== undefined && e.pageY !== undefined) {
                x = e.pageX;
                y = e.pageY;
            } else {
                x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
            }

            x -= canvas.offsetLeft;
            y -= canvas.offsetTop;

            mousePos.x = x / scaleFactor;
            mousePos.y = y / scaleFactor;
        };
    };

    var startMainLoop = function() {
        // timestamp of last game loop iteration (used to calculate delta time)
        var lastTime = Date.now();
        // frames since last FPS update
        var count = 0;
        // sum of all FPS since last update
        var totalFps = 0;

        //remove previous main loop if any
        if (mainLoopHandle !== undefined) {
            clearInterval(mainLoopHandle);
        }
        mainLoopHandle = setInterval(
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
        g.save();

        //clear the previous frame
        g.fillStyle = settings.canvasBackgroundColor;
        g.fillRect(0, 0, defaultWidth, defaultHeight);

        //render the game world
        world.render(g);

        //TODO render the GUI

        g.fillStyle = '#0ff';
        g.fillRect(mousePos.x - 3, mousePos.y - 3, 6, 6);

        g.fillStyle = '#f00';
        g.textAlign = 'left';
        g.textBaseline = 'top';
        g.fillText('FPS: ' + currentFPS, 5, 5);
        g.fillText('DELTA: ' + delta, 5, 15);
        g.fillText('LOOP: ' + loopTime, 5, 25);

        g.restore();
    };

    var updateGame = function(delta) {
        // TODO update physics

    };

    var toString = function() {
        return JSON.stringify(settings);
    };

    /////////////////////////////////// Physics
    ///////////////// Vector2
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


    function testPhysics() {
        testVector2();
    }


    /////////////////////////////////// Game Objects
    ///////////////// Ball
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

        render: {
            value: function(g) {
                g.save();
                g.fillStyle = this.color;
                g.beginPath();
                g.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI);
                g.fill();
                g.restore();
            }
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


    ///////////////// Brick
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

        render: {
            value: function(g) {
                g.save();
                g.fillStyle = this.color;
                g.beginPath();
                g.rect(this.center.x - this.halfSize.x, this.center.y - this.halfSize.y, this.halfSize.x * 2, this.halfSize.y * 2);
                g.fill();
                g.restore();
            }
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


    ///////////////// Paddle
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

        render: {
            value: function(g) {
                g.save();
                g.fillStyle = this.color;
                g.beginPath();
                g.rect(this.center.x - this.halfSize.x, this.center.y - this.halfSize.y, this.halfSize.x * 2, this.halfSize.y * 2);
                g.fill();
                g.restore();
            }
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


    ///////////////// World
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

        render: {
            value: function(g) {
                var w = this.containerSize.x;
                var h = this.containerSize.y;
                g.save();
                g.translate(this.containerOffset.x, this.containerOffset.y);

                //clip the region
                g.beginPath();
                g.rect(0, 0, w, h);
                g.clip();

                // render background
                g.clearRect(0, 0, 1337, 1337);

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
                return 'World(balls: ' + this.balls + ', bricks: ' + this.bricks + ', paddle: ' + this.paddle + ')';
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
        console.assert(JSON.stringify(world1.balls) === JSON.stringify([]) && JSON.stringify(world1.bricks) === JSON.stringify([]) && JSON.stringify(world1.paddle) === JSON.stringify(new Paddle()));
    }


    function testGameObjects() {
        testBall();
        testBrick();
        testPaddle();
        testWorld();
    }


    // public stuff
    return {
        version: '0.0',
        init: init,
        toString: toString
    };
}());

// function to execute once the document is ready
$(document).ready(function() {
    'use strict';
    kappanoid.init();
});