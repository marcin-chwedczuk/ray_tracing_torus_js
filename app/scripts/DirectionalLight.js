
import Vec3D from "Vec3D";
import Point3D from "Point3D";
import Color from "Color";

export default class DirectionalLight {
    constructor(lightDirection, lightColor = Color.white()) {
        this.lightDirection = lightDirection.norm();
        this.toLightSourceDirection = this.lightDirection.reverse();

        this.lightColor = lightColor;
    }

    lightPoint(hitPoint, normal, ray) {
        let contribLambert = normal.dot(this.toLightSourceDirection);
        if (contribLambert < 0.0) {
            contribLambert = 0.0;
        }
        
        let incomingDotNormal = this.toLightSourceDirection.dot(normal);
        let reflectedIncomingLightVector =
                this.toLightSourceDirection.reverse().plus( 
                    normal.scale(incomingDotNormal * 2.0));

        let rDotOutgoing = reflectedIncomingLightVector.dot(ray.direction.reverse().norm());
        
        let contribSpecular = 0.0;
        if (rDotOutgoing > 0.0) {
            contribSpecular = Math.pow(rDotOutgoing, 100.0);
        }

        return this.lightColor
            .scale(contribLambert + contribSpecular)
            .clamp();
    }
}