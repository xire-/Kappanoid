var Brick = function() {
    var render = function(g) {
        g.save();
        g.fillStyle = this.color;
        g.beginPath();
        g.rect(this.center.x - this.halfSize.x, this.center.y - this.halfSize.y, this.halfSize.x * 2, this.halfSize.y * 2);
        g.fill();
        g.restore();
    };

    var update = function(delta) {};

    var clone = function() {
        return new Brick(this.center, this.halfSize, this.life, this.color);
    };

    var toString = function() {
        return 'Brick(center: ' + this.center + ', halfSize: ' + this.halfSize + ', life: ' + this.life + ', color: ' + this.color + ')';
    };


    var constructor = function Brick(center, halfSize, life, color) {
        this.center = center;
        this.halfSize = halfSize;
        this.life = life;
        this.color = color;

        this.render = render;
        this.update = update;
        this.clone = clone;
        this.toString = toString;
    };

    constructor.prototype = {
        set center(value) {
            console.assert(value !== undefined && value instanceof Vector2, value.toString());
            this._center = value;
        },
        get center() {
            return this._center;
        },

        set halfSize(value) {
            console.assert(value !== undefined && value instanceof Vector2, value.toString());
            this._halfSize = value;
        },
        get halfSize() {
            return this._halfSize;
        },

        set life(value) {
            console.assert(value !== undefined && typeof value == 'number', value.toString());
            this._life = value;
        },
        get life() {
            return this._life;
        },

        set color(value) {
            console.assert(value !== undefined && typeof value == 'string', value.toString());
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
    var brick1 = new Brick(center1, halfSize1, 4, '#fff');
    console.assert(JSON.stringify(brick1.center) === JSON.stringify(center1) && JSON.stringify(brick1.halfSize) === JSON.stringify(halfSize1) && brick1.life === 4 && brick1.color === '#fff', brick1.toString());

    var brick2 = brick1.clone();
    console.assert(JSON.stringify(brick1) === JSON.stringify(brick2));
}