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

    getDisplayRowsIterator() {
        return this.viewport.getDisplayRowsIterator();
    }

    getDisplayColumnsIterator() {
        return this.viewport.getDisplayColumnsIterator();
    }

    rayTracePixel(pixel) {
        let projection = 
            this.viewport.calculateRayPixelProjection(this.world.camera, pixel);
        
        let hit = this._hit(this.world.objects, projection.ray);

        let pixelColor = null;
        if (hit === null) {
            pixelColor = Color.black();
        }
        else {
            pixelColor = this._shadePoint(hit, projection.ray, this.world.lights);
        }

        return { color: pixelColor, position: projection.pixelPosition };
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
            let lightContribution = light.lightPoint(hit.normal, ray, hit.objectColor);
            color = color.plus(lightContribution);
        }

        return color.clamp();
    }
}