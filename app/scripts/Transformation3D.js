
import Matrix4, { MATRIX4_IDENTITY } from "Matrix4";
import Ray from "Ray";

export default class Transformation3D {
    constructor() {
        this._matrix = MATRIX4_IDENTITY;
        this._invMatrix = MATRIX4_IDENTITY;
    }

    translate(dx,dy,dz) {
        this._matrix = Matrix4.translate(dx,dy,dz).times( this._matrix );
        this._invMatrix = this._invMatrix.times( Matrix4.translateInverse(dx,dy,dz) );

        return this;
    }

    rotateX(angleDeg) {
        this._matrix = Matrix4.rotateX(angleDeg).times( this._matrix );
        this._invMatrix = this._invMatrix.times( Matrix4.rotateXInverse(angleDeg) );
    
        return this;
    }

    rotateY(angleDeg) {
        this._matrix = Matrix4.rotateY(angleDeg).times( this._matrix );
        this._invMatrix = this._invMatrix.times( Matrix4.rotateYInverse(angleDeg) );

        return this;
    }

    rotateZ(angleDeg) {
        this._matrix = Matrix4.rotateZ(angleDeg).times( this._matrix );
        this._invMatrix = this._invMatrix.times( Matrix4.rotateZInverse(angleDeg) );

        return this;
    }

    transformRay(ray) {
        let tfOrigin = this._invMatrix.transformPoint(ray.origin);
        let tfDirection = this._invMatrix.transformVector(ray.direction);
        
        return new Ray(tfOrigin, tfDirection);
    }

    transformNormal(n) {
        return this._invMatrix.transformNormal(n);
    }
}