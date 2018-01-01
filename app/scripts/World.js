import Vec3D from "Vec3D";
import Color from "Color";
import Torus from "Torus";
import DirectionalLight from "DirectionalLight";
import Plane2D from "Plane2D";
import Point3D from "Point3D";
import PerspectiveCamera from "PerspectiveCamera";
import CameraWindow from "CameraWindow";
import AmbientLight from "AmbientLight";

export default class World {
    constructor(objects, lights, camera) {
        this.objects = objects;
        this.lights = lights;
        this.camera = camera;
    }

    hit(ray) {
        return this.objects.hit(ray);
    }

    shadePoint(hitPoint, normal, ray) {
        return this.light.lightPoint(hitPoint, normal, ray);
    }

    static build(screenAspectRatio) {
        let torus = new Torus(1.0, 0.4);
        torus.color = Color.rgb(1.0, 0.0, 0.0);
        torus.transformation.
            rotateX(-16).
            rotateY(0);

        let floor = new Plane2D(
            new Point3D(0,-35.4,0), 
            new Vec3D(0,1,0));

        let ambientLight = new AmbientLight(Color.white(), 0.1);
        let light = new DirectionalLight(
            new Vec3D(0,-1,0), 
            Color.rgb(1,1,0));

        let camera = World._createCamera(screenAspectRatio);

        return new World([torus, floor], [light, ambientLight], camera);
    }

    static _createCamera(screenAspectRatio) {
        let cameraWindow = CameraWindow.fromAspectRatio({
            width: 5.0,
            aspectRation: screenAspectRatio,
            zOffset: 1.0
        });

        let eye = new Point3D(0, 0, 10.0);

        return new PerspectiveCamera(eye, cameraWindow);
    }
}