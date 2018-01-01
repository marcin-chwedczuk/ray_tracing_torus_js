
import Vec3D from "Vec3D";
import Point3D from "Point3D";
import Color from "Color";

export default class DirectionalLight {
    constructor(lightDirection, lightColor = Color.white()) {
        this.lightDirection = lightDirection.norm();
        this.toLightSourceDirection = this.lightDirection.reverse();

        this.lightColor = lightColor;
    }

    lightPoint(normal, ray, objectColor) {
        let diffuse = this._diffuseContribution(normal, objectColor);
        let specular = this._specularContribution(normal, ray);
        
        return diffuse.plus(specular);
    }

    _diffuseContribution(normal, objectColor) {
        let contrib = normal.dot(this.toLightSourceDirection);

        if (contrib < 0.0) {
            contrib = 0.0;
        }

        // Color of diffused light depends on object color
        return this.lightColor
            .multiply(objectColor)
            .scale(contrib);
    }

    _specularContribution(normal, ray) {
        let incomingDotNormal = this.toLightSourceDirection.dot(normal);

        let reflected =
                this.lightDirection.plus( 
                    normal.scale(incomingDotNormal * 2.0));

        let rDotOutgoing = reflected.dot(ray.direction.reverse().norm());
        
        let contribSpecular = 0.0;
        if (rDotOutgoing > 0.0) {
            contribSpecular = Math.pow(rDotOutgoing, 100.0);
        }

        // Specular depends only on light color
        return this.lightColor
            .scale(contribSpecular);
    }
}