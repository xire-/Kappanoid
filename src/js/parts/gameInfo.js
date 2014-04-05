var GameInfo = function() {

    ///////// public methods

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
            g.scale(0.6, 0.6);
            g.translate(700, 15);
        }
        drawGameInfo.call(this);

        g.restore();
    };

    var update = function( /*delta*/ ) {};

    ///////// private methods

    var drawDebugInfo = function(delta) {
        g.textBaseline = 'top';
        g.fillStyle = '#FFFFFF';

        g.fillText('FPS: ' + currentFPS.toFixed(1), 5, 5);
        g.fillText('DELTA: ' + delta.toFixed(1), 5, 15);
        g.fillText('LOOP: ' + loopTime, 5, 25);
        g.fillText('NUM PARTICLES: ' + world.particles.length, 5, 35);
        g.fillText('SPEED MULT: ' + world.ballSpeedMult.toFixed(3), 5, 45);


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

        g.fillStyle = settings.colors ? getColorString(this._text1Color) : getColorString({
            r: 255,
            g: 255,
            b: 255,
        });
        g.fillText('HIGH SCORE', 240, 10);
        g.fillText('CURRENT', 575, 10);

        g.fillStyle = settings.colors ? getColorString(this._text2Color) : getColorString({
            r: 255,
            g: 255,
            b: 255,
        });
        g.fillText('1337', 240, 35);

        var minutes = '00';
        var seconds = '00';
        if (world.levelTime !== null) {
            var levelTime = new Date(new Date().getTime() - world.levelTime.getTime());
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
        this.update = update;

        // init
        this.containerOffset = containerOffset;
        this.containerSize = containerSize;
        this.showDebugInfo = false;
        this._backgroundColor = constants.gameInfoBackgroundColor;
        this._text1Color = {
            r: 255,
            g: 0,
            b: 0,
        };
        this._text2Color = {
            r: 255,
            g: 255,
            b: 255,
        };
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