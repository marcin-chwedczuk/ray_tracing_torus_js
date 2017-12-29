
import Point3D from "Point3D";
import Vec3D from "Vec3D";
import { solve4 } from "solver";
import Transformation3D from "Transformation3D";

const K_EPSILON = 0.0001;

/**
 * Torus centerd at point (0,0,0).
 */
export default class Torus {

    constructor(sweptRadius, tubeRadius = 1.0) {
        this.sweptRadius = sweptRadius;
        this.tubeRadius = tubeRadius;
        this.transformation = new Transformation3D();
    }

    hit(ray) {
        let tfRay = this.transformation.transformRay(ray);

        let t = this.findIntersection(tfRay);
        if (t === null)
            return null;

        let localHitPoint = tfRay.pointAtDistance(t);
        let localNormal = this.computeNormalAtPoint(localHitPoint);

        return {
            tmin: t,
            hitPoint: ray.pointAtDistance(t),
            normal: this.transformation.transformNormal(localNormal)
        };
    }

    findIntersection(ray) {
        //if (!boundingBox.isIntersecting(ray))
        //    return null

        let ox = ray.origin.x;
        let oy = ray.origin.y;
        let oz = ray.origin.z;

        let dx = ray.direction.x;
        let dy = ray.direction.y;
        let dz = ray.direction.z;

        // define the coefficients of the quartic equation
        let sum_d_sqrd 	= dx * dx + dy * dy + dz * dz;
        let e			= ox * ox + oy * oy + oz * oz - 
                            this.sweptRadius*this.sweptRadius - this.tubeRadius*this.tubeRadius;
        let f			= ox * dx + oy * dy + oz * dz;
        let four_a_sqrd	= 4.0 * this.sweptRadius * this.sweptRadius;

        let coeffs = [
            e * e - four_a_sqrd * (this.tubeRadius*this.tubeRadius - oy * oy),
            4.0 * f * e + 2.0 * four_a_sqrd * oy * dy,
            2.0 * sum_d_sqrd * e + 4.0 * f * f + four_a_sqrd * dy * dy,
            4.0 * sum_d_sqrd * f,
            sum_d_sqrd * sum_d_sqrd];

        let solution = solve4(coeffs);

        // ray misses the torus
        if (!solution.length)
            return null;

        // find the smallest root greater than kEpsilon, if any
        // the roots array is not sorted
        let mint = Number.POSITIVE_INFINITY;
        for (let t of solution) {
            if ((t > K_EPSILON) && (t < mint)) {
                mint = t;
            }
        }

        return Number.isFinite(mint) ? mint : null;
    }

    computeNormalAtPoint(point) {
        let paramSquared = this.sweptRadius*this.sweptRadius + this.tubeRadius*this.tubeRadius;

        let x = point.x;
        let y = point.y;
        let z = point.z;
        let sumSquared = x * x + y * y + z * z;

        let tmp = new Vec3D(
            4.0 * x * (sumSquared - paramSquared),
            4.0 * y * (sumSquared - paramSquared + 2.0*this.sweptRadius*this.sweptRadius),
            4.0 * z * (sumSquared - paramSquared));

        return tmp.norm();
    }

}
