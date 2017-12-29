
import Ray from "Ray";
import Torus from "Torus";
import Vec3D from "Vec3D";
import Point3D from "Point3D";
import Color from "Color";
import DirectionalLight from "DirectionalLight";
import World from "World";
import NonblockingTracer from "NonblockingTracer";
import Viewport from "Viewport";
import RollBall from "RollBall";

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 640;
const PIXEL_SIZE = 8;

const VIEWPORT_PIXEL_WIDTH = CANVAS_WIDTH / PIXEL_SIZE;
const VIEWPORT_PIXEL_HEIGHT = CANVAS_HEIGHT / PIXEL_SIZE;


console.log(`VIEWPORT SIZE: ${VIEWPORT_PIXEL_WIDTH}x${VIEWPORT_PIXEL_HEIGHT}`);

document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("canvas") ||
                  blowUp("cannot find HTML element with id 'canvas'.");
    const ctx = canvas.getContext("2d");

    let torus = new Torus(1.0, 0.2);
    torus.transformation.
        rotateX(-16).
        rotateY(0);
    let light = new DirectionalLight(new Vec3D(0,0,-1), Color.white());

    let world = new World(torus, light);

    let lastMouseOffset = null;
    let rollBall = new RollBall(200.0);

    const VIEWPORT_WIDTH = 5.0;
    let viewport = new Viewport({
        viewportWidth: VIEWPORT_WIDTH,
        viewportHeight: VIEWPORT_WIDTH * (VIEWPORT_PIXEL_HEIGHT / VIEWPORT_PIXEL_WIDTH),
        
        zAxisOffset: 10,

        horizontalResolution: VIEWPORT_PIXEL_WIDTH,
        verticalResolution: VIEWPORT_PIXEL_HEIGHT
    });

    let tracer = new NonblockingTracer(viewport);

    tracer.onPixelRendered((row, col, color) => {
        putPixel(row, col, color.r, color.g, color.b);
    });

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

        tracer.stopRendering();

        torus.transformation.affine(rotationMatrix, inverse);
        tracer.startRendering(world);
    });

    console.log("canvas setup finished...");

    document.getElementById("renderButton").addEventListener("click", () => {

        


        tracer.startRendering(world);


    });

    function putPixel(row, col, r, g, b) {
        ctx.save();
        ctx.fillStyle = `rgb(${colorByte(r)},${colorByte(g)},${colorByte(b)})`;
        ctx.fillRect(col*PIXEL_SIZE, row*PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
        ctx.restore();

        function colorByte(v) {
            return Math.floor(v*255.0);
        }
    }

    function blowUp(message) {
        throw new Error("fatal: " + message);
    }
});
