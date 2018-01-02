import Vec3D from "Vec3D";
import Color from "Color";
import Torus from "Torus";
import DirectionalLight from "DirectionalLight";
import Plane2D from "Plane2D";
import Point3D from "Point3D";
import PerspectiveCamera from "PerspectiveCamera";
import CameraWindow from "CameraWindow";
import AmbientLight from "AmbientLight";
import { checkDefined } from "utils/preconditions";

export default class World {
    constructor() {
        this.objects = [];
        this.lights = [];
    }

    _buildScene(screenAspectRatio) {
        this._setupCamera(screenAspectRatio);
        this._setupLights();
        this._setupObjects();
    }

    _setupCamera(screenAspectRatio) {
        let cameraWindow = CameraWindow.fromAspectRatio({
            width: 5.0,
            aspectRation: screenAspectRatio,
            zOffset: 1.0
        });

        let cameraEye = new Point3D(0, 0, 10.0);

        this.camera = new PerspectiveCamera(cameraEye, cameraWindow);
    }

    _setupLights() {
        let ambientLight = new AmbientLight(Color.white(), 0.2);
        this._addLight(ambientLight);

        let directionalLight = new DirectionalLight(
            new Vec3D(0,-1,0), 
            Color.white());
        this._addLight(directionalLight);
    }

    _setupObjects() {
        let torus = new Torus(1.0, 0.4);
        torus.color = Color.rgb(0.88, 0.95, 0.26);
        torus.transformation.
            rotateX(-16).
            rotateY(0);

        this._torus = torus;
        this._addObject(torus);

        let floor = new Plane2D(
            new Point3D(0,-30,0), 
            new Vec3D(0,1,0));
        floor.color1 = Color.black();
        floor.color2 = Color.gray(0.5);

        this._addObject(floor);
    }

    _addLight(light) { this.lights.push(light); }
    _addObject(object) { this.objects.push(object); }

    onUserRequestedRotation(rotationMatrix, inverseRotationMatrix) {
        this._torus
            .transformation
            .affine(rotationMatrix, inverseRotationMatrix);
    }

    static build(screenAspectRatio) {
        let world = new World();
        world._buildScene(screenAspectRatio);
        return world;
    }
}