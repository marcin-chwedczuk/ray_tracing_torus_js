
import Ray from 'Ray';
import Torus from 'Torus';
import Vec3D from 'Vec3D';
import Point3D from 'Point3D';
import Color from 'Color';
import DirectionalLight from 'DirectionalLight';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 640;
const PIXEL_SIZE = 2;

const VIEWPORT_PIXEL_WIDTH = CANVAS_WIDTH / PIXEL_SIZE;
const VIEWPORT_PIXEL_HEIGHT = CANVAS_HEIGHT / PIXEL_SIZE;

console.log(`VIEWPORT SIZE: ${VIEWPORT_PIXEL_WIDTH}x${VIEWPORT_PIXEL_HEIGHT}`);

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById('canvas') ||
                  blowUp('cannot find "canvas" element');
  const ctx = canvas.getContext('2d');

  console.log('canvas setup finished...');

  document.getElementById("renderButton").addEventListener("click", () => {
    let torus = new Torus(1.0, 0.2);

    /*torus.transformation.
      rotateZ(30).
      rotateY(10);*/

    let light = new DirectionalLight(new Vec3D(0,0,-1), Color.white());

    let viewportWidth = 5.0;
    let viewportHeight = viewportWidth * (VIEWPORT_PIXEL_HEIGHT / VIEWPORT_PIXEL_WIDTH);

    for (let row = 0; row < VIEWPORT_PIXEL_HEIGHT; row++) {
      for (let col = 0; col < VIEWPORT_PIXEL_WIDTH; col++) {
        let direction = new Vec3D(0,0,-1);
        let origin = new Point3D(
          viewportWidth * (((0.5 + col) / VIEWPORT_PIXEL_WIDTH - 0.5)),
          viewportHeight * (((0.5 + row) / VIEWPORT_PIXEL_HEIGHT) - 0.5),
          10.0);

        let ray = new Ray(origin, direction.norm());
        let hit = torus.hit(ray);

        if (hit === null) {
          putPixel(row, col, 0,0,0);
        }
        else {
          let color = light.lightPoint(hit.hitPoint, hit.normal, ray);
          putPixel(row, col, color.r, color.g, color.b);
        }
      }
    }
  });

  function putPixel(row, col, r, g, b) {
    ctx.save();
    ctx.fillStyle = `rgb(${colorByte(r)},${colorByte(g)},${colorByte(b)})`;
    ctx.fillRect(col*PIXEL_SIZE, row*PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
    ctx.restore();

    function colorByte(v) {
      return Math.floor(v*255.0)
    }
  }

  function blowUp(message) {
    throw new Error('fatal: ' + message);
  }
});
