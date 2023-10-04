export function getWebcam(id = "#video") {
  return new Promise((resolve) => {
    const video = document.querySelector(id);
    // console.log(video);

    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(function (stream) {
          video.srcObject = stream;
          video.onloadedmetadata = () => resolve(video);
        })
        .catch(function (error) {
          console.log("Something went wrong!", error);
        });
    }
  });
}
