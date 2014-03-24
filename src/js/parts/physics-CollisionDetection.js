var collisionDetection = {
    // Returns 2 times the signed triangle area. The result is positive if
    // abc is ccw, negative if abc is cw, zero if abc is degenerate.
    signed2DTriArea: function(a, b, c) {
        return (a.x - c.x) * (b.y - c.y) - (a.y - c.y) * (b.x - c.x);
    },

    // Test if segments ab and cd overlap. If they do, compute and return
    // intersection t value along ab and intersection position p
    test2DSegmentSegment: function(a, b, c, d) {
        // Sign of areas correspond to which side of ab points c and d are
        var a1 = this.signed2DTriArea(a, b, d); // Compute winding of abd (+ or -)
        var a2 = this.signed2DTriArea(a, b, c); // To intersect, must have sign opposite of a1
        // If c and d are on different sides of ab, areas have different signs
        if (a1 * a2 < 0) {
            // Compute signs for a and b with respect to segment cd
            var a3 = this.signed2DTriArea(c, d, a); // Compute winding of cda (+ or -)
            // Since area is constant a1 - a2 = a3 - a4, or a4 = a3 + a2 - a1
            // float a4 = Signed2DTriArea(c, d, b); // Must have opposite sign of a3
            var a4 = a3 + a2 - a1;
            // Points a and b on different sides of cd if areas have different signs
            if (a3 * a4 < 0) {
                // Segments intersect. Find intersection point along L(t) = a + t * (b - a).
                // Given height h1 of an over cd and height h2 of b over cd,
                // t = h1 / (h1 - h2) = (b*h1/2) / (b*h1/2 - b*h2/2) = a3 / (a3 - a4),
                // where b (the base of the triangles cda and cdb, i.e., the length
                // of cd) cancels out.   
                var t = a3 / (a3 - a4);
                var p = new Vector2(a.x + t * (b.x - a.x), a.y + t * (b.y - a.y)); // a + t * (b - a)
                return {
                    t: t,
                    p: p
                };
            }
        }
        // Segments not intersecting (or collinear)
        return null;
    },
};

function testCollisionDetection() {
    var a = new Vector2(2, 2);
    var b = new Vector2(4, 2);
    var c = new Vector2(3, 1);
    var d = new Vector2(3, 3);
    var r = collisionDetection.test2DSegmentSegment(a, b, c, d);
    console.assert(r.t === 0.5 && JSON.stringify(r.p) === JSON.stringify(new Vector2(3, 2)));

    a = new Vector2(2, 2);
    b = new Vector2(4, 2);
    c = new Vector2(3, 3);
    d = new Vector2(3, 3);
    r = collisionDetection.test2DSegmentSegment(a, b, c, d);
    console.assert(r === null);

    a = new Vector2(0, 0);
    b = new Vector2(0, 1);
    c = new Vector2(0, 1);
    d = new Vector2(1, 1);
    r = collisionDetection.test2DSegmentSegment(a, b, c, d);
    console.assert(r === null);

    a = new Vector2(0, 0);
    b = new Vector2(0, 1);
    c = new Vector2(0, 1);
    d = new Vector2(0, 0.75);
    r = collisionDetection.test2DSegmentSegment(a, b, c, d);
    console.assert(r === null);

    a = new Vector2(0, 0);
    b = new Vector2(0, 1);
    c = new Vector2(-1, 0.75);
    d = new Vector2(1, 0.75);
    r = collisionDetection.test2DSegmentSegment(a, b, c, d);
    console.assert(r.t === 0.75 && JSON.stringify(r.p) === JSON.stringify(new Vector2(0, 0.75)));
}