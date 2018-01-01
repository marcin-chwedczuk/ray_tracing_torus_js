
import { clamp, toInt } from "utils/math";

const MAX_BYTE_VALUE = 255;

export default class Color {
    constructor(r,g,b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    scale(value) {
        return new Color(
            value*this.r,
            value*this.g,
            value*this.b
        );
    }

    clamp() {
        return new Color(
            clamp(this.r, 0, 1),
            clamp(this.g, 0, 1),
            clamp(this.b, 0, 1));
    }

    plus(color) {
        return new Color(
            this.r + color.r,
            this.g + color.g,
            this.b + color.b);
    }

    multiply(color) {
        return new Color(
            this.r * color.r,
            this.g * color.g,
            this.b * color.b);
    }

    map(mapFn) {
        return new Color(
            mapFn.call(null, this.r),
            mapFn.call(null, this.g),
            mapFn.call(null, this.b));
    }

    toCssColor() {
        let rgb = this.clamp()
            .scale(MAX_BYTE_VALUE)
            .map(toInt);

        return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    }

    static white() {
        return new Color(1,1,1);
    }

    static black() {
        return new Color(0,0,0);
    }

    static rgb(r, g, b) {
        return new Color(r,g,b);
    }
}