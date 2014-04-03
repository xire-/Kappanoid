var Ball = function() {
    var addTrailVertex = function(vertex) {
        this._trailVertexes.push(vertex.clone());
    };

    var lerpColor = function(startColor, endColor, percent) {
        var color = {};
        color.r = startColor.r * percent + endColor.r * (1 - percent);
        color.g = startColor.g * percent + endColor.g * (1 - percent);
        color.b = startColor.b * percent + endColor.b * (1 - percent);
        return color;
    };

    var drawTrailSection = function(vertices, length, startColor, endColor, lineWidth) {
        console.assert(vertices.length > 0);

        var vertex;
        var prevVertex = vertices[0];
        var cumulativeLength = 0;
        for (var i = 1; i < vertices.length; i++) {
            var colorPrevVertex = lerpColor(startColor, endColor, 1 - (cumulativeLength / length));

            vertex = vertices[i];
            cumulativeLength += vertex.distance(prevVertex);
            var colorVertex = lerpColor(startColor, endColor, 1 - (cumulativeLength / length));

            g.beginPath();
            g.lineWidth = lineWidth;
            g.moveTo(prevVertex.x, prevVertex.y);

            var gradient = g.createLinearGradient(prevVertex.x, prevVertex.y, vertex.x, vertex.y);
            gradient.addColorStop(0, getColorString(colorPrevVertex));
            gradient.addColorStop(1, getColorString(colorVertex));
            g.strokeStyle = gradient;
            g.lineTo(vertex.x, vertex.y);
            g.stroke();
            g.closePath();

            prevVertex = vertex;
        }
    };

    var render = function() {
        g.save();

        g.save();

        g.translate(this.center.x, this.center.y);
        g.rotate(-Math.atan2(this.direction.x, this.direction.y));

        g.fillStyle = settings.colors ? this.color : '#FFFFFF';
        g.fillRect(-this.radius, -this.radius, this.radius * 2, this.radius * 2);

        g.restore();

        var trailSections = [{
            length: 100,
            startColor: {
                r: 255,
                g: 255,
                b: 255
            },
            endColor: {
                r: 255,
                g: 255,
                b: 255
            },
        }, {
            length: 100,
            startColor: {
                r: 255,
                g: 255,
                b: 255
            },
            endColor: {
                r: 0,
                g: 0,
                b: 0
            },
        }, ];

        // start from the last vertex saved (which is last in term of time) and go backward
        var i = this._trailVertexes.length - 1;

        // for each trail section to draw
        for (var k = 0; k < trailSections.length; k++) {
            var trailSectionVertexes = (k === 0) ? [this.center] : [trailSectionVertexes[trailSectionVertexes.length - 1]];
            var vertex;
            var prevVertex = trailSectionVertexes[0];
            var cumulativeLength = 0;

            // create an array of vertexes (computed from this._trailVertexes) with a total length of this trail section length
            for (; i >= 0; i--) {
                vertex = this._trailVertexes[i];
                var distanceFromPrevVertex = vertex.distance(prevVertex);
                cumulativeLength += distanceFromPrevVertex;
                if (cumulativeLength <= trailSections[k].length) {
                    trailSectionVertexes.push(vertex);
                } else {
                    // interpolate from prevVertex to vertex to compute the last vertex of this trail section
                    if (cumulativeLength - distanceFromPrevVertex <= trailSections[k].length) {
                        var midVertex = Vector2.lerp(vertex, prevVertex, (cumulativeLength - trailSections[k].length) / distanceFromPrevVertex);
                        trailSectionVertexes.push(midVertex);
                    }

                    if (cumulativeLength > trailSections[k].length) {
                        if (k === trailSections.length - 1) {
                            // all trail sections are computed; remove unused vertexes from this._trailVertexes
                            i -= 1;
                            for (; i >= 0; i--) {
                                this._trailVertexes.splice(i, 1);
                            }
                        }
                        break;
                    }
                }

                prevVertex = vertex;
            }

            // draw a line constructed using the created array of vertexes with the specified start color and end color
            drawTrailSection(trailSectionVertexes, trailSections[k].length, trailSections[k].startColor, trailSections[k].endColor, 4);
        }

        g.restore();
    };

    var update = function(delta) {
        this.center.add(this.direction.clone().mul(this.speed * delta / 1000));
    };


    var constructor = function Ball(center, radius, speed, direction, color) {
        this.center = center;
        this.radius = radius;
        this.speed = speed;
        this.direction = direction;
        this.color = color;
        this._trailVertexes = [];

        this.addTrailVertex = addTrailVertex;
        this.render = render;
        this.update = update;
    };

    constructor.prototype = {
        set center(value) {
            console.assert(value !== undefined && value instanceof Vector2, JSON.stringify(value));
            this._center = value;
        },
        get center() {
            return this._center;
        },

        set radius(value) {
            console.assert(value !== undefined && typeof value == 'number', JSON.stringify(value));
            this._radius = value;
        },
        get radius() {
            return this._radius;
        },

        set speed(value) {
            console.assert(value !== undefined && typeof value == 'number', JSON.stringify(value));
            this._speed = value;
        },
        get speed() {
            return this._speed;
        },

        set direction(value) {
            console.assert(value !== undefined && value instanceof Vector2, JSON.stringify(value));
            this._direction = value.normalize();
        },
        get direction() {
            return this._direction;
        },

        set color(value) {
            console.assert(value !== undefined && typeof value == 'string', JSON.stringify(value));
            this._color = value;
        },
        get color() {
            return this._color;
        },
    };

    return constructor;
}();

function testBall() {
    var center1 = new Vector2(3, 4);
    var radius1 = 10;
    var velocity1 = new Vector2(20, 20);
    var speed1 = velocity1.length();
    var direction1 = velocity1.clone().normalize();
    var color1 = '#abc';
    var ball1 = new Ball(center1, radius1, speed1, direction1, color1);
    console.assert(JSON.stringify(ball1.center) === JSON.stringify(center1) && ball1.radius === radius1 && ball1.speed === speed1 && JSON.stringify(ball1.direction) === JSON.stringify(direction1) && ball1.color === color1, JSON.stringify(ball1));

    console.log('testBall OK');
}