var PlayingState = function() {
    var keyPress = function(e) {
        switch (e.keyCode) {
            case 49: // 1
                settings.colors = !settings.colors;
                break;
            case 50: // 2
                settings.particles = !settings.particles;
                break;
            case 116: // T
                if (!settings.ballTrail) {
                    world.balls.forEach(function(ball) {
                        ball.resetTrail();
                    });
                }
                settings.ballTrail = !settings.ballTrail;
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
                world.releaseBalls();
                // prevent space from scrolling the page
                return false;
            default:
                // alert(e.keyCode);
                break;
        }
    };

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


    var constructor = function PlayingState() {
        this.render = render;
        this.update = update;
        this.keyPress = keyPress;
    };

    return constructor;
}();