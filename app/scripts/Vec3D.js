
export default class Vec3D {
    constructor(x,y,z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    length() {
        let squaredLength = (this.x*this.x + this.y*this.y + this.z*this.z);
        return Math.sqrt(squaredLength);
    }

    norm() {
        let length = this.length();
        return new Vec3D(
            this.x / length,
            this.y / length,
            this.z / length);
    }

    dot(vec) {
        let tmp = 
            this.x*vec.x +
            this.y*vec.y +
            this.z*vec.z;

        return tmp;
    }

    scale(scalar) {
        return new Vec3D(
            this.x*scalar,
            this.y*scalar,
            this.z*scalar);
    }

    plus(vec) {
        return new Vec3D(
            this.x + vec.x,
            this.y + vec.y,
            this.z + vec.z);
    }

    reverse() {
        return new Vec3D(
            -this.x, -this.y, -this.z);
    }

    toString() {
        return `vec(${this.x}, ${this.y}, ${this.z})`;
    }
}

