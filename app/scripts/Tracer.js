import Ray from "Ray";
import Vec3D from "Vec3D";
import Point3D from "Point3D";
import Color from "Color";
import World from "World";
import Viewport from "Viewport";
import { checkDefined } from "utils";

export default class Tracer {
    constructor(viewport, world) {
        this.viewport = checkDefined(viewport, "viewport");
        this.world = checkDefined(world, "world");
    }

    createPixelsGenerator() {
        return this.viewport.generateAllRowColIndicies();
    }

    rayTracePixel(pixel) {
        let origin = this.viewport.calculatePixelCenter(pixel);
        let direction = new Vec3D(0,0,-1);
        
        let ray = new Ray(origin, direction);

        let hit = this.world.hit(ray);
        if (hit === null) {
            return Color.black();
        }

        let color = this.world.shadePoint(hit.hitPoint, hit.normal, ray);
        return color;
    }
}