import { checkDefined } from "utils/preconditions";
import Color from "Color";

const K_EPSILON = 0.0001;

export default class Plane2D {

    constructor(pointOnPlane, normal) {
        this.pointOnPlane = checkDefined(pointOnPlane);
        this.normal = checkDefined(normal);
    }

    hit(ray) {
        let t = this._findIntersection(ray);

        if (t >= K_EPSILON) {
            let hitPoint = ray.pointAtDistance(t);
            let color = this._findColor(hitPoint);

            return {
                tmin: t,
                normal: this.normal,
                hitPoint,
                color
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

        // TODO: Ortorzutowanie & płaszczyzna nie działają -
        // przestaw się na perspective + klasa na kamerę

        const SIZE = 1;
        const EPSILON = 1e-12;

        let x = (hitPoint.x < 0) ? -hitPoint.x + SIZE : hitPoint.x;
        let y = (hitPoint.y < 0) ? -hitPoint.y + SIZE : hitPoint.y;

        let xEven = (x / SIZE) & 1;
        let yEven = (y / SIZE) & 1;

        return ((xEven) % 2) == 0 
            ? Color.white() 
            : Color.rgb(0.5,0.5,0.5);
    }


}