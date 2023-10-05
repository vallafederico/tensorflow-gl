import { getWebcam } from "./util";
import * as faceapi from "face-api.js";

export class Face {
  constructor() {
    this.init();

    this.xdirection = 0;
    this.emo = {
      happy: 0,
      sur: 0,
    };
  }

  async init() {
    this.video = await getWebcam();
    this.video.play();
    await this.load();
    this.create();

    this.ready = true;
  }

  async load() {
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
      faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
      faceapi.nets.faceExpressionNet.loadFromUri("/models"),
    ]);
  }

  create() {
    this.canvas = faceapi.createCanvas(this.video);
    this.canvas.style.position = "absolute";
    this.canvas.style.left = 0;
    document.body.append(this.canvas);

    this.displaySize = {
      width: this.video.clientWidth,
      height: this.video.clientHeight,
    };

    this.shouldPrint = false;
    document.onclick = () => (this.shouldPrint = true);

    faceapi.matchDimensions(this.canvas, this.displaySize);

    setInterval(async () => await this.interval(), 100);
  }

  resize() {
    if (!this.ready) return;
    faceapi.matchDimensions(this.canvas, this.displaySize);
  }

  async interval() {
    const detections = await faceapi
      .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();

    if (!detections) return;

    if (this.shouldPrint) {
      console.log(detections);

      this.shouldPrint = false;
    }

    this.directionController(detections.landmarks._positions);

    this.emo.happy = detections.expressions.happy;
    this.emo.sur = detections.expressions.surprised;

    const resizedDetections = faceapi.resizeResults(
      detections,
      this.displaySize
    );

    this.draw(resizedDetections);
  }

  draw(resizedDetections) {
    this.canvas
      .getContext("2d")
      .clearRect(0, 0, this.canvas.width, this.canvas.height);

    faceapi.draw.drawFaceLandmarks(this.canvas, resizedDetections);
    // faceapi.draw.drawDetections(this.canvas, resizedDetections);
    faceapi.draw.drawFaceExpressions(this.canvas, resizedDetections);
  }

  directionController(arr) {
    //1 : LEFT — 28: NOSE CENTER — 17: RIGHT
    // ballpark -200 / 200

    const left = arr[0]._x;
    const right = arr[16]._x;
    const nose = arr[27]._x;

    this.xdirection = Math.abs(left - nose) - Math.abs(nose - right);
    // console.log(this.xdirection);
  }
}
