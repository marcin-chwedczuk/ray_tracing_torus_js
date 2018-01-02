
import World from "World";
import Viewport from "Viewport";
import RollBall from "RollBall";
import Tracer from "Tracer";
import NonBlockingExecutor from "NonBlockingExecutor";
import Torus from "Torus";
import { checkDefined, checkFunction, checkPositiveNumber } from "utils/preconditions";

export default class RayTracer {

    constructor(screenWidth, screenHeight) {
        checkPositiveNumber(screenWidth, "screenWidth");
        checkPositiveNumber(screenHeight, "screenHeight");

        this._displayRowRenderedCallback = () => { };

        this._lastMouseOffset = null;
        this._rollBall = new RollBall(200.0);
        
        let screenAspectRatio = screenWidth / screenHeight;
        this._world = World.build(screenAspectRatio);

        this._progressiveViewports = this._createProgressiveViewports(screenWidth, screenHeight);

        this._executor = new NonBlockingExecutor(
            () => this._getDisplayRowsIterator(),
            ({ tracer, rowToRender }) => this._rayTraceDisplayRow(tracer, rowToRender));

        this._executor.setDataProcessedCallback(rayTracedPixels => 
            this._displayRowRenderedCallback.call(null, rayTracedPixels));
    }

    setDisplayRowRenderedCallback(callback) {
        this._displayRowRenderedCallback = checkFunction(callback, "callback");
    }

    _rayTraceDisplayRow(tracer, rowToRender) {
        let rayTracedPixels = [];

        for (let col of tracer.getDisplayColumnsIterator()) {
            let pixelColorAndPosition = 
                tracer.rayTracePixel({ row: rowToRender, col: col });

            rayTracedPixels.push(pixelColorAndPosition);
        }

        return rayTracedPixels;
    }

    *_getDisplayRowsIterator() {
        for (let viewport of this._progressiveViewports) {
            let tracer = new Tracer(viewport, this._world);

            for (let row of tracer.getDisplayRowsIterator()) {
                yield { tracer, rowToRender: row };
            }
        }
    }

    _createProgressiveViewports(screenWidth, screenHeight) {
        const pixelSizes = [32, 16, 8, 4, 2, 1];

        return pixelSizes.map(pixelSize => 
            this._createViewport(screenWidth, screenHeight, pixelSize));
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