var Ball = function() {
    var addTrailVertex = function(vertex) {
        this._trailVertexes.push(vertex.clone());
    };

    var resetTrail = function() {
        this._trailVertexes = [];
        this.addTrailVertex(this.center);
    };

    var lerpColor = function(startColor, endColor, percent) {
        return {
            r: startColor.r * percent + endColor.r * (1 - percent),
            g: startColor.g * percent + endColor.g * (1 - percent),
            b: startColor.b * percent + endColor.b * (1 - percent),
            a: startColor.a * percent + endColor.a * (1 - percent),
        };
    };

    var drawTrail = function(vertices, maxLength, startColor, endColor, lineWidth) {
        console.assert(vertices.length > 0);

        var vertex;
        var prevVertex = vertices[0];
        var cumulativeLength = 0;
        for (var i = 1; i < vertices.length; i++) {
            var colorPrevVertex = lerpColor(startColor, endColor, 1 - (cumulativeLength / maxLength));

            vertex = vertices[i];
            cumulativeLength += vertex.distance(prevVertex);
            var colorVertex = lerpColor(startColor, endColor, 1 - (cumulativeLength / maxLength));
            console.log(getColorString(colorPrevVertex));
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

        // draw ball trail
        if (settings.ballTrail) {
            var trailMaxLength = 150;
            var trailVertexes = [this.center];
            var vertex;
            var prevVertex = trailVertexes[0];
            var cumulativeLength = 0;

            // create an array of vertexes (computed from this._trailVertexes) with a total length of trailMaxLength
            for (var i = this._trailVertexes.length - 1; i >= 0; i--) {
                vertex = this._trailVertexes[i];
                var distanceFromPrevVertex = vertex.distance(prevVertex);
                cumulativeLength += distanceFromPrevVertex;

                // interpolate from prevVertex to vertex to compute the vertex of the trail
                var percent = cumulativeLength <= trailMaxLength ? 0 : (cumulativeLength - trailMaxLength) / distanceFromPrevVertex;
                var midVertex = Vector2.lerp(vertex, prevVertex, percent);
                trailVertexes.push(midVertex);

                if (cumulativeLength > trailMaxLength) {
                    // all trail vertexes are computed; remove unused vertexes from this._trailVertexes
                    for (i -= 1; i >= 0; i--) {
                        this._trailVertexes.splice(i, 1);
                    }
                    break;
                }

                prevVertex = vertex;
            }

            // draw a line constructed using the created array of vertexes with the specified start color and end color
            var trailStartColor = {
                r: settings.colors ? this.color.r : 255,
                g: settings.colors ? this.color.g : 255,
                b: settings.colors ? this.color.b : 255,
                a: 1,
            };
            var trailEndColor = {
                r: settings.colors ? this.color.r : 0,
                g: settings.colors ? this.color.g : 0,
                b: settings.colors ? this.color.b : 0,
                a: 0,
            };

            drawTrail(trailVertexes, trailMaxLength, trailStartColor, trailEndColor, 4);
        }

        g.restore();

        // draw ball
        g.translate(this.center.x, this.center.y);
        g.rotate(-Math.atan2(this.direction.x, this.direction.y));

        g.fillStyle = settings.colors ? getColorString(this.color) : getColorString({
            r: 255,
            g: 255,
            b: 255
        });
        g.fillRect(-this.radius, -this.radius, this.radius * 2, this.radius * 2);

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
        this.resetTrail = resetTrail;
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
            console.assert(value !== undefined && value.r !== undefined && value.g !== undefined && value.b !== undefined, JSON.stringify(value));
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
    var color1 = {
        r: 234,
        g: 245,
        b: 23
    };
    var ball1 = new Ball(center1, radius1, speed1, direction1, color1);
    console.assert(JSON.stringify(ball1.center) === JSON.stringify(center1) && ball1.radius === radius1 && ball1.speed === speed1 && JSON.stringify(ball1.direction) === JSON.stringify(direction1) && JSON.stringify(ball1.color) === JSON.stringify(color1), JSON.stringify(ball1));

    console.log('testBall OK');
}