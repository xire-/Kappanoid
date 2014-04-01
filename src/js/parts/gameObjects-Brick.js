var Brick = function() {
    var types = {
        WHITE: {
            life: 1,
            color: '#FFFFFF',
            value: 50
        },
        ORANGE: {
            life: 1,
            color: '#FF6600',
            value: 60
        },
        CYAN: {
            life: 1,
            color: '#00FFFF',
            value: 70
        },
        GREEN: {
            life: 1,
            color: '#00FF00',
            value: 80
        },
        RED: {
            life: 1,
            color: '#FF0000',
            value: 90
        },
        BLUE: {
            life: 1,
            color: '#0000FF',
            value: 100
        },
        YELLOW: {
            life: 1,
            color: '#FFFF00',
            value: 120
        },
        SILVER: {
            life: 2,
            color: '#C0C0C0',
            value: 240
        },
        GOLD: {
            life: Number.POSITIVE_INFINITY,
            color: '#FFD700',
            value: null
        },
    };

    var hit = function() {
        // decrement life if it is not null
        if (this.life !== null) {
            this.life -= 1;
        }
    };

    var render = function() {
        g.save();

        g.beginPath();
        g.rect(this.center.x - this.halfSize.x, this.center.y - this.halfSize.y, this.halfSize.x * 2, this.halfSize.y * 2);
        g.fillStyle = settings.colors ? this.color : '#FFFFFF';
        g.fill();

        g.textAlign = 'center';
        g.textBaseline = 'middle';
        g.fillStyle = '#000000';
        g.fillText(this.life, this.center.x, this.center.y);

        g.restore();
    };

    var update = function( /*delta*/ ) {};


    var constructor = function Brick(center, halfSize, type) {
        this.center = center;
        this.halfSize = halfSize;
        this.life = type.life;
        this.color = type.color;
        this.value = type.value;

        this.hit = hit;
        this.render = render;
        this.update = update;
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
            console.assert(value !== undefined && typeof value == 'string', JSON.stringify(value));
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