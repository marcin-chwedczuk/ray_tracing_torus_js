import Ray from "Ray";
import Vec3D from "Vec3D";
import Point3D from "Point3D";
import Color from "Color";
import World from "World";
import Viewport from "Viewport";
import { checkDefined } from "utils/preconditions";

export default class Tracer {
    constructor(viewport, world) {
        this.viewport = checkDefined(viewport, "viewport");
        this.world = checkDefined(world, "world");
    }

    createPixelsGenerator() {
        return this.viewport.generateAllRowColIndicies();
    }

    rayTracePixel(pixel) {
        let projection = 
            this.viewport.calculateRayPixelProjection(this.world.camera, pixel);
        
        let pixelColor = null;

        let hit = this.world.hit(projection.ray);
        if (hit === null) {
            pixelColor = Color.black();
        }
        else {
            pixelColor = this.world.shadePoint(hit.hitPoint, hit.normal, projection.ray);

            if (hit.color)
                pixelColor = hit.color; // HACK
        }


        return { color: pixelColor, pixelPosition: projection.pixelPosition };
    }
}