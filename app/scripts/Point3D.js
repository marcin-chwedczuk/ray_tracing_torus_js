import Vec3D from "Vec3D";


export default class Point3D {
    constructor(x,y,z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    translate(vector) {
        return new Point3D(
            this.x + vector.x,
            this.y + vector.y,
            this.z + vector.z);
    }

    minus(otherPoint) {
        return new Vec3D(
            this.x - otherPoint.x,
            this.y - otherPoint.y,
            this.z - otherPoint.z);
    }

    toString() {
        return `point(${this.x}, ${this.y}, ${this.z})`;
    }
}

