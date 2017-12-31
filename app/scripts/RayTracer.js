
import World from "World";
import Viewport from "Viewport";
import RollBall from "RollBall";
import Tracer from "Tracer";
import NonBlockingExecutor from "NonBlockingExecutor";

export default class RayTracer {

    constructor(screenWidth, screenHeight) {
        this._pixelRenderedCallback = () => { };

        this._lastMouseOffset = null;
        this._rollBall = new RollBall(200.0);
        
        this._world = World.build();

        let progressiveViewports = 
            this._createProgressiveViewports(screenWidth, screenHeight);
        
        let self = this;
        this._executor = new NonBlockingExecutor(
            function* () {
                for (let viewport of progressiveViewports) {
                    //self._executor._taskBatchSize = viewport.horizontalResolution;

                    let tracer = new Tracer(viewport, self._world);
                    let pixelSize = viewport.pixelSize;

                    // TODO: pixelsIterator() -> position + pixelSize
                    for (let pixelPosition of tracer.createPixelsGenerator()) {
                        yield { tracer, pixelPosition, pixelSize };
                    }
                }
            },
            ({ tracer, pixelPosition, pixelSize }) => {
                let color = tracer.rayTracePixel(pixelPosition);
                return { color, row: pixelPosition.row, col: pixelPosition.col, pixelSize: pixelSize };
            });

        this._executor.setDataProcessedCallback(
                p => this._pixelRenderedCallback.call(null, p.pixelSize, p.row, p.col, p.color));
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

        const screenAspectRatio    = screenWidth / screenHeight;
        
        const viewportWidthInWorld = 5.0;

        let viewport = new Viewport({
            viewportWidth: viewportWidthInWorld,
            viewportHeight: viewportWidthInWorld * (1.0/screenAspectRatio),
            
            zAxisOffset: 10,
    
            pixelSize,
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