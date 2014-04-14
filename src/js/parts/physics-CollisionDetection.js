var collisionDetection = {
    /*
     * Returns true if sphere s intersects AABB b, false otherwise.
     * The point p on the AABB closest to the sphere center is also returned
     */
    testSphereAABB: function(s, b) {
        // Find point p on AABB closest to sphere center
        var p = this.closestPtPointAABB(s.center, b);
        // Sphere and AABB intersect if the (squared) distance from sphere
        // center to point p is less than the (squared) sphere radius
        var v = p.clone().sub(s.center);
        if (v.dot(v) <= s.radius * s.radius) {
            return p;
        } else {
            return null;
        }
    },

    /*
     * Given point p, return the point q on or in AABB b that is closest to p
     */
    closestPtPointAABB: function(p, b) {
        // For each coordinate axis, if the point coordinate value is
        // outside box, clamp it to the box, else keep it as is
        var q = new Vector2(0, 0);
        q.x = Math.max(b.center.x - b.halfSize.x, Math.min(p.x, b.center.x + b.halfSize.x));
        q.y = Math.max(b.center.y - b.halfSize.y, Math.min(p.y, b.center.y + b.halfSize.y));
        return q;
    }
};