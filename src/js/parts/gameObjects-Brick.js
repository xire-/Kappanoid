var Brick = (function() {
    var baseBrick = Object.defineProperties({}, {
        _center: {
            writable: true
        },
        get center() {
            return this._center;
        },
        set center(vector) {
            console.assert(vector instanceof Vector2);
            this._center = vector;
        },

        _halfSize: {
            writable: true
        },
        get halfSize() {
            return this._halfSize;
        },
        set halfSize(vector) {
            console.assert(vector instanceof Vector2);
            this._halfSize = vector;
        },

        life: {
            writable: true
        },

        color: {
            writable: true
        },

        render: {
            value: function(g) {
                g.save();
                g.fillStyle = this.color;
                g.beginPath();
                g.rect(this.center.x - this.halfSize.x, this.center.y - this.halfSize.y, this.halfSize.x * 2, this.halfSize.y * 2);
                g.fill();
                g.restore();
            }
        },

        clone: {
            value: function() {
                return new Brick(this.center, this.halfSize, this.life, this.color);
            }
        },

        toString: {
            value: function() {
                return 'Brick(center: ' + this.center + ', halfSize: ' + this.halfSize + ', life: ' + this.life + ', color: ' + this.color + ')';
            }
        }
    });

    var Brick = function(center, halfSize, life, color) {
        console.assert(center !== undefined && center instanceof Vector2, center.toString());
        this.center = center;

        console.assert(halfSize !== undefined && halfSize instanceof Vector2, halfSize.toString());
        this.halfSize = halfSize;

        console.assert(life !== undefined && typeof life == 'number', life.toString());
        this.life = life;

        console.assert(color !== undefined && typeof color == 'string', color.toString());
        this.color = color;
    };
    Brick.prototype = baseBrick;
    return Brick;
}());

function testBrick() {
    var center1 = new Vector2(3, 4);
    var halfSize1 = new Vector2(100, 300);
    var brick1 = new Brick(center1, halfSize1, 4, '#fff');
    console.assert(JSON.stringify(brick1.center) === JSON.stringify(center1) && JSON.stringify(brick1.halfSize) === JSON.stringify(halfSize1) && brick1.life === 4 && brick1.color === '#fff', brick1.toString());

    var brick2 = brick1.clone();
    console.assert(JSON.stringify(brick1) === JSON.stringify(brick2));
}