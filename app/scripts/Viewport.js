import Point3D from "Point3D";

import { checkNumber, checkPositiveNumber } from "utils/preconditions";

export default class Viewport {
    constructor({
        screenWidth,
        screenHeight,
        horizontalResolution = 800, 
        verticalResolution = 640 }) 
    {
        this._screenWidth = checkPositiveNumber(screenWidth, "screenWidth");
        this._screenHeight = checkPositiveNumber(screenHeight, "screenHeight");

        this._horizontalResolution = checkPositiveNumber(horizontalResolution, "horizontalResolution");
        this._verticalResolution = checkPositiveNumber(verticalResolution, "verticalResolution");

        this._screenPixelWidth = this._screenWidth / this._horizontalResolution;
        this._screenPixelHeight = this._screenHeight / this._verticalResolution;
    }

    *getDisplayRowsIterator() {
        for (let row = 0; row < this._verticalResolution; row++) {
            yield row;
        }
    }

    *getDisplayColumnsIterator() {
        for (let col = 0; col < this._horizontalResolution; col++) {
            yield col;
        }
    }

    calculateRayPixelProjection(camera, { row, col }) {
        let windowPixelWidth = camera.windowWidth / this._horizontalResolution;
        let windowPixelHeight = camera.windowHeight / this._verticalResolution;

        let xWindowOffset = windowPixelWidth  * (0.5+col);
        let yWindowOffset = windowPixelHeight * (0.5+row);

        let ray = camera.calculateRayForPointAtWindowOffset(xWindowOffset, yWindowOffset);

        return { 
            ray, 
            pixelPosition: {
                xOffset: (col * this._screenPixelWidth),
                yOffset: (row * this._screenPixelHeight),
                width: this._screenPixelWidth, 
                height: this._screenPixelHeight 
            }
        };
    }
}