import { Mesh, Transform } from "ogl";
import Material from "./mat/_model";

import { loadModel } from "./util/model-loader";

export class Model extends Transform {
  constructor(gl) {
    super(gl);
    this.gl = gl;

    // this.geometry = geometry;
    this.program = new Material(this.gl);

    this.scale.set(0.3, 0.3, 0.3);
    this.position.y = -0.8;

    // this.mesh.position.x = 1;
    this.load();
  }

  async load() {
    this.model = await loadModel(this.gl, "/lobby.glb");

    this.model = this.model.scene[0];
    console.log();

    this.model.children[0].children.forEach((item) => {
      item.program = this.program;
    });
    // console.log(this.model);

    this.model.setParent(this);
  }

  resize() {}

  render(t) {
    this.program.time = t;
  }
}
