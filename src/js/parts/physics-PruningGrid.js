var PruningGrid = function() {
    // because everyone need a temp vector
    var tmpVector = new Vector2(0, 0);

    /*
     * given a point, returns the coord of the corresponding cell (in vector form)
     */
    var getCellInPoint = function(x, y) {
        var coord = tmpVector;
        coord.x = Math.floor((x - this.offset.x) / this.dimension.x * this.numCells.x);
        coord.y = Math.floor((y - this.offset.y) / this.dimension.y * this.numCells.y);

        coord.x = clamp(0, coord.x, this.numCells.x - 1);
        coord.y = clamp(0, coord.y, this.numCells.y - 1);

        return coord;
    };

    var addAABB = function(AABB) {
        var fromX, fromY, toX, toY;

        var from = getCellInPoint.call(this, AABB.center.x - AABB.halfSize.x - this.overlap, AABB.center.y - AABB.halfSize.y - this.overlap);
        fromX = from.x;
        fromY = from.y;

        var to = getCellInPoint.call(this, AABB.center.x + AABB.halfSize.x + this.overlap, AABB.center.y + AABB.halfSize.y + this.overlap);
        toX = to.x;
        toY = to.y;

        for (var r = fromY; r <= toY; r++) {
            for (var c = fromX; c <= toX; c++) {
                this.grid[r][c].push(AABB);
            }
        }

    };
    var removeAABB = function(AABB) {
        var fromX, fromY, toX, toY;

        var from = getCellInPoint.call(this, AABB.center.x - AABB.halfSize.x - this.overlap, AABB.center.y - AABB.halfSize.y - this.overlap);
        fromX = from.x;
        fromY = from.y;

        var to = getCellInPoint.call(this, AABB.center.x + AABB.halfSize.x + this.overlap, AABB.center.y + AABB.halfSize.y + this.overlap);
        toX = to.x;
        toY = to.y;

        for (var r = fromY; r <= toY; r++) {
            for (var c = fromX; c <= toX; c++) {
                var cell = this.grid[r][c];
                for (var i = cell.length - 1; i >= 0; i--) {
                    if (cell[i] === AABB) {
                        cell.splice(i, 1);
                    }
                }
            }
        }
    };
    var getNearby = function(point) {
        var coord = getCellInPoint.call(this, point.x, point.y);
        return this.grid[coord.y][coord.x];
    };

    var constructor = function PruningGrid(numCells, offset, dimension, overlap) {
        // add methods
        this.addAABB = addAABB;
        this.removeAABB = removeAABB;
        this.getNearby = getNearby;

        // init param members
        this.numCells = numCells;
        this.offset = offset;
        this.dimension = dimension;
        this.overlap = overlap;

        // init other members
        var grid = [];
        for (var r = 0; r < numCells.y; r++) {
            grid[r] = [];
            for (var c = 0; c < numCells.x; c++) {
                grid[r][c] = [];
            }
        }
        this.grid = grid;
    };

    constructor.prototype = {
        /*
        set containerOffset(value) {
            console.assert(value !== undefined && value instanceof Vector2, JSON.stringify(value));
            this._containerOffset = value;
        },
        get containerOffset() {
            return this._containerOffset;
        }
        */
    };

    return constructor;
}();

function testPruningGrid() {
    var asd = new PruningGrid(new Vector2(10, 10), new Vector2(100, 100), new Vector2(500, 500), 50);

    var AABB1 = {
        center: new Vector2(175, 175),
        halfSize: new Vector2(50, 20)
    };

    asd.addAABB(AABB1);
    console.log(JSON.stringify(asd.getNearby(new Vector2(255, 175))));
}