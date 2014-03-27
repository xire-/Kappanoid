var PlayingState = function() {
    var render = function(delta) {
        g.save();

        // clear the previous frame (render world borders)
        g.fillStyle = settings.worldBorderBackgroundColor;
        g.fillRect(0, 0, defaultWidth, defaultHeight);

        // render the game world
        world.render();

        g.restore();
    };

    var update = function(delta) {
        world.update(delta);
    };

    var toString = function() {
        return JSON.stringify(this);
    };


    var constructor = function PlayingState() {
        this.render = render;
        this.update = update;
        this.toString = toString;
    };

    return constructor;
}();