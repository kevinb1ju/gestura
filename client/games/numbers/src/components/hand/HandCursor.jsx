import { useEffect, useRef } from "react";
import { Hands } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";

export default function HandCursor() {
  const videoRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    const hands = new Hands({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7,
    });

    hands.onResults((results) => {
      if (
        results.multiHandLandmarks &&
        results.multiHandLandmarks.length > 0
      ) {
        const landmark = results.multiHandLandmarks[0][8]; // index fingertip

        const x = (1 - landmark.x) * window.innerWidth;
        const y = landmark.y * window.innerHeight;

        // global cursor for Level1 hover logic
        window.handCursor = { x, y };

        // move red dot
        if (dotRef.current) {
          dotRef.current.style.transform = `translate(${x}px, ${y}px)`;
        }
      }
    });

    let camera;
    if (videoRef.current) {
      camera = new Camera(videoRef.current, {
        onFrame: async () => {
          await hands.send({ image: videoRef.current });
        },
        width: 640,
        height: 480,
      });
      camera.start();
    }

    return () => {
      if (camera) camera.stop();
    };
  }, []);

  return (
    <>
      {/* Webcam preview */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{
          position: "fixed",
          right: 10,
          bottom: 10,
          width: 160,
          borderRadius: "12px",
          zIndex: 1000,
        }}
      />

      {/* Hand cursor dot */}
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          width: 16,
          height: 16,
          background: "red",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 9999,
          transform: "translate(-100px, -100px)",
        }}
      />
    </>
  );
}
