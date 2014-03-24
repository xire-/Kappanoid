/* Generated: 2014/03/24 23:56:29 */

/*
 * Kappanoid game
 * Authors: Francesco Cagnin, Marco Gasparini
 */

/*jslint browser: true, devel: true */
/*global $*/

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

    var tmp = 0; //DELETE delete this shit
    var renderGame = function(delta) {
        g.save();

        //clear the previous frame
        g.fillStyle = settings.canvasBackgroundColor;
        g.fillRect(0, 0, defaultWidth, defaultHeight);

        //render the game world
        world.render(g);

        //TODO render the GUI

        // DELETE draw a box on current mouse position
        g.fillStyle = '#0ff';
        g.fillRect(mousePos.x - 3, mousePos.y - 3, 6, 6);

        // DELETE draw some animated boxes
        g.fillStyle = '#f0f';
        tmp += 1;
        g.fillRect(easing.easeOutBounce(tmp % 121, 140, -100, 120), 100, 6, 6);
        g.fillRect(easing.easeOutElastic(tmp % 121, 140, -100, 120), 110, 6, 6);

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
    var Vector2 = (function() {
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
        return Vector2;
    }());

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

    ///////////////// Easing
    /*
     * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
     *
     * Uses the built in easing capabilities added In jQuery 1.1
     * to offer multiple easing options
     *
     * TERMS OF USE - jQuery Easing
     *
     * Open source under the BSD License.
     *
     * Copyright Â© 2008 George McGinley Smith
     * All rights reserved.
     *
     * Redistribution and use in source and binary forms, with or without modification,
     * are permitted provided that the following conditions are met:
     *
     * Redistributions of source code must retain the above copyright notice, this list of
     * conditions and the following disclaimer.
     * Redistributions in binary form must reproduce the above copyright notice, this list
     * of conditions and the following disclaimer in the documentation and/or other materials
     * provided with the distribution.
     *
     * Neither the name of the author nor the names of contributors may be used to endorse
     * or promote products derived from this software without specific prior written permission.
     *
     * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
     * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
     * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
     *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
     *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
     *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
     * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
     *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
     * OF THE POSSIBILITY OF SUCH DAMAGE.
     *
     */

    // t: current time, b: begInnIng value, c: change In value, d: duration

    var easing = (function() {
        var easeInQuad = function(t, b, c, d) {
            return c * (t /= d) * t + b;
        };
        var easeOutQuad = function(t, b, c, d) {
            return -c * (t /= d) * (t - 2) + b;
        };
        var easeInOutQuad = function(t, b, c, d) {
            if ((t /= d / 2) < 1) {
                return c / 2 * t * t + b;
            }
            return -c / 2 * ((--t) * (t - 2) - 1) + b;
        };
        var easeInCubic = function(t, b, c, d) {
            return c * (t /= d) * t * t + b;
        };
        var easeOutCubic = function(t, b, c, d) {
            return c * ((t = t / d - 1) * t * t + 1) + b;
        };
        var easeInOutCubic = function(t, b, c, d) {
            if ((t /= d / 2) < 1) {
                return c / 2 * t * t * t + b;
            }
            return c / 2 * ((t -= 2) * t * t + 2) + b;
        };
        var easeInQuart = function(t, b, c, d) {
            return c * (t /= d) * t * t * t + b;
        };
        var easeOutQuart = function(t, b, c, d) {
            return -c * ((t = t / d - 1) * t * t * t - 1) + b;
        };
        var easeInOutQuart = function(t, b, c, d) {
            if ((t /= d / 2) < 1) {
                return c / 2 * t * t * t * t + b;
            }
            return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
        };
        var easeInQuint = function(t, b, c, d) {
            return c * (t /= d) * t * t * t * t + b;
        };
        var easeOutQuint = function(t, b, c, d) {
            return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
        };
        var easeInOutQuint = function(t, b, c, d) {
            if ((t /= d / 2) < 1) {
                return c / 2 * t * t * t * t * t + b;
            }
            return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
        };
        var easeInSine = function(t, b, c, d) {
            return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
        };
        var easeOutSine = function(t, b, c, d) {
            return c * Math.sin(t / d * (Math.PI / 2)) + b;
        };
        var easeInOutSine = function(t, b, c, d) {
            return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
        };
        var easeInExpo = function(t, b, c, d) {
            return (t === 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
        };
        var easeOutExpo = function(t, b, c, d) {
            return (t === d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
        };
        var easeInOutExpo = function(t, b, c, d) {
            if (t === 0) {
                return b;
            }
            if (t === d) {
                return b + c;
            }
            if ((t /= d / 2) < 1) {
                return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
            }
            return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
        };
        var easeInCirc = function(t, b, c, d) {
            return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
        };
        var easeOutCirc = function(t, b, c, d) {
            return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
        };
        var easeInOutCirc = function(t, b, c, d) {
            if ((t /= d / 2) < 1) {
                return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
            }
            return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
        };
        var easeInElastic = function(t, b, c, d) {
            var s = 1.70158;
            var p = 0;
            var a = c;
            if (t === 0) {
                return b;
            }
            if ((t /= d) === 1) {
                return b + c;
            }
            if (!p) {
                p = d * 0.3;
            }
            if (a < Math.abs(c)) {
                a = c;
                s = p / 4;
            } else {
                s = p / (2 * Math.PI) * Math.asin(c / a);
            }
            return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        };
        var easeOutElastic = function(t, b, c, d) {
            var s = 1.70158;
            var p = 0;
            var a = c;
            if (t === 0) {
                return b;
            }
            if ((t /= d) === 1) {
                return b + c;
            }
            if (!p) {
                p = d * 0.3;
            }
            if (a < Math.abs(c)) {
                a = c;
                s = p / 4;
            } else {
                s = p / (2 * Math.PI) * Math.asin(c / a);
            }
            return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
        };
        var easeInOutElastic = function(t, b, c, d) {
            var s = 1.70158;
            var p = 0;
            var a = c;
            if (t === 0) {
                return b;
            }
            if ((t /= d / 2) === 2) {
                return b + c;
            }
            if (!p) {
                p = d * (0.3 * 1.5);
            }
            if (a < Math.abs(c)) {
                a = c;
                s = p / 4;
            } else {
                s = p / (2 * Math.PI) * Math.asin(c / a);
            }
            if (t < 1) {
                return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
            }
            return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * 0.5 + c + b;
        };
        var easeInBack = function(t, b, c, d, s) {
            if (s === undefined) {
                s = 1.70158;
            }
            return c * (t /= d) * t * ((s + 1) * t - s) + b;
        };
        var easeOutBack = function(t, b, c, d, s) {
            if (s === undefined) {
                s = 1.70158;
            }
            return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
        };
        var easeInOutBack = function(t, b, c, d, s) {
            if (s === undefined) {
                s = 1.70158;
            }
            if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
            return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
        };
        var easeInBounce = function(t, b, c, d) {
            return c - easeOutBounce(d - t, 0, c, d) + b;
        };
        var easeOutBounce = function(t, b, c, d) {
            if ((t /= d) < (1 / 2.75)) {
                return c * (7.5625 * t * t) + b;
            } else if (t < (2 / 2.75)) {
                return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b;
            } else if (t < (2.5 / 2.75)) {
                return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b;
            } else {
                return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b;
            }
        };
        var easeInOutBounce = function(t, b, c, d) {
            if (t < d / 2) {
                return easeInBounce(t * 2, 0, c, d) * 0.5 + b;
            }
            return easeOutBounce(t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
        };

        return {
            easeInQuad: easeInQuad,
            easeOutQuad: easeOutQuad,
            easeInOutQuad: easeInOutQuad,
            easeInCubic: easeInCubic,
            easeOutCubic: easeOutCubic,
            easeInOutCubic: easeInOutCubic,
            easeInQuart: easeInQuart,
            easeOutQuart: easeOutQuart,
            easeInOutQuart: easeInOutQuart,
            easeInQuint: easeInQuint,
            easeOutQuint: easeOutQuint,
            easeInOutQuint: easeInOutQuint,
            easeInSine: easeInSine,
            easeOutSine: easeOutSine,
            easeInOutSine: easeInOutSine,
            easeInExpo: easeInExpo,
            easeOutExpo: easeOutExpo,
            easeInOutExpo: easeInOutExpo,
            easeInCirc: easeInCirc,
            easeOutCirc: easeOutCirc,
            easeInOutCirc: easeInOutCirc,
            easeInElastic: easeInElastic,
            easeOutElastic: easeOutElastic,
            easeInOutElastic: easeInOutElastic,
            easeInBack: easeInBack,
            easeOutBack: easeOutBack,
            easeInOutBack: easeInOutBack,
            easeInBounce: easeInBounce,
            easeOutBounce: easeOutBounce,
            easeInOutBounce: easeInOutBounce
        };
    }());


    /*
     *
     * TERMS OF USE - EASING EQUATIONS
     *
     * Open source under the BSD License.
     *
     * Copyright Â© 2001 Robert Penner
     * All rights reserved.
     *
     * Redistribution and use in source and binary forms, with or without modification,
     * are permitted provided that the following conditions are met:
     *
     * Redistributions of source code must retain the above copyright notice, this list of
     * conditions and the following disclaimer.
     * Redistributions in binary form must reproduce the above copyright notice, this list
     * of conditions and the following disclaimer in the documentation and/or other materials
     * provided with the distribution.
     *
     * Neither the name of the author nor the names of contributors may be used to endorse
     * or promote products derived from this software without specific prior written permission.
     *
     * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
     * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
     * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
     *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
     *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
     *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
     * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
     *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
     * OF THE POSSIBILITY OF SUCH DAMAGE.
     *
     */

    ///////////////// CollisionDetection
    var collisionDetection = {
        // Returns 2 times the signed triangle area. The result is positive if
        // abc is ccw, negative if abc is cw, zero if abc is degenerate.
        signed2DTriArea: function(a, b, c) {
            return (a.x - c.x) * (b.y - c.y) - (a.y - c.y) * (b.x - c.x);
        },

        // Test if segments ab and cd overlap. If they do, compute and return
        // intersection t value along ab and intersection position p
        test2DSegmentSegment: function(a, b, c, d) {
            // Sign of areas correspond to which side of ab points c and d are
            var a1 = this.signed2DTriArea(a, b, d); // Compute winding of abd (+ or -)
            var a2 = this.signed2DTriArea(a, b, c); // To intersect, must have sign opposite of a1
            // If c and d are on different sides of ab, areas have different signs
            if (a1 * a2 < 0) {
                // Compute signs for a and b with respect to segment cd
                var a3 = this.signed2DTriArea(c, d, a); // Compute winding of cda (+ or -)
                // Since area is constant a1 - a2 = a3 - a4, or a4 = a3 + a2 - a1
                // float a4 = Signed2DTriArea(c, d, b); // Must have opposite sign of a3
                var a4 = a3 + a2 - a1;
                // Points a and b on different sides of cd if areas have different signs
                if (a3 * a4 < 0) {
                    // Segments intersect. Find intersection point along L(t) = a + t * (b - a).
                    // Given height h1 of an over cd and height h2 of b over cd,
                    // t = h1 / (h1 - h2) = (b*h1/2) / (b*h1/2 - b*h2/2) = a3 / (a3 - a4),
                    // where b (the base of the triangles cda and cdb, i.e., the length
                    // of cd) cancels out.
                    var t = a3 / (a3 - a4);
                    var p = new Vector2(a.x + t * (b.x - a.x), a.y + t * (b.y - a.y)); // a + t * (b - a)
                    return {
                        t: t,
                        p: p
                    };
                }
            }
            // Segments not intersecting (or collinear)
            return null;
        },
    };

    function testCollisionDetection() {
        var a = new Vector2(2, 2);
        var b = new Vector2(4, 2);
        var c = new Vector2(3, 1);
        var d = new Vector2(3, 3);
        var r = collisionDetection.test2DSegmentSegment(a, b, c, d);
        console.assert(r.t === 0.5 && JSON.stringify(r.p) === JSON.stringify(new Vector2(3, 2)));

        a = new Vector2(2, 2);
        b = new Vector2(4, 2);
        c = new Vector2(3, 3);
        d = new Vector2(3, 3);
        r = collisionDetection.test2DSegmentSegment(a, b, c, d);
        console.assert(r === null);

        a = new Vector2(0, 0);
        b = new Vector2(0, 1);
        c = new Vector2(0, 1);
        d = new Vector2(1, 1);
        r = collisionDetection.test2DSegmentSegment(a, b, c, d);
        console.assert(r === null);

        a = new Vector2(0, 0);
        b = new Vector2(0, 1);
        c = new Vector2(0, 1);
        d = new Vector2(0, 0.75);
        r = collisionDetection.test2DSegmentSegment(a, b, c, d);
        console.assert(r === null);

        a = new Vector2(0, 0);
        b = new Vector2(0, 1);
        c = new Vector2(-1, 0.75);
        d = new Vector2(1, 0.75);
        r = collisionDetection.test2DSegmentSegment(a, b, c, d);
        console.assert(r.t === 0.75 && JSON.stringify(r.p) === JSON.stringify(new Vector2(0, 0.75)));
    }


    function testPhysics() {
        testVector2();
        testCollisionDetection();
    }


    /////////////////////////////////// Game Objects
    ///////////////// Ball
    var Ball = (function() {
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
        return Ball;
    }());

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
    var Brick = (function() {
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
        return Brick;
    }());

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
    var Paddle = (function() {
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
        return Paddle;
    }());

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
    var World = (function() {
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
        return World;
    }());

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