var Trail = function() {

    ///////// public methods

    var addVertex = function(vertex) {
        this._trailVertexes.push(vertex.clone());
    };

    var reset = function() {
        this._trailVertexes = [];
        this.addVertex(this.parent.center);
    };

    var fade = function() {
        if (this.stoppedMovingDate === null && this.stoppedMovingPosition === null) {
            this.stoppedMovingDate = new Date();
            this.stoppedMovingPosition = this.parent.center.clone();
        }
    };


    var render = function() {
        g.save();

        // draw ball trail
        if (settings.ballTrail) {
            var trailMaxLength = 150;
            var trailVertexes = (this.stoppedMovingDate !== null) ? [this.stoppedMovingPosition] : [this.parent.center];
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
                r: settings.colors ? this.parent.color.r : 255,
                g: settings.colors ? this.parent.color.g : 255,
                b: settings.colors ? this.parent.color.b : 255,
                a: 1,
            };
            var trailEndColor = {
                r: settings.colors ? this.parent.color.r : 0,
                g: settings.colors ? this.parent.color.g : 0,
                b: settings.colors ? this.parent.color.b : 0,
                a: 0,
            };

            // winner of best trick contest
            if (this.stoppedMovingDate !== null) {
                trailStartColor.a = Math.max(0, 1 - (new Date().getTime() - this.stoppedMovingDate.getTime()) / 1000);
                trailVertexes[0] = this.stoppedMovingPosition;
            }

            drawTrail(trailVertexes, trailMaxLength, trailStartColor, trailEndColor, 4);
        }

        g.restore();
    };

    var update = function( /*delta*/ ) {};

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
        this.update = update;

        // init
        this.parent = parent;
        this._trailVertexes = [];
        this.stoppedMovingDate = new Date();
        this.stoppedMovingPosition = this.parent.center.clone();
    };

    return constructor;
}();