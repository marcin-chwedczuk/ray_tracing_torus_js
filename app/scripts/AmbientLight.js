
export default class AmbientLight {
    constructor(color, power = 0.1) {
        this._color = color;
        this._power = power;
    }

    lightPoint(normal, ray, objectColor) {
        return objectColor.scale(this._power);
    }
}