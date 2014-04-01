var GameInfo = function() {
    var render = function(delta) {
        g.save();
        g.translate(this.containerOffset.x, this.containerOffset.y);

        // clip the region
        g.beginPath();
        g.rect(0, 0, this.containerSize.x, this.containerSize.y);
        g.clip();

        // render background
        g.fillStyle = '#222222';
        g.fillRect(0, 0, this.containerSize.x, this.containerSize.y);

        // render some debug info
        g.textAlign = 'left';
        g.textBaseline = 'top';
        g.fillStyle = '#FFFFFF';
        g.fillText('FPS: ' + currentFPS, 5, 5);
        g.fillText('DELTA: ' + delta, 5, 15);
        g.fillText('LOOP: ' + loopTime, 5, 25);

        g.font = '16px emulogic';
        g.fillStyle = '#FF0000';

        var hearts = '';
        for (var i = 0; i < world.paddle.life; i++) {
            hearts += '❤';
        }
        g.fillText(hearts, 250, 5);
        g.fillText('HIGH SCORE', 480, 5);

        g.fillStyle = '#FFFFFF';
        g.fillText(world.score, 250, 30);
        g.fillText('123456', 510, 30);

        g.restore();
    };

    var update = function( /*delta*/ ) {};


    var constructor = function GameInfo(containerOffset, containerSize) {
        this.containerOffset = containerOffset;
        this.containerSize = containerSize;

        this.render = render;
        this.update = update;
    };

    constructor.prototype = {
        set containerOffset(value) {
            console.assert(value !== undefined && value instanceof Vector2, JSON.stringify(value));
            this._containerOffset = value;
        },
        get containerOffset() {
            return this._containerOffset;
        },

        set containerSize(value) {
            console.assert(value !== undefined && value instanceof Vector2, JSON.stringify(value));
            this._containerSize = value;
        },
        get containerSize() {
            return this._containerSize;
        }
    };

    return constructor;
}();