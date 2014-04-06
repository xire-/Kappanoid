var PlayingState = function() {

    ///////// public methods

    var render = function() {
        g.save();

        // clear the previous frame
        g.fillStyle = '#000000';
        g.fillRect(0, 0, constants.canvasRelativeWidth, constants.canvasRelativeHeight);

        // render the game world
        world.render();

        g.restore();
    };

    var update = function(delta) {
        world.update(delta);
    };

    var keyPress = function(e) {
        switch (e.keyCode) {
            case 48: // 0
                settings.colors = true;
                settings.particles = true;
                settings.sounds = true;
                settings.music = true;

                world.balls.forEach(function(ball) {
                    ball.trail.reset();
                });
                settings.ballTrail = true;

                settings.lastBrickSlowMo = true;
                settings.paddleSpeedDistortion = true;

                settings.worldShake = !settings.worldShake;
                world.shaker.enabled = settings.worldShake;
                break;
            case 49: // 1
                settings.colors = !settings.colors;
                break;
            case 50: // 2
                settings.particles = !settings.particles;
                break;
            case 51: // 3
                settings.sounds = !settings.sounds;
                break;
            case 52: // 4
                settings.music = !settings.music;
                break;
            case 53: // 5
                if (!settings.ballTrail) {
                    world.balls.forEach(function(ball) {
                        ball.trail.reset();
                    });
                }
                settings.ballTrail = !settings.ballTrail;
                break;
            case 54: // 6
                settings.lastBrickSlowMo = !settings.lastBrickSlowMo;
                break;
            case 55: // 7
                settings.paddleSpeedDistortion = !settings.paddleSpeedDistortion;
                break;
            case 56: // 8
                settings.worldShake = !settings.worldShake;
                world.shaker.enabled = settings.worldShake;
                break;
            case 57: // 9
                break;

            case 100: // D
                gameInfo.showDebugInfo = !gameInfo.showDebugInfo;
                break;

            case 117: // U
                settings.timeScale = 1;
                break;
            case 105: // I
                settings.timeScale = 0.50;
                break;
            case 111: // O
                settings.timeScale = 0.15;
                break;
            case 112: // P
                settings.timeScale = 0;
                break;

            case 114: // R
                world.reset(true);
                break;

            case 110: // N
                world._currentLevel = (world._currentLevel + 1) % levels.length;
                world.reset(true);
                break;

            case 108: // L
                for (var i = 0; i < 50; i++) {
                    var angle = randomFloat(Math.PI * 2);
                    var particleVelocity = new Vector2(randomFloat(200) * Math.cos(angle), randomFloat(200) * Math.sin(angle));
                    var particleAcceleration = new Vector2(0, 110);
                    var particleLife = randomInt(800, 1200);
                    var particleColor = getColorString({
                        h: 0,
                        s: 100,
                        l: randomInt(30, 70)
                    });
                    var particle = new Particle(new Vector2(400, 300), particleVelocity, particleAcceleration, particleLife, Particle.shapes.MEDIUM_RECTANGLE, particleColor, undefined);
                    world.particles.push(particle);
                }
                break;

            case 32: // SPACE
                world.action();
                // prevent space from scrolling the page
                return false;

            default:
                // alert(e.keyCode);
                break;
        }
    };

    ///////// constructor

    var constructor = function PlayingState() {
        // public methods
        this.render = render;
        this.update = update;
        this.keyPress = keyPress;
    };

    return constructor;
}();