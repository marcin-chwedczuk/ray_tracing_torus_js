
import Matrix4 from "Matrix4";
import { checkPositiveNumber } from "utils/preconditions";

/**
 * Implementation of Rolling-Ball algorithm: 
 * https://de.wikipedia.org/wiki/Rolling-Ball-Rotation
 */
export default class RollBall {
    constructor(R) {
        this.R = checkPositiveNumber(R);
    }

    computeMatrixFromCursorDelta(dx, dy) {
        const R = this.R;

        const dr = Math.sqrt(dx*dx+dy*dy);

        const rR = Math.sqrt(dr*dr + R*R);
        const cosT = R / rR;
        const sinT = dr / rR;

        return new Matrix4([
            cosT + (dy/dr)*(dy/dr)*(1-cosT), -(dx/dr)*(dy/dr)*(1-cosT), (dx/dr)*sinT, 0,
            -(dx/dr)*(dy/dr)*(1-cosT), cosT + (dx/dr)*(dx/dr)*(1-cosT), (dy/dr)*sinT, 0,
            -(dx/dr)*sinT, -(dy/dr)*sinT, cosT, 0,
            0, 0, 0, 1
        ]);
    }
}