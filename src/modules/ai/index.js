import { getWebcam } from "./util";
import * as faceapi from "face-api.js";

export class Face {
  constructor() {
    this.init();
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
    this.canvas.style.border = "1px solid black";
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

    faceapi.draw.drawDetections(this.canvas, resizedDetections);
    faceapi.draw.drawFaceLandmarks(this.canvas, resizedDetections);
    faceapi.draw.drawFaceExpressions(this.canvas, resizedDetections);
  }
}
