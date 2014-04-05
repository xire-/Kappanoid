var levels = [{
    backgroundColor: {
        r: 112,
        g: 128,
        b: 144,
    },
    bordersColor: {
        r: 136,
        g: 209,
        b: 163,
    },
    ballColor: {
        r: 210,
        g: 102,
        b: 53,
    },
    paddleColor: {
        r: 207,
        g: 55,
        b: 70,
    },
    bricks: function() {
        return [
            new Brick(new Vector2(40, 70), new Vector2(25, 10), Brick.types.SILVER),
            new Brick(new Vector2(100, 70), new Vector2(25, 10), Brick.types.SILVER),
            new Brick(new Vector2(160, 70), new Vector2(25, 10), Brick.types.SILVER),
            new Brick(new Vector2(220, 70), new Vector2(25, 10), Brick.types.SILVER),
            new Brick(new Vector2(280, 70), new Vector2(25, 10), Brick.types.SILVER),
            new Brick(new Vector2(340, 70), new Vector2(25, 10), Brick.types.SILVER),
            new Brick(new Vector2(400, 70), new Vector2(25, 10), Brick.types.SILVER),
            new Brick(new Vector2(460, 70), new Vector2(25, 10), Brick.types.SILVER),
            new Brick(new Vector2(520, 70), new Vector2(25, 10), Brick.types.SILVER),
            new Brick(new Vector2(580, 70), new Vector2(25, 10), Brick.types.SILVER),
            new Brick(new Vector2(640, 70), new Vector2(25, 10), Brick.types.SILVER),
            new Brick(new Vector2(700, 70), new Vector2(25, 10), Brick.types.SILVER),
            new Brick(new Vector2(760, 70), new Vector2(25, 10), Brick.types.SILVER),

            new Brick(new Vector2(40, 100), new Vector2(25, 10), Brick.types.RED),
            new Brick(new Vector2(100, 100), new Vector2(25, 10), Brick.types.RED),
            new Brick(new Vector2(160, 100), new Vector2(25, 10), Brick.types.RED),
            new Brick(new Vector2(220, 100), new Vector2(25, 10), Brick.types.RED),
            new Brick(new Vector2(280, 100), new Vector2(25, 10), Brick.types.RED),
            new Brick(new Vector2(340, 100), new Vector2(25, 10), Brick.types.RED),
            new Brick(new Vector2(400, 100), new Vector2(25, 10), Brick.types.RED),
            new Brick(new Vector2(460, 100), new Vector2(25, 10), Brick.types.RED),
            new Brick(new Vector2(520, 100), new Vector2(25, 10), Brick.types.RED),
            new Brick(new Vector2(580, 100), new Vector2(25, 10), Brick.types.RED),
            new Brick(new Vector2(640, 100), new Vector2(25, 10), Brick.types.RED),
            new Brick(new Vector2(700, 100), new Vector2(25, 10), Brick.types.RED),
            new Brick(new Vector2(760, 100), new Vector2(25, 10), Brick.types.RED),

            new Brick(new Vector2(40, 130), new Vector2(25, 10), Brick.types.YELLOW),
            new Brick(new Vector2(100, 130), new Vector2(25, 10), Brick.types.YELLOW),
            new Brick(new Vector2(160, 130), new Vector2(25, 10), Brick.types.YELLOW),
            new Brick(new Vector2(220, 130), new Vector2(25, 10), Brick.types.YELLOW),
            new Brick(new Vector2(280, 130), new Vector2(25, 10), Brick.types.YELLOW),
            new Brick(new Vector2(340, 130), new Vector2(25, 10), Brick.types.YELLOW),
            new Brick(new Vector2(400, 130), new Vector2(25, 10), Brick.types.YELLOW),
            new Brick(new Vector2(460, 130), new Vector2(25, 10), Brick.types.YELLOW),
            new Brick(new Vector2(520, 130), new Vector2(25, 10), Brick.types.YELLOW),
            new Brick(new Vector2(580, 130), new Vector2(25, 10), Brick.types.YELLOW),
            new Brick(new Vector2(640, 130), new Vector2(25, 10), Brick.types.YELLOW),
            new Brick(new Vector2(700, 130), new Vector2(25, 10), Brick.types.YELLOW),
            new Brick(new Vector2(760, 130), new Vector2(25, 10), Brick.types.YELLOW),

            new Brick(new Vector2(40, 160), new Vector2(25, 10), Brick.types.BLUE),
            new Brick(new Vector2(100, 160), new Vector2(25, 10), Brick.types.BLUE),
            new Brick(new Vector2(160, 160), new Vector2(25, 10), Brick.types.BLUE),
            new Brick(new Vector2(220, 160), new Vector2(25, 10), Brick.types.BLUE),
            new Brick(new Vector2(280, 160), new Vector2(25, 10), Brick.types.BLUE),
            new Brick(new Vector2(340, 160), new Vector2(25, 10), Brick.types.BLUE),
            new Brick(new Vector2(400, 160), new Vector2(25, 10), Brick.types.BLUE),
            new Brick(new Vector2(460, 160), new Vector2(25, 10), Brick.types.BLUE),
            new Brick(new Vector2(520, 160), new Vector2(25, 10), Brick.types.BLUE),
            new Brick(new Vector2(580, 160), new Vector2(25, 10), Brick.types.BLUE),
            new Brick(new Vector2(640, 160), new Vector2(25, 10), Brick.types.BLUE),
            new Brick(new Vector2(700, 160), new Vector2(25, 10), Brick.types.BLUE),
            new Brick(new Vector2(760, 160), new Vector2(25, 10), Brick.types.BLUE),

            new Brick(new Vector2(40, 190), new Vector2(25, 10), Brick.types.VIOLET),
            new Brick(new Vector2(100, 190), new Vector2(25, 10), Brick.types.VIOLET),
            new Brick(new Vector2(160, 190), new Vector2(25, 10), Brick.types.VIOLET),
            new Brick(new Vector2(220, 190), new Vector2(25, 10), Brick.types.VIOLET),
            new Brick(new Vector2(280, 190), new Vector2(25, 10), Brick.types.VIOLET),
            new Brick(new Vector2(340, 190), new Vector2(25, 10), Brick.types.VIOLET),
            new Brick(new Vector2(400, 190), new Vector2(25, 10), Brick.types.VIOLET),
            new Brick(new Vector2(460, 190), new Vector2(25, 10), Brick.types.VIOLET),
            new Brick(new Vector2(520, 190), new Vector2(25, 10), Brick.types.VIOLET),
            new Brick(new Vector2(580, 190), new Vector2(25, 10), Brick.types.VIOLET),
            new Brick(new Vector2(640, 190), new Vector2(25, 10), Brick.types.VIOLET),
            new Brick(new Vector2(700, 190), new Vector2(25, 10), Brick.types.VIOLET),
            new Brick(new Vector2(760, 190), new Vector2(25, 10), Brick.types.VIOLET),

            new Brick(new Vector2(40, 220), new Vector2(25, 10), Brick.types.GREEN),
            new Brick(new Vector2(100, 220), new Vector2(25, 10), Brick.types.GREEN),
            new Brick(new Vector2(160, 220), new Vector2(25, 10), Brick.types.GREEN),
            new Brick(new Vector2(220, 220), new Vector2(25, 10), Brick.types.GREEN),
            new Brick(new Vector2(280, 220), new Vector2(25, 10), Brick.types.GREEN),
            new Brick(new Vector2(340, 220), new Vector2(25, 10), Brick.types.GREEN),
            new Brick(new Vector2(400, 220), new Vector2(25, 10), Brick.types.GREEN),
            new Brick(new Vector2(460, 220), new Vector2(25, 10), Brick.types.GREEN),
            new Brick(new Vector2(520, 220), new Vector2(25, 10), Brick.types.GREEN),
            new Brick(new Vector2(580, 220), new Vector2(25, 10), Brick.types.GREEN),
            new Brick(new Vector2(640, 220), new Vector2(25, 10), Brick.types.GREEN),
            new Brick(new Vector2(700, 220), new Vector2(25, 10), Brick.types.GREEN),
            new Brick(new Vector2(760, 220), new Vector2(25, 10), Brick.types.GREEN),
        ];
    }
}, {
    backgroundColor: {
        r: 248,
        g: 242,
        b: 179,
    },
    bordersColor: {
        r: 136,
        g: 209,
        b: 163,
    },
    ballColor: {
        r: 210,
        g: 102,
        b: 53,
    },
    paddleColor: {
        r: 207,
        g: 55,
        b: 70,
    },
    bricks: function() {
        return [
            new Brick(new Vector2(525, 400 / 2), new Vector2(25, 10), Brick.types.YELLOW),
        ];
    }
}, {
    backgroundColor: {
        r: 248,
        g: 242,
        b: 179,
    },
    bordersColor: {
        r: 136,
        g: 209,
        b: 163,
    },
    ballColor: {
        r: 210,
        g: 102,
        b: 53,
    },
    paddleColor: {
        r: 207,
        g: 55,
        b: 70,
    },
    bricks: function() {
        return [
            new Brick(new Vector2(75, 400 / 2), new Vector2(25, 10), Brick.types.GOLD),
            new Brick(new Vector2(125, 400 / 2), new Vector2(25, 10), Brick.types.BLUE),
            new Brick(new Vector2(175, 400 / 2), new Vector2(25, 10), Brick.types.YELLOW),
            new Brick(new Vector2(225, 400 / 2), new Vector2(25, 10), Brick.types.WHITE),
            new Brick(new Vector2(275, 400 / 2), new Vector2(25, 10), Brick.types.ORANGE),
            new Brick(new Vector2(325, 400 / 2), new Vector2(25, 10), Brick.types.CYAN),
            new Brick(new Vector2(375, 400 / 2), new Vector2(25, 10), Brick.types.GREEN),
            new Brick(new Vector2(425, 400 / 2), new Vector2(25, 10), Brick.types.RED),
            new Brick(new Vector2(475, 400 / 2), new Vector2(25, 10), Brick.types.BLUE),
            new Brick(new Vector2(525, 400 / 2), new Vector2(25, 10), Brick.types.YELLOW),
        ];
    }
}, {
    backgroundColor: {
        r: 248,
        g: 242,
        b: 179,
    },
    bordersColor: {
        r: 136,
        g: 209,
        b: 163,
    },
    ballColor: {
        r: 210,
        g: 102,
        b: 53,
    },
    paddleColor: {
        r: 207,
        g: 55,
        b: 70,
    },
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