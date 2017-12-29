import Point3D from "Point3D";
import Vec3D from "Vec3D";

export default class Matrix4 {

    constructor(elements) {
        if (!Array.isArray(elements))
            throw new Error("Invalid argument: 'elements' must be an array.");

        if (elements.length !== 16)
            throw new Error("Expecting array of length 16 but found: " + elements + ".");

        this._m = elements.slice();
    }
    
    get(row, col) {
        if (row < 0 || row > 4) throw new RangeError(`row value '${row}' must be in range [0..4).`);
        if (col < 0 || col > 4) throw new RangeError(`col value '${col}' must be in range [0..4).`);

        return this._m[row * 4 + col];
    }

    times(otherMatrix) {
        var copy = Array(16);

        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                var sum = 0.0;

                for (let j = 0; j < 4; j++) {
                    sum += this.get(row,j) * otherMatrix.get(j,col);
                }

                copy[row*4 + col] = sum;
            }
        }

        return new Matrix4(copy);
    }

    transpose() {
        var transpose = Array(16);

        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                transpose[col*4 + row] = this.get(row, col);
            }
        }

        return new Matrix4(transpose);
    }

    transformPoint(point) {
        return new Point3D(
            this.get(0,0)*point.x + this.get(0,1)*point.y + this.get(0,2)*point.z + this.get(0,3),
            this.get(1,0)*point.x + this.get(1,1)*point.y + this.get(1,2)*point.z + this.get(1,3),
            this.get(2,0)*point.x + this.get(2,1)*point.y + this.get(2,2)*point.z + this.get(2,3));
    }

    transformVector(vec) {
        return new Vec3D(
            this.get(0,0)*vec.x + this.get(0,1)*vec.y + this.get(0,2)*vec.z,
            this.get(1,0)*vec.x + this.get(1,1)*vec.y + this.get(1,2)*vec.z,
            this.get(2,0)*vec.x + this.get(2,1)*vec.y + this.get(2,2)*vec.z);
    }

    /**
     * We use equality {@code (transposed matrix)*normal = transformed_normal}.
     */
    transformNormal(n) {
        return new Vec3D(
            this.get(0,0) * n.x + this.get(1,0) * n.y + this.get(2,0) * n.z,
            this.get(0,1) * n.x + this.get(1,1) * n.y + this.get(2,1) * n.z,
            this.get(0,2) * n.x + this.get(1,2) * n.y + this.get(2,2) * n.z);
    }

    static translate(dx, dy, dz) {
        return new Matrix4([
            1.0, 0.0, 0.0, dx,
            0.0, 1.0, 0.0, dy,
            0.0, 0.0, 1.0, dz,
            0.0, 0.0, 0.0, 1.0
        ]);
    }

    static translateInverse(dx, dy, dz) {
        return new Matrix4([
            1.0, 0.0, 0.0, -dx,
            0.0, 1.0, 0.0, -dy,
            0.0, 0.0, 1.0, -dz,
            0.0, 0.0, 0.0, 1.0
        ]);
    }

    static rotateX(angleDeg) {
        var sin = Math.sin(deg2rad(angleDeg));
        var cos = Math.cos(deg2rad(angleDeg));

        return new Matrix4([
            1.0, 0.0, 0.0, 0.0,
            0.0, cos, -sin, 0.0,
            0.0, sin, cos, 0.0,
            0.0, 0.0, 0.0, 1.0 
        ]);
    }

    static rotateXInverse(angleDeg) {
        var sin = Math.sin(deg2rad(angleDeg));
        var cos = Math.cos(deg2rad(angleDeg));

        return new Matrix4([
            1.0, 0.0, 0.0, 0.0,
            0.0, cos, sin, 0.0,
            0.0, -sin, cos, 0.0,
            0.0, 0.0, 0.0, 1.0
        ]);
    }

    static rotateY(angleDeg) {
        var sin = Math.sin(deg2rad(angleDeg));
        var cos = Math.cos(deg2rad(angleDeg));

        return new Matrix4([
            cos, 0.0, sin, 0.0,
            0.0, 1.0, 0.0, 0.0,
            -sin, 0.0, cos, 0.0,
            0.0, 0.0, 0.0, 1.0
        ]);
    }

    static rotateYInverse(angleDeg) {
        var sin = Math.sin(deg2rad(angleDeg));
        var cos = Math.cos(deg2rad(angleDeg));

        return new Matrix4([
            cos, 0.0, -sin, 0.0,
            0.0, 1.0, 0.0, 0.0,
            sin, 0.0, cos, 0.0,
            0.0, 0.0, 0.0, 1.0
        ]);
    }

    static rotateZ(angleDeg) {
        var sin = Math.sin(deg2rad(angleDeg));
        var cos = Math.cos(deg2rad(angleDeg));

        return new Matrix4([
            cos, -sin, 0.0, 0.0,
            sin, cos, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            0.0, 0.0, 0.0, 1.0
        ]);
    }

    static rotateZInverse(angleDeg) {
        var sin = Math.sin(deg2rad(angleDeg));
        var cos = Math.cos(deg2rad(angleDeg));

        return new Matrix4([
            cos, sin, 0.0, 0.0,
            -sin, cos, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            0.0, 0.0, 0.0, 1.0
        ]);
    }
}

export const MATRIX4_IDENTITY = new Matrix4([
    1.0, 0.0, 0.0, 0.0,
    0.0, 1.0, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    0.0, 0.0, 0.0, 1.0
]);

export const MATRIX4_ZERO = new Matrix4([
    0.0, 0.0, 0.0, 0.0,
    0.0, 0.0, 0.0, 0.0,
    0.0, 0.0, 0.0, 0.0,
    0.0, 0.0, 0.0, 0.0
]);

function deg2rad(angleDeg) {
    return (angleDeg / 180.0) * Math.PI;
}