
import solve4 from 'solver';
import Ray from 'Ray';
import Torus from 'Torus';
import Vec3D from 'Vec3D';
import Point3D from 'Point3D';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 640;
const PIXEL_SIZE = 4;

const VIEWPORT_PIXEL_WIDTH = CANVAS_WIDTH / PIXEL_SIZE;
const VIEWPORT_PIXEL_HEIGHT = CANVAS_HEIGHT / PIXEL_SIZE;

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById('canvas') ||
                  blowUp('cannot find "canvas" element');
  const ctx = canvas.getContext('2d');

  console.log('canvas setup finished...');

  document.getElementById("renderButton").addEventListener("click", () => {
    let torus = new Torus(1.0, 0.2);

    let viewportWidth = 2.0;
    let viewportHeight = 2.0;

    for (var row = 0; row < VIEWPORT_PIXEL_HEIGHT; row++) {
      for (var col = 0; col < VIEWPORT_PIXEL_WIDTH; col++) {
        let direction = new Vec3D(0,-1,0);
        let origin = new Point3D(
          viewportWidth * ((0.5 + col) / VIEWPORT_PIXEL_WIDTH - 0.5),
          10.0,
          viewportHeight * ((0.5 + row) / VIEWPORT_PIXEL_HEIGHT) - 0.5);

        let ray = new Ray(origin, direction);
        let hit = torus.hit(ray);

        if (hit === null) {
          putPixel(row, col, 0,0,0);
        }
        else {
          putPixel(row, col, 1,1,1);
        }
      }
    }
  });

  function putPixel(row, col, r, g, b) {
    ctx.save();
    ctx.fillStyle = `rgb(${colorByte(r)},${colorByte(g)},${colorByte(b)})`;
    ctx.fillRect(row*PIXEL_SIZE, col*PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
    ctx.restore();

    function colorByte(v) {
      return Math.floor(v*255.0)
    }
  }

  function blowUp(message) {
    throw new Error('fatal: ' + message);
  }
});
