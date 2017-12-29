import Ray from "Ray";
import Vec3D from "Vec3D";
import Point3D from "Point3D";
import Color from "Color";
import World from "World";

const TIMER_DELAY_MILLISECONDS = 0;

export default class NonblockingTracer {
    constructor(
        viewport,
        workSizePerIteration = viewport.verticalResolution)
    {
        this.viewport = viewport;
        this.workSizePerIteration = workSizePerIteration;

        this.onPixelRenderedHandler = function() { };

        this.intervalId = null;
        this.pixelCoordsGenerator = null;
    }

    /**
     * Registers {@code callback} that will be called
     * after pixel is raytraced.
     * 
     * @param {function} callback Function that will be called with the
     *   following parameters {@code callback(pixelRow, pixelCol, color)}.
     */
    onPixelRendered(callback) {
        if (!(callback instanceof Function)) {
            throw new Error("Invalid argument: 'callback' must be a function.");
        }

        this.onPixelRenderedHandler = callback;
    }

    startRendering(world) {
        if (this.isRenderingInProgress()) {
            throw new Error("Rendering is already in progress.");
        }

        this.pixelCoordsGenerator = this.viewport.generateAllRowColIndicies();

        this.intervalId = setInterval(
            () => {
                for(let i = 0; i < this.workSizePerIteration; i++) {
                    var nextPixelCoords = this.pixelCoordsGenerator.next();

                    if (nextPixelCoords.done) {
                        this.stopRendering();
                        break;
                    }
                    else {
                        this._renderPixel(world, nextPixelCoords.value);
                    }
                }
            }, TIMER_DELAY_MILLISECONDS);
    }

    stopRendering() {
        if (this.intervalId !== null) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }

        this.pixelCoordsGenerator = null;
    }

    isRenderingInProgress() {
        return (this.intervalId !== null);
    }

    _renderPixel(world, { row, col }) {
        //console.log(`renderPixel ${row} ${col}`);

        let direction = new Vec3D(0,0,-1);
        let origin = this.viewport.calculatePixelCenter(row, col);

        let ray = new Ray(origin, direction.norm());
        let hit = world.hit(ray);

        if (hit === null) {
            this.onPixelRenderedHandler(row, col, Color.black());
        }
        else {
            let color = world.shadePoint(hit.hitPoint, hit.normal, ray);
            this.onPixelRenderedHandler(row, col, color);
        }
    }




}