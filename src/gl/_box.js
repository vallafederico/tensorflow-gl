import { Box, Mesh } from "ogl";
import Material from "./mat/_quad";

export class Cube extends Mesh {
  constructor(gl, diff = null) {
    super(gl, {
      geometry: new Box(gl),
      program: new Material(gl),
    });
    this.gl = gl;
  }

  resize() {}

  render(t) {
    this.program.time = t;

    this.rotation.x = t * 0.01;
    // this.rotation.y = t * 0.01;
    this.rotation.z = t * 0.01;
  }
}
