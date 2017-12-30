
import Ray from "Ray";
import Torus from "Torus";
import Vec3D from "Vec3D";
import Point3D from "Point3D";
import Color from "Color";
import DirectionalLight from "DirectionalLight";
import World from "World";
import Viewport from "Viewport";
import RollBall from "RollBall";
import Tracer from "Tracer";
import NonBlockingExecutor from "NonBlockingExecutor";

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 640;
const PIXEL_SIZE = 16;

const VIEWPORT_PIXEL_WIDTH = CANVAS_WIDTH / PIXEL_SIZE;
const VIEWPORT_PIXEL_HEIGHT = CANVAS_HEIGHT / PIXEL_SIZE;


console.log(`VIEWPORT SIZE: ${VIEWPORT_PIXEL_WIDTH}x${VIEWPORT_PIXEL_HEIGHT}`);

document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("canvas") ||
                  blowUp("cannot find HTML element with id 'canvas'.");
    const ctx = canvas.getContext("2d");

    let world = createWorld();
    let progressiveTracers = [16,8,4,2,1]
        .map(pixelSize => createTracer(world, pixelSize));

    let lastMouseOffset = null;
    let rollBall = new RollBall(200.0);

    let executor = new NonBlockingExecutor(
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

    executor.setDataProcessedCallback(
        p => putPixel(p.pixelSize, p.row, p.col, p.color.r, p.color.g, p.color.b));


    canvas.addEventListener("mousedown", (e) => {
        let x = e.offsetX, y = e.offsetY;
        lastMouseOffset = { x, y };
    });

    canvas.addEventListener("mouseup", (e) => {
        let x = e.offsetX, y = e.offsetY;

        let dx = x - lastMouseOffset.x;
        let dy = y - lastMouseOffset.y;

        console.log(`mouseup with delta dx: ${dx}, dy: ${dy}`);

        let rotationMatrix = rollBall.computeMatrixFromCursorDelta(dx, dy);

        // We use transpose to invert rotation matrix
        let inverse = rotationMatrix.transpose();

        executor.cancel();
        
        world.object
            .transformation
            .affine(rotationMatrix, inverse);

        executor.start();
    });

    console.log("canvas setup finished...");

    document.getElementById("renderButton").addEventListener("click", () => {
        executor.start();
    });

    function createTracer(world, pixelSize) {
        const VIEWPORT_PIXEL_WIDTH = CANVAS_WIDTH / pixelSize;
        const VIEWPORT_PIXEL_HEIGHT = CANVAS_HEIGHT / pixelSize;
        
        const VIEWPORT_WIDTH = 5.0;

        let viewport = new Viewport({
            viewportWidth: VIEWPORT_WIDTH,
            viewportHeight: VIEWPORT_WIDTH * (CANVAS_HEIGHT/CANVAS_WIDTH),
            
            zAxisOffset: 10,
    
            horizontalResolution: VIEWPORT_PIXEL_WIDTH,
            verticalResolution: VIEWPORT_PIXEL_HEIGHT
        });
    
        let tracer = new Tracer(viewport, world);
        tracer.pixelSize = pixelSize; // UGLY HACK
        return tracer;
    }

    function createWorld() {
        let torus = new Torus(1.0, 0.2);
        torus.transformation.
            rotateX(-16).
            rotateY(0);

        let light = new DirectionalLight(new Vec3D(-0.5,0,-1), Color.white());
    
        return new World(torus, light);
    }

    function putPixel(pixelSize, row, col, r, g, b) {
        ctx.save();
        ctx.fillStyle = `rgb(${colorByte(r)},${colorByte(g)},${colorByte(b)})`;
        ctx.fillRect(col*pixelSize, row*pixelSize, pixelSize, pixelSize);
        ctx.restore();

        function colorByte(v) {
            return Math.floor(v*255.0);
        }
    }

    function blowUp(message) {
        throw new Error("fatal: " + message);
    }
});
