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
}