var Brick = function() {
    var hit = function() {
        this.life -= 1;
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


    var constructor = function Brick(center, halfSize, life, color) {
        this.center = center;
        this.halfSize = halfSize;
        this.life = life;
        this.color = color;

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
    };

    return constructor;
}();

function testBrick() {
    var center1 = new Vector2(3, 4);
    var halfSize1 = new Vector2(100, 300);
    var life1 = 5;
    var color1 = '#abc';
    var brick1 = new Brick(center1, halfSize1, life1, color1);
    console.assert(JSON.stringify(brick1.center) === JSON.stringify(center1) && JSON.stringify(brick1.halfSize) === JSON.stringify(halfSize1) && brick1.life === life1 && brick1.color === color1, JSON.stringify(brick1));

    console.log('testBrick OK');
}