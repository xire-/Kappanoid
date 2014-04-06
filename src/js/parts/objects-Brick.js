var Brick = function() {

    ///////// public static methods / variables

    var types = {
        WHITE: {
            life: 1,
            color: {
                r: 255,
                g: 255,
                b: 255,
            },
            value: 50,
        },
        ORANGE: {
            life: 1,
            color: {
                r: 255,
                g: 178,
                b: 102,
            },
            value: 60,
        },
        CYAN: {
            life: 1,
            color: {
                r: 102,
                g: 255,
                b: 255,
            },
            value: 70,
        },
        GREEN: {
            life: 1,
            color: {
                r: 102,
                g: 255,
                b: 102,
            },
            value: 80,
        },
        RED: {
            life: 1,
            color: {
                r: 255,
                g: 102,
                b: 102,
            },
            value: 90,
        },
        BLUE: {
            life: 1,
            color: {
                r: 102,
                g: 178,
                b: 255,
            },
            value: 100,
        },
        VIOLET: {
            life: 1,
            color: {
                r: 255,
                g: 102,
                b: 153,
            },
            value: 110,
        },
        YELLOW: {
            life: 1,
            color: {
                r: 255,
                g: 255,
                b: 102,
            },
            value: 120,
        },
        SILVER: {
            life: 2,
            color: {
                r: 192,
                g: 192,
                b: 192,
            },
            value: 240,
        },
        GOLD: {
            life: Number.POSITIVE_INFINITY,
            color: {
                r: 255,
                g: 215,
                b: 0,
            },
            value: 1337,
        },
    };

    ///////// public methods

    var hit = function() {
        this.life -= 1;
        this._blinkTimer = 0;
    };


    var render = function() {
        g.save();

        g.translate(this.center.x, this.center.y);

        g.save();
        g.beginPath();
        g.shadowBlur = 5;
        g.shadowColor = getColorString({
            r: 0,
            g: 0,
            b: 0,
        });
        g.shadowOffsetX = 3;
        g.shadowOffsetY = 3;

        g.fillStyle = settings.colors ? getColorString(this.color) : getColorString({
            r: 255,
            g: 255,
            b: 255,
        });
        g.rect(-this.halfSize.x, -this.halfSize.y, this.halfSize.x * 2, this.halfSize.y * 2);
        g.fillRect(-this.halfSize.x, -this.halfSize.y, this.halfSize.x * 2, this.halfSize.y * 2);
        g.restore();
        g.clip();

        // draw blink
        g.shadowBlur = 0;
        g.fillStyle = 'rgba(255, 255, 255, 0.5)';
        g.translate(-this.halfSize.x * 2 + (this.halfSize.x * 4 * this._blinkTimer / 500), 0);
        g.rotate(-1); // rotate one radiant counter-clock wise
        g.fillRect(-this.halfSize.x, -this.halfSize.y, this.halfSize.x * 2, this.halfSize.y * 2);


        g.restore();
    };

    var update = function(delta) {
        this._blinkTimer = Math.min(500, this._blinkTimer + delta);
    };

    ///////// constructor

    var constructor = function Brick(center, halfSize, type) {
        // public methods
        this.hit = hit;
        this.render = render;
        this.update = update;

        // init
        this.center = center;
        this.halfSize = halfSize;
        this.life = type.life;
        this.color = type.color;
        this.value = type.value;
        this.type = type;

        this._blinkTimer = 500;
    };

    constructor.prototype = {
        set center(value) {
            console.assert(value !== undefined && value instanceof Vector2, JSON.stringify(value));
            this._center = value;
        },
        get center() {
            return this._center;
        },

        set halfSize(value) {
            console.assert(value !== undefined && value instanceof Vector2, JSON.stringify(value));
            this._halfSize = value;
        },
        get halfSize() {
            return this._halfSize;
        },

        set life(value) {
            console.assert(value !== undefined && typeof value == 'number', JSON.stringify(value));
            this._life = value;
        },
        get life() {
            return this._life;
        },

        set color(value) {
            console.assert(value !== undefined && value.r !== undefined && value.g !== undefined && value.b !== undefined, JSON.stringify(value));
            this._color = value;
        },
        get color() {
            return this._color;
        },

        set value(v) {
            console.assert(v !== undefined && typeof v == 'number', JSON.stringify(v));
            this._value = v;
        },
        get value() {
            return this._value;
        },
    };

    constructor.types = types;

    return constructor;
}();

function testBrick() {
    var center1 = new Vector2(3, 4);
    var halfSize1 = new Vector2(100, 300);
    var type1 = Brick.types.WHITE;
    var brick1 = new Brick(center1, halfSize1, type1);
    console.assert(JSON.stringify(brick1.center) === JSON.stringify(center1) && JSON.stringify(brick1.halfSize) === JSON.stringify(halfSize1) && brick1.life === type1.life && brick1.color === type1.color && brick1.value === type1.value);

    console.log('testBrick OK');
}