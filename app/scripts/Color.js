
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
            Math.max(0.0, Math.min(1.0, this.r)),
            Math.max(0.0, Math.min(1.0, this.g)),
            Math.max(0.0, Math.min(1.0, this.b)));
    }

    static white() {
        return new Color(1,1,1);
    }
}