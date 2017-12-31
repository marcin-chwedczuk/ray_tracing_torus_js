import Vec3D from "Vec3D";
import Color from "Color";
import Torus from "Torus";
import DirectionalLight from "DirectionalLight";

export default class World {
    constructor(object, light) {
        this.object = object;
        this.light = light;
    }

    hit(ray) {
        return this.object.hit(ray);
    }

    shadePoint(hitPoint, normal, ray) {
        return this.light.lightPoint(hitPoint, normal, ray);
    }

    static build() {
        let torus = new Torus(1.0, 0.2);
        torus.transformation.
            rotateX(-16).
            rotateY(0);

        let light = new DirectionalLight(new Vec3D(-0.5,0,-1), Color.white());
    
        return new World(torus, light);
    }
}