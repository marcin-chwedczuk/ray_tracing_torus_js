
export default class Vec3D {
  constructor(x,y,z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  length() {
    let squaredLength = (this.x*this.x + this.y*this.y + this.z*this.z);
    return Math.sqrt(squaredLength);
  }

  norm() {
    let length = this.length();
    return new Vec3D(
      this.x / length,
      this.y / length,
      this.z / length);
  }

  scale(scalar) {
    return new Vec3D(
      this.x*scalar,
      this.y*scalar,
      this.z*scalar);
  }

  toString() {
    return `vec(${this.x}, ${this.y}, ${this.z})`;
  }
}

