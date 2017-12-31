
import World from "World";
import Viewport from "Viewport";
import RollBall from "RollBall";
import Tracer from "Tracer";
import NonBlockingExecutor from "NonBlockingExecutor";

export default class RayTracer {

    constructor(screenWidth, screenHeight) {
        this._world = World.build();

        let progressiveTracers = [16,8,4,2,1]
            .map(pixelSize => this._createTracer(this._world, screenWidth, screenWidth, pixelSize));
    
        this._lastMouseOffset = null;
        this._rollBall = new RollBall(200.0);
        this._pixelRenderedCallback = () => { };
    
        this._executor = new NonBlockingExecutor(
            function* () {
                for (let tracerIndex in progressiveTracers) {
                    let tracer = progressiveTracers[tracerIndex];
                    for (let pixel of tracer.createPixelsGenerator()) {
                        yield { tracerIndex, pixel };
                    }
                }
            },
            pair => { 
                let tracer = progressiveTracers[pair.tracerIndex];
                let pixel = pair.pixel;
    
                let color = tracer.rayTracePixel(pixel);
                return { color, row: pixel.row, col: pixel.col, pixelSize: tracer.pixelSize };
            });

            this._executor.setDataProcessedCallback(
                p => this._pixelRenderedCallback.call(null, p.pixelSize, p.row, p.col, p.color));
    }

    setPixelRenderedCallback(callback) {
        this._pixelRenderedCallback = callback;
    }

    _createTracer(world, screenWidth, screenHeight, pixelSize) {
        const horizontalResolution = screenWidth / pixelSize;
        const verticalResolution   = screenHeight / pixelSize;

        const screenAspectRatio    = screenWidth / screenHeight;
        
        const viewportWidthInWorld = 5.0;

        let viewport = new Viewport({
            viewportWidth: viewportWidthInWorld,
            viewportHeight: viewportWidthInWorld * (1.0/screenAspectRatio),
            
            zAxisOffset: 10,
    
            horizontalResolution,
            verticalResolution
        });
    
        let tracer = new Tracer(viewport, world);
        tracer.pixelSize = pixelSize; // UGLY HACK
        return tracer;
    }

    start() {
        this._executor.start();
    }

    rotationStart(x, y) {
        this._lastMouseOffset = { x, y };
    }

    rotationEnd(x, y) {
        let dx = x - this._lastMouseOffset.x;
        let dy = y - this._lastMouseOffset.y;

        console.log(`mouseup with delta dx: ${dx}, dy: ${dy}`);

        let rotationMatrix = this._rollBall.computeMatrixFromCursorDelta(dx, dy);

        // We use transpose to invert rotation matrix
        let inverse = rotationMatrix.transpose();

        this._executor.cancel();
        
        this._world.object
            .transformation
            .affine(rotationMatrix, inverse);

        this._executor.start();
    }
}