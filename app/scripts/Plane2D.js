import { checkDefined } from "utils/preconditions";
import Color from "Color";

const K_EPSILON = 0.0001;

export default class Plane2D {

    constructor(pointOnPlane, normal) {
        this.pointOnPlane = checkDefined(pointOnPlane);
        this.normal = checkDefined(normal);

        this.color1 = Color.white();
        this.color2 = Color.black();
    }

    hit(ray) {
        let t = this._findIntersection(ray);

        if (t >= K_EPSILON) {
            let hitPoint = ray.pointAtDistance(t);
            let objectColor = this._findColor(hitPoint);

            return {
                tmin: t,
                normal: this.normal,
                hitPoint,
                objectColor
            };
        }

        return null;
    }

    _findIntersection(ray) {
        // Plane equation: 
        // Point P belongs to a plane defined by
        // pointOnPlane and normal if:
        //   (P-pointOnPlane) dot normal = 0
        // In our case:
        //   P = ray.origin + ray.direction*t

        let nominator = this.pointOnPlane
            .minus(ray.origin)
            .dot(this.normal);

        let denominator = ray.direction.norm()
            .dot(this.normal);

        let t = nominator / denominator;
        return t;
    }

    _findColor(hitPoint) {
        // This work only for planes parallel
        // to XZ plane.

        const SIZE = 20;
        
        let x = (hitPoint.x < 0) ? -hitPoint.x + SIZE : hitPoint.x;
        let z = (hitPoint.z < 0) ? -hitPoint.z + SIZE : hitPoint.z;

        let xEven = (x / SIZE) & 1;
        let zEven = (z / SIZE) & 1;

        return ((xEven + zEven) & 1)
            ? this.color1
            : this.color2;
    }
}