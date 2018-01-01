import { checkNumber } from "utils/preconditions";
import Point3D from "Point3D";


export default class CameraWindow {
    constructor(width, height, zOffset) {
        this._width = checkNumber(width, "width");
        this._height = checkNumber(height, "height");
        this._zOffset = checkNumber(zOffset, "zOffset");

        this._xMin = -this._width/2;
        this._yMax =  this._height/2;
    }

    get width() { return this._width; }
    get height() { return this._height; }
    get zOffset() { return this._zOffset; }

    computePointAtOffset(xOffset, yOffset) {
        // Offset is computed from top left corner
        // of the camera window.
        return new Point3D(
            this._xMin + xOffset,
            this._yMax - yOffset,
            this._zOffset);
    }

    static fromAspectRatio({ width, aspectRation, zOffset }) {
        checkNumber(width, "width");
        checkNumber(aspectRation, "aspectRation");

        let height = width / aspectRation;
        return new CameraWindow(width, height, zOffset);
    }
}