var GameInfo = function() {
    var render = function(delta) {
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
    };

    var update = function(delta) {};

    var toString = function() {
        return JSON.stringify(this);
    };


    var constructor = function GameInfo(containerOffset, containerSize) {
        this.containerOffset = containerOffset;
        this.containerSize = containerSize;

        this.render = render;
        this.update = update;
        this.toString = toString;
    };

    constructor.prototype = {
        set containerOffset(value) {
            console.assert(value !== undefined && value instanceof Vector2, value.toString());
            this._containerOffset = value;
        },
        get containerOffset() {
            return this._containerOffset;
        },

        set containerSize(value) {
            console.assert(value !== undefined && value instanceof Vector2, value.toString());
            this._containerSize = value;
        },
        get containerSize() {
            return this._containerSize;
        }
    };

    return constructor;
}();