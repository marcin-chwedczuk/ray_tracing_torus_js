import Point3D from "Point3D";

import { checkNumber, checkPositiveNumber } from "utils";

export default class Viewport {
    constructor({
        viewportWidth, 
        viewportHeight,
        zAxisOffset,

        horizontalResolution = 800, 
        verticalResolution = 640
    }) 
    {
        this.viewportWidth = checkPositiveNumber(viewportWidth, "viewportWidth");
        this.viewportHeight = checkPositiveNumber(viewportHeight, "viewportHeight");
        this.zAxisOffset = checkNumber(zAxisOffset, "zAxisOffset");

        this.horizontalResolution = checkPositiveNumber(horizontalResolution, "horizontalResolution");
        this.verticalResolution = checkPositiveNumber(verticalResolution, "verticalResolution");
    }

    *generateAllRowColIndicies() {
        for (let row = 0; row < this.verticalResolution; row++) {
            for (let col = 0; col < this.horizontalResolution; col++) {
                yield { row, col };
            }
        }
    }

    calculatePixelCenter({ row, col }) {
        // Viewport is centered around (0,0,0) point.
        // Last '-0.5' is used to subtract half of the viewport width/height.
        let x = this.viewportWidth  * ( ((0.5+col)/this.horizontalResolution) - 0.5 );
        let y = this.viewportHeight * ( ((0.5+row)/this.verticalResolution)   - 0.5 );

        return new Point3D(x, y, this.zAxisOffset);
    }
}