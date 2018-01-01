import Ray from "Ray";
import Vec3D from "Vec3D";

export default class PerspectiveCamera {
    constructor(eye, cameraWindow) {
        this._eye = eye;
        this._cameraWindow = cameraWindow;
    }

    get windowWidth() { return this._cameraWindow.width; }
    get windowHeight() { return this._cameraWindow.height; }

    calculateRayForPointAtWindowOffset(xOffset, yOffset) {
        let pointOnCameraWindow = 
            this._cameraWindow.computePointAtOffset(xOffset, yOffset);

        return new Ray(pointOnCameraWindow, new Vec3D(0,0,-1));

        let rayOrigin = this._eye;

        let rayDirection = pointOnCameraWindow
            .minus(rayOrigin)
            .norm();

        return new Ray(rayOrigin, rayDirection);
    }
}