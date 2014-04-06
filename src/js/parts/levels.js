var type = {
    '0': Brick.types.WHITE,
    '1': Brick.types.ORANGE,
    '2': Brick.types.CYAN,
    '3': Brick.types.GREEN,
    '4': Brick.types.RED,
    '5': Brick.types.BLUE,
    '6': Brick.types.VIOLET,
    '7': Brick.types.YELLOW,
    '8': Brick.types.SILVER,
    '9': Brick.types.GOLD,
};

var levels = [{
    // arkanoid stage 1
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
        var level = [
            '             ',
            '             ',
            '8888888888888',
            '4444444444444',
            '7777777777777',
            '5555555555555',
            '6666666666666',
            '3333333333333',
            '             ',
            '             ',
            '             ',
            '             ',
            '             ',
        ];

        var start = new Vector2(40, 20);
        var offset = new Vector2(10, 7);
        var bricks = [];
        for (var r = 0; r < 13; r++) {
            for (var c = 0; c < 13; c++) {
                var l = level[r][c];
                if (l !== ' ') {
                    bricks.push(new Brick(new Vector2(start.x + (50 + offset.x) * c, start.y + (20 + offset.y) * r), new Vector2(25, 10), type[l]));
                }
            }
        }

        return bricks;
    },
}, {
    // arkanoid stage 2
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
        var level = [
            '0            ',
            '01           ',
            '012          ',
            '0123         ',
            '01234        ',
            '012345       ',
            '0123456      ',
            '01234567     ',
            '012345670    ',
            '0123456701   ',
            '01234567012  ',
            '012345670123 ',
            '8888888888884',
        ];

        var start = new Vector2(40, 20);
        var offset = new Vector2(10, 7);
        var bricks = [];
        for (var r = 0; r < 13; r++) {
            for (var c = 0; c < 13; c++) {
                var l = level[r][c];
                if (l !== ' ') {
                    bricks.push(new Brick(new Vector2(start.x + (50 + offset.x) * c, start.y + (20 + offset.y) * r), new Vector2(25, 10), type[l]));
                }
            }
        }

        return bricks;
    },
}, {
    // arkanoid stage 3
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
        var level = [
            '             ',
            '3333333333333',
            '             ',
            '0009999999999',
            '             ',
            '4444444444444',
            '             ',
            '9999999999000',
            '             ',
            '6666666666666',
            '             ',
            '5559999999999',
            '             ',
            '2222222222222',
            '             ',
            '9999999999222',
        ];

        var start = new Vector2(40, 20);
        var offset = new Vector2(10, 7);
        var bricks = [];
        for (var r = 0; r < 16; r++) {
            for (var c = 0; c < 13; c++) {
                var l = level[r][c];
                if (l !== ' ') {
                    bricks.push(new Brick(new Vector2(start.x + (50 + offset.x) * c, start.y + (20 + offset.y) * r), new Vector2(25, 10), type[l]));
                }
            }
        }

        return bricks;
    },
}, {
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
        var lvl = [
            '----------------',
            'O O X ZZZIII V |',
            'O OX XZ ZI IV V|',
            'OO XXXZZZIIIVVV|',
            'O OX XZ  I  V V ',
            'O OX XZ  I  V V|',
            '________________',
        ].join('');
        var type = {
            'O': Brick.types.GOLD,
            'X': Brick.types.SILVER,
            'Z': Brick.types.RED,
            'I': Brick.types.GREEN,
            'V': Brick.types.BLUE,
            ' ': Brick.types.WHITE,
            '-': Brick.types.ORANGE,
            '_': Brick.types.CYAN,
            '|': Brick.types.VIOLET,
        };

        var startX = 25;
        var startY = 10;
        var bricks = [];
        for (var r = 0; r < 7; r++) {
            for (var c = 0; c < 16; c++) {
                bricks.push(new Brick(new Vector2(startX + 50 * c, startY + 20 * r), new Vector2(25, 10), type[lvl[r * 16 + c]]));
            }
        }

        return bricks;
    },
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