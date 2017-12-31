
import RayTracer from "RayTracer";

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 640;

document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("canvas") ||
                  blowUp("cannot find HTML element with id 'canvas'.");
    const ctx = canvas.getContext("2d");

    const rayTracer = new RayTracer(CANVAS_WIDTH, CANVAS_HEIGHT);
    rayTracer.setPixelRenderedCallback(putPixel);

    canvas.addEventListener("mousedown", (e) => {
        let x = e.offsetX, y = e.offsetY;
        rayTracer.rotationStart(x, y);
    });

    canvas.addEventListener("mouseup", (e) => {
        let x = e.offsetX, y = e.offsetY;
        rayTracer.rotationEnd(x, y);
    });

    document.getElementById("renderButton").addEventListener("click", () => {
        rayTracer.start();
    });

    function putPixel(pixelSize, row, col, color) {
        ctx.save();
        ctx.fillStyle = color.toCssColor();
        ctx.fillRect(col*pixelSize, row*pixelSize, pixelSize, pixelSize);
        ctx.restore();
    }

    function blowUp(message) {
        throw new Error("fatal: " + message);
    }
});
