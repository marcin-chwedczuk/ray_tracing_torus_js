
import RayTracer from "RayTracer";

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 640;

const DURING_DRAG_CSS_CLASS = "during-dragging";

document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("canvas") ||
                  blowUp("cannot find HTML element with id 'canvas'.");
    const ctx = canvas.getContext("2d");

    const rayTracer = new RayTracer(CANVAS_WIDTH, CANVAS_HEIGHT);
    rayTracer.setPixelRenderedCallback(putPixel);

    canvas.addEventListener("mousedown", (e) => {
        e.target.classList.add(DURING_DRAG_CSS_CLASS);

        let x = e.offsetX;
        let y = e.offsetY;
        rayTracer.rotationStart(x, y);
    });

    canvas.addEventListener("mouseup", (e) => {
        e.target.classList.remove(DURING_DRAG_CSS_CLASS)

        let x = e.offsetX;
        let y = e.offsetY;
        rayTracer.rotationEnd(x, y);
    });

    setTimeout(() => {
        rayTracer.start();
    }, 50);

    function putPixel({ color, pixelPosition }) {
        ctx.save();
        ctx.fillStyle = color.toCssColor();
        ctx.fillRect(pixelPosition.xOffset, pixelPosition.yOffset, 
            pixelPosition.width, pixelPosition.height);
        ctx.restore();
    }

    function blowUp(message) {
        throw new Error("fatal: " + message);
    }
});
