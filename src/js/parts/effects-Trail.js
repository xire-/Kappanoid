var Trail = function() {

    ///////// public methods

    var addVertex = function(vertex) {
        this._vertexes.push(vertex.clone());
    };

    var reset = function(moving) {
        this._vertexes = [];
        this.addVertex(this._parent.center);

        if (moving) {
            this._stoppedMovingDate = null;
            this._stoppedMovingPosition = null;
        }
    };

    var fade = function() {
        if (this._stoppedMovingDate === null && this._stoppedMovingPosition === null) {
            this._stoppedMovingDate = new Date();
            this._stoppedMovingPosition = this._parent.center.clone();
        }
    };


    var render = function() {
        g.save();

        var drawVertexes = (this._stoppedMovingDate !== null) ? [this._stoppedMovingPosition] : [this._parent.center];
        var vertex;
        var prevVertex = drawVertexes[0];
        var cumulativeLength = 0;

        // create an array of vertexes (computed from this._vertexes) with a total length of this._maxLength
        for (var i = this._vertexes.length - 1; i >= 0; i--) {
            vertex = this._vertexes[i];
            var distanceFromPrevVertex = vertex.distance(prevVertex);
            cumulativeLength += distanceFromPrevVertex;

            // interpolate from prevVertex to vertex to compute the vertex of the trail
            var percent = cumulativeLength <= this._maxLength ? 0 : (cumulativeLength - this._maxLength) / distanceFromPrevVertex;
            var midVertex = Vector2.lerp(vertex, prevVertex, percent);
            drawVertexes.push(midVertex);

            if (cumulativeLength > this._maxLength) {
                // all trail vertexes are computed; remove unused vertexes from this._vertexes
                for (i -= 1; i >= 0; i--) {
                    this._vertexes.splice(i, 1);
                }
                break;
            }

            prevVertex = vertex;
        }

        // draw a line constructed using the created array of vertexes with the specified start color and end color
        var trailStartColor = {
            r: settings.colors ? this._parent.color.r : 255,
            g: settings.colors ? this._parent.color.g : 255,
            b: settings.colors ? this._parent.color.b : 255,
            a: 1,
        };
        var trailEndColor = {
            r: settings.colors ? this._parent.color.r : 0,
            g: settings.colors ? this._parent.color.g : 0,
            b: settings.colors ? this._parent.color.b : 0,
            a: 0,
        };

        // winner of best trick contest
        if (this._stoppedMovingDate !== null) {
            trailStartColor.a = Math.max(0, 1 - (new Date().getTime() - this._stoppedMovingDate.getTime()) / 1000);
            drawVertexes[0] = this._stoppedMovingPosition;
        }

        drawTrail(drawVertexes, this._maxLength, trailStartColor, trailEndColor, 4);

        g.restore();
    };

    ///////// private methods

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

    var lerpColor = function(startColor, endColor, percent) {
        return {
            r: startColor.r * percent + endColor.r * (1 - percent),
            g: startColor.g * percent + endColor.g * (1 - percent),
            b: startColor.b * percent + endColor.b * (1 - percent),
            a: startColor.a * percent + endColor.a * (1 - percent),
        };
    };

    ///////// constructor

    var constructor = function Trail(parent) {
        // public methods
        this.addVertex = addVertex;
        this.reset = reset;
        this.fade = fade;
        this.render = render;

        // init
        this._parent = parent;
        this._vertexes = [];
        this._maxLength = 150;
        this._stoppedMovingDate = new Date();
        this._stoppedMovingPosition = this._parent.center.clone();
    };

    return constructor;
}();