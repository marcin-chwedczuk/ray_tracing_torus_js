import { checkNumber } from "utils/preconditions";
import Point3D from "Point3D";


export default class CameraWindow {
    constructor(width, height, zOffset) {
        this._width = checkNumber(width, "width");
        this._height = checkNumber(height, "height");
        this._zOffset = checkNumber(zOffset, "zOffset");

        this._xMin = -this._width/2;
        this._yMin = -this._height/2;
    }

    get width() { return this._width; }
    get height() { return this._height; }
    get zOffset() { return this._zOffset; }

    computePointAtOffset(xOffset, yOffset) {
        return new Point3D(
            this._xMin + xOffset,
            this._yMin + yOffset,
            this._zOffset);
    }

    static fromAspectRatio({ width, aspectRation, zOffset }) {
        checkNumber(width, "width");
        checkNumber(aspectRation, "aspectRation");

        let height = width / aspectRation;
        return new CameraWindow(width, height, zOffset);
    }
}