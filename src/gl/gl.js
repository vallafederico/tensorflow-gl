import { Renderer, Orbit, Vec3 } from "ogl";
import Cam from "./_camera.js";
import Scene from "./_scene.js";

export function lerp(v0, v1, t) {
  return v0 * (1 - t) + v1 * t;
}

export default class {
  constructor() {
    this.wrapper = document.querySelector("[data-gl='c']");
    this.vp = {
      dpr: Math.min(window.devicePixelRatio, 2),
    };

    this.renderer = new Renderer({ dpr: 2, alpha: true });
    this.gl = this.renderer.gl;
    this.gl.clearColor(0, 0, 0, 0);

    this.wrapper.appendChild(this.gl.canvas);

    this.camera = new Cam(this.gl, {});
    this.camera.position.set(0, 0, 5);

    this.scene = new Scene(this.gl);
    this.time = 0;

    this.initEvents();

    this.render();

    this.face = {
      xcur: 0,
      xtar: 0,
    };

    // this.controls = new Orbit(this.camera, {
    //   target: new Vec3(0, 0, 0),
    // });
  }

  render(scroll = 0) {
    this.time += 0.5;

    this.controls?.update();
    this.scene?.render(this.time);

    window.requestAnimationFrame(this.render.bind(this));

    this.renderer.render({
      scene: this.scene,
      camera: this.camera,
    });

    if (window.app) {
      this.face.xtar = window.app.face?.xdirection * 0.02;
      this.face.xcur = lerp(this.face.xcur, this.face.xtar, 0.05);
      // console.log(this.face.xcur);

      this.camera.rotation.y = -this.face.xcur * 0.1;
    }
  }

  initEvents() {
    // resize
    new ResizeObserver((entry) => this.resize(entry[0].contentRect)).observe(
      this.wrapper
    );
    // mouse
    this.mouse = { x: 0, y: 0 };
  }

  resize(entry) {
    const cw = entry ? entry.width : this.wrapper.clientWidth;
    const ch = entry ? entry.height : this.wrapper.clientHeight;

    this.vp.w = cw;
    this.vp.h = ch;
    this.vp.ratio = cw / ch;
    this.vp.viewSize = this.camera.getViewSize(this.vp.ratio);
    this.vp.viewRatio = this.vp.viewSize.w / this.vp.w;
    // this.vp.scrollx = window.scrollX;
    // this.vp.scrolly = window.scrollY;

    this.renderer.setSize(this.vp.w, this.vp.h);
    this.camera.perspective({
      aspect: this.vp.ratio,
    });

    this.scene.resize(this.vp);
    // this.resizeChild();
  }
}
