
import World from "World";
import Viewport from "Viewport";
import RollBall from "RollBall";
import Tracer from "Tracer";
import NonBlockingExecutor from "NonBlockingExecutor";
import Torus from "Torus";

export default class RayTracer {

    constructor(screenWidth, screenHeight) {
        this._pixelRenderedCallback = () => { };

        this._lastMouseOffset = null;
        this._rollBall = new RollBall(200.0);
        
        let screenAspectRatio = screenWidth / screenHeight;
        this._world = World.build(screenAspectRatio);

        let progressiveViewports = 
            this._createProgressiveViewports(screenWidth, screenHeight);
        
        let self = this;
        this._executor = new NonBlockingExecutor(
            function* () {
                for (let viewport of progressiveViewports) {
                    //self._executor._taskBatchSize = viewport.horizontalResolution;

                    let tracer = new Tracer(viewport, self._world);

                    // TODO: pixelsIterator() -> position + pixelSize
                    for (let pixelPosition of tracer.createPixelsGenerator()) {
                        yield { tracer, pixelPosition };
                    }
                }
            },
            ({ tracer, pixelPosition }) => {
                let screenPixel = tracer.rayTracePixel(pixelPosition);
                return screenPixel;
            });

        this._executor.setDataProcessedCallback(
                p => this._pixelRenderedCallback.call(null, p));
    }

    setPixelRenderedCallback(callback) {
        this._pixelRenderedCallback = callback;
    }

    _createProgressiveViewports(screenWidth, screenHeight) {
        const pixelSizes = [16, 8, 4, 2, 1];

        return pixelSizes.map(size => 
            this._createViewport(screenWidth, screenHeight, size));
    }

    _createViewport(screenWidth, screenHeight, pixelSize) {
        const horizontalResolution = screenWidth / pixelSize;
        const verticalResolution   = screenHeight / pixelSize;

        let viewport = new Viewport({
            screenWidth,
            screenHeight,
            horizontalResolution,
            verticalResolution
        });
    
        return viewport;
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
        
        this._executor.cancel();

        // Reflect dy - because we use standard 2D axis (with Y moving to the bottom).
        let rotationMatrix = this._rollBall.computeMatrixFromCursorDelta(dx, -dy);
        // We use transpose to inverse rotation matrix
        let inverse = rotationMatrix.transpose();

        this._world.onUserRequestedRotation(rotationMatrix, inverse);

        this._executor.start();
    }
}