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

        let hit = this._hit(this.world.objects, projection.ray);
        if (hit === null) {
            pixelColor = Color.black();
        }
        else {
            pixelColor = this._shadePoint(hit, projection.ray, this.world.lights);

            if (hit.color)
                pixelColor = hit.color; // HACK
        }


        return { color: pixelColor, pixelPosition: projection.pixelPosition };
    }

    _hit(objects, ray) {
        let tmin = Number.POSITIVE_INFINITY;
        let tminHit = null;

        for (let obj of objects) {
            let hit = obj.hit(ray);

            if (hit && (hit.tmin < tmin)) {
                tmin = hit.tmin;
                tminHit = hit;
            }
        }

        return tminHit;
    }

    _shadePoint(hit, ray, lights) {
        let color = Color.black();
        
        for (let light of lights) {
            let lightContribution = light.lightPoint(hit.hitPoint, hit.normal, ray);
            color = color.add(lightContribution);
        }

        return color.clamp();
    }
}