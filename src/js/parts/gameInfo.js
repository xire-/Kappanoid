var GameInfo = (function() {
    var baseGameInfo = Object.defineProperties({}, {
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

        render: {
            value: function(delta) {
                g.save();
                g.translate(this.containerOffset.x, this.containerOffset.y);

                // clip the region
                g.beginPath();
                g.rect(0, 0, this.containerSize.x, this.containerSize.y);
                g.clip();

                // render background
                g.fillStyle = settings.gameInfoBackgroundColor;
                g.fillRect(0, 0, this.containerSize.x, this.containerSize.y);

                // render some debug info
                g.fillStyle = '#fff';
                g.textAlign = 'left';
                g.textBaseline = 'top';
                g.fillText('FPS: ' + currentFPS, 5, 5);
                g.fillText('DELTA: ' + delta, 5, 15);
                g.fillText('LOOP: ' + loopTime, 5, 25);

                g.restore();
            }
        },

        toString: {
            value: function() {
                return 'GameInfo()';
            }
        }
    });

    var GameInfo = function(containerOffset, containerSize) {
        console.assert(containerOffset !== undefined && containerOffset instanceof Vector2, containerOffset.toString());
        this.containerOffset = containerOffset;

        console.assert(containerSize !== undefined && containerSize instanceof Vector2, containerSize.toString());
        this.containerSize = containerSize;
    };
    GameInfo.prototype = baseGameInfo;
    return GameInfo;
}());