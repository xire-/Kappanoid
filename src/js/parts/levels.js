var levels = [{
    // backgroundColor: '#000000',
    bricks: function() {
        return [
            new Brick(new Vector2(225, 400 / 2), new Vector2(25, 10), Brick.types.WHITE),
        ];
    }
}, {
    // backgroundColor: '#000000',
    bricks: function() {
        return [
            new Brick(new Vector2(225, 400 / 2), new Vector2(25, 10), Brick.types.WHITE),
            new Brick(new Vector2(275, 400 / 2), new Vector2(25, 10), Brick.types.ORANGE),
            new Brick(new Vector2(325, 400 / 2), new Vector2(25, 10), Brick.types.CYAN),
            new Brick(new Vector2(375, 400 / 2), new Vector2(25, 10), Brick.types.GREEN),
            new Brick(new Vector2(425, 400 / 2), new Vector2(25, 10), Brick.types.RED),
            new Brick(new Vector2(475, 400 / 2), new Vector2(25, 10), Brick.types.BLUE),
            new Brick(new Vector2(525, 400 / 2), new Vector2(25, 10), Brick.types.YELLOW),
            new Brick(new Vector2(575, 400 / 2), new Vector2(25, 10), Brick.types.SILVER),
            new Brick(new Vector2(625, 400 / 2), new Vector2(25, 10), Brick.types.GOLD),
        ];
    }
}, ];