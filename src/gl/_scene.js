import { Transform } from "ogl";

import Quad from "./_quad.js";
import { Cube } from "./_box.js";
import { Model } from "./_model.js";

function lerp(v0, v1, t) {
  return v0 * (1 - t) + v1 * t;
}

export default class extends Transform {
  constructor(gl, data = {}) {
    super();
    this.gl = gl;
    this.isOn = true;

    this.create();
  }

  create() {
    /* Basic Quad */
    // this.quad = new Quad(this.gl);
    this.cube = new Cube(this.gl);
    this.cube.scale.set(0.2, 0.2, 0.2);
    this.cube.position.z = 2;
    this.cube.setParent(this);

    this.model = new Model(this.gl);
    this.model.setParent(this);
  }

  render(t) {
    if (!this.isOn) return;
    if (this.cube) this.cube.render(t);
    if (this.model) this.model.render(t);

    if (window.app) {
      this.happy = lerp(this.happy || 0, window.app.face.emo.happy, 0.1);
      this.sur = lerp(this.sur || 0, window.app.face.emo.sur, 0.1);

      this.cube.program.uniforms.u_a_happy.value = this.happy;
      this.model.program.uniforms.u_a_happy.value = this.happy;

      this.position.z = this.happy - this.sur * 2;
      this.cube.position.z = 2 + this.happy + this.sur * 4;
    }
    // if (this.quads) this.quads.forEach((item) => item.render(t));
  }

  resize(vp) {
    this.vp = vp;
    if (this.quad) this.quad.resize(vp);
  }
}
