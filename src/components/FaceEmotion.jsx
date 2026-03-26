import React, { useRef, useEffect ,useState } from "react";
import * as faceapi from "face-api.js";

const FaceEmotion = () => {
  const videoRef = useRef();
const [emotion, setEmotion] = useState("");
  // Load models
  const loadModels = async () => {
    const MODEL_URL = "/models";
    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
    await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
    startVideo();
  };

  // Start camera
  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        videoRef.current.srcObject = stream;
      })
      .catch(err => console.error(err));
  };

  // Detect emotions
  const detectFaces = () => {
    setInterval(async () => {
      if (videoRef.current) {
        const detections = await faceapi
          .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
          .withFaceExpressions();

        if (detections.length > 0) {
          const emotions = detections[0].expressions;
          const maxEmotion = Object.keys(emotions).reduce((a, b) =>
            emotions[a] > emotions[b] ? a : b
          );

          console.log("Emotion:", maxEmotion);
          setEmotion(maxEmotion);
        }
      }
    }, 1000);
  };

  useEffect(() => {
    loadModels();
  }, []);

  return (
    <div>
      <h2>Face Emotion Detection</h2>
      <video
        ref={videoRef}
        autoPlay
        muted
        width="400"
        height="300"
        onPlay={detectFaces}
      />
       <h3>Emotion: {emotion}</h3>
    </div>
    
  );
};

export default FaceEmotion;