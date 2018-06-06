var GameInfo = function() {

    ///////// public methods

    var render = function(delta) {
        g.save();
        g.translate(this.containerOffset.x, this.containerOffset.y);

        // clip the region
        g.beginPath();
        g.rect(0, 0, this.containerSize.x, this.containerSize.y);
        g.clip();
        g.closePath();

        // render background
        g.fillStyle = getColorString(this._backgroundColor);
        g.fillRect(0, 0, this.containerSize.x, this.containerSize.y);

        if (settings.debug) {
            // display debug information
            drawDebugInfo.call(this, delta);
            g.scale(0.6, 0.6);
            g.translate(700, 15);
        }

        // display the high score, the current score and the level time
        drawGameInfo.call(this);

        g.restore();
    };

    ///////// private methods

    var drawDebugInfo = function(delta) {
        g.textBaseline = 'top';
        g.fillStyle = 'rgba(255, 255, 255, 1)';

        g.fillText('FPS: ' + currentFPS.toFixed(1), 5, 10);
        g.fillText('DELTA: ' + delta.toFixed(1), 5, 20);
        g.fillText('LOOP: ' + loopTime, 5, 30);

        g.fillText('TIMESCALE: ' + settings.timeScale, 80, 10);
        g.fillText('SPEED MULT: ' + world.ballSpeedMult.toFixed(3), 80, 20);
        g.fillText('NUM PARTICLES: ' + world.particles.length, 80, 30);

        g.fillStyle = settings.colors ? 'rgba(0, 255, 0, 1)' : 'rgba(255, 0, 0, 1)';
        g.fillText('1. COLORS', 200, 10);
        g.fillStyle = settings.particles ? 'rgba(0, 255, 0, 1)' : 'rgba(255, 0, 0, 1)';
        g.fillText('2. PARTICLES', 200, 20);
        g.fillStyle = settings.sounds ? 'rgba(0, 255, 0, 1)' : 'rgba(255, 0, 0, 1)';
        g.fillText('3. SOUNDS', 200, 30);
        g.fillStyle = settings.music ? 'rgba(0, 255, 0, 1)' : 'rgba(255, 0, 0, 1)';
        g.fillText('4. MUSIC', 200, 40);

        g.fillStyle = settings.ballTrail ? 'rgba(0, 255, 0, 1)' : 'rgba(255, 0, 0, 1)';
        g.fillText('5. BALL TRAIL', 300, 10);
        g.fillStyle = settings.lastBrickSlowMo ? 'rgba(0, 255, 0, 1)' : 'rgba(255, 0, 0, 1)';
        g.fillText('6. LAST BRICK SLOW MO', 300, 20);
        g.fillStyle = settings.paddleSpeedDistortion ? 'rgba(0, 255, 0, 1)' : 'rgba(255, 0, 0, 1)';
        g.fillText('7. PADDLE SPEED DISTORTION', 300, 30);
        g.fillStyle = settings.worldShake ? 'rgba(0, 255, 0, 1)' : 'rgba(255, 0, 0, 1)';
        g.fillText('8. WORLD SHAKE', 300, 40);
    };

    var drawGameInfo = function() {
        g.font = '16px emulogic';
        g.textAlign = 'center';
        g.textBaseline = 'top';

        g.fillStyle = settings.colors ? getColorString(this._text1Color) : 'rgba(255, 255, 255, 1)';
        g.fillText('HIGH SCORE', 240, 10);
        g.fillText('CURRENT', 575, 10);

        g.fillStyle = settings.colors ? getColorString(this._text2Color) : 'rgba(255, 255, 255, 1)';
        g.fillText(localStorage.highscore, 240, 35);

        var minutes = '00';
        var seconds = '00';
        if (world.levelTime !== 0) {
            var levelTime = new Date(Date.now() - world.levelTime);
            minutes = (levelTime.getMinutes() < 10 ? '0' : '') + levelTime.getMinutes();
            seconds = (levelTime.getSeconds() < 10 ? '0' : '') + levelTime.getSeconds();
        }
        g.fillText(minutes + ':' + seconds, 420, 20);

        g.fillText(world.score, 575, 35);
    };

    ///////// constructor

    var constructor = function GameInfo(containerOffset, containerSize) {
        // public methods
        this.render = render;

        // init
        this.containerOffset = containerOffset;
        this.containerSize = containerSize;

        this._backgroundColor = constants.gameInfoBackgroundColor;
        // used for 'high score' and 'current'
        this._text1Color = {
            r: 255,
            g: 0,
            b: 0,
        };
        // used for score values and level time
        this._text2Color = {
            r: 255,
            g: 255,
            b: 255,
        };
    };

    constructor.prototype = {
        set containerOffset(value) {
            console.assert(isInstanceOf(value, Vector2), JSON.stringify(value));
            this._containerOffset = value;
        },
        get containerOffset() {
            return this._containerOffset;
        },

        set containerSize(value) {
            console.assert(isInstanceOf(value, Vector2), JSON.stringify(value));
            this._containerSize = value;
        },
        get containerSize() {
            return this._containerSize;
        },
    };

    return constructor;
}();