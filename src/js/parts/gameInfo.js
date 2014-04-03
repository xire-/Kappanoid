var GameInfo = function() {
    var drawDebugInfo = function(delta) {
        g.textBaseline = 'top';
        g.fillStyle = '#FFFFFF';

        g.fillText('FPS: ' + currentFPS.toFixed(1), 5, 10);
        g.fillText('DELTA: ' + delta.toFixed(1), 5, 20);
        g.fillText('LOOP: ' + loopTime, 5, 30);
        g.fillText('NUM PARTICLES: ' + world.particles.length, 5, 40);

        g.fillText('1. COLORS: ' + settings.colors, 120, 10);
        g.fillText('2. PARTICLES: ' + settings.particles, 120, 20);
        g.fillText('3. SOUNDS: ' + settings.sounds, 120, 30);
        g.fillText('4. MUSIC: ' + settings.music, 120, 40);

        g.fillText('5. BALL TRAIL: ' + settings.ballTrail, 225, 10);
        g.fillText('6. LAST BRICK SLOW MO: ' + settings.lastBrickSlowMo, 225, 20);
        g.fillText('7. PADDLE SPEED DISTORTION: ' + settings.paddleSpeedDistortion, 225, 30);
    };

    var drawGameInfo = function() {
        g.font = '16px emulogic';
        g.textAlign = 'center';
        g.textBaseline = 'top';

        g.fillStyle = '#FF0000';
        g.fillText('HIGH SCORE', 285, 10);
        g.fillText('CURRENT', 575, 10);

        g.fillStyle = '#FFFFFF';
        g.fillText('1337', 285, 35);
        g.fillText(world.score, 575, 35);
    };

    var render = function(delta) {
        g.save();

        g.translate(this.containerOffset.x, this.containerOffset.y);

        // clip the region
        g.beginPath();
        g.rect(0, 0, this.containerSize.x, this.containerSize.y);
        g.clip();

        // render background
        g.fillStyle = getColorString(this._backgroundColor);
        g.fillRect(0, 0, this.containerSize.x, this.containerSize.y);

        if (this.showDebugInfo) {
            drawDebugInfo(delta);
            g.translate(200, 0);
        }
        drawGameInfo();

        g.restore();
    };

    var update = function( /*delta*/ ) {};


    var constructor = function GameInfo(containerOffset, containerSize) {
        this.containerOffset = containerOffset;
        this.containerSize = containerSize;
        this.showDebugInfo = false;
        this._backgroundColor = constants.gameInfoBackgroundColor;

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
        },

        set showDebugInfo(value) {
            console.assert(value !== undefined && typeof value == 'boolean', JSON.stringify(value));
            this._showDebugInfo = value;
        },
        get showDebugInfo() {
            return this._showDebugInfo;
        }
    };

    return constructor;
}();