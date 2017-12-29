import Point3D from "Point3D";
import Vec3D from "Vec3D";

export default class Ray {
    constructor(origin, direction) {
        this.origin = origin;
        this.direction = direction;
    }

    pointAtDistance(t) {
        return this.origin.translate(
            this.direction.scale(t));
    }
}

