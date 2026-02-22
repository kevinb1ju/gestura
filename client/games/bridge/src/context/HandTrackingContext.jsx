
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';

const HandTrackingContext = createContext(null);

export const useHandTracking = () => useContext(HandTrackingContext);

export const HandTrackingProvider = ({ children }) => {
    const webcamRef = useRef(null);
    const [handLandmarker, setHandLandmarker] = useState(null);
    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
    const [isHandDetected, setIsHandDetected] = useState(false);
    const [error, setError] = useState(null);

    // Initialize Mediapipe HandLandmarker
    useEffect(() => {
        const createHandLandmarker = async () => {
            try {
                const vision = await FilesetResolver.forVisionTasks(
                    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
                );

                const landmarker = await HandLandmarker.createFromOptions(vision, {
                    baseOptions: {
                        modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
                        delegate: "GPU"
                    },
                    runningMode: "VIDEO",
                    numHands: 1
                });

                setHandLandmarker(landmarker);
                console.log("HandLandmarker initialized successfully");
            } catch (err) {
                console.error("Failed to initialize HandLandmarker:", err);
                setError("Camera/AI Model failed to load. Please allow camera access and check internet.");
            }
        };

        createHandLandmarker();
    }, []);

    // Process video frames
    useEffect(() => {
        let animationFrameId;

        const predictWebcam = () => {
            if (
                handLandmarker &&
                webcamRef.current &&
                webcamRef.current.video &&
                webcamRef.current.video.readyState === 4
            ) {
                const video = webcamRef.current.video;
                const startTimeMs = performance.now();
                const results = handLandmarker.detectForVideo(video, startTimeMs);

                if (results.landmarks && results.landmarks.length > 0) {
                    setIsHandDetected(true);
                    // Get Index Finger Tip (Landmark 8)
                    const indexTip = results.landmarks[0][8];

                    // Mirror x coordinate because webcam is mirrored
                    const x = (1 - indexTip.x) * window.innerWidth;
                    const y = indexTip.y * window.innerHeight;

                    setCursorPosition({ x, y });
                } else {
                    setIsHandDetected(false);
                }
            }
            animationFrameId = requestAnimationFrame(predictWebcam);
        };

        if (handLandmarker) {
            predictWebcam();
        }

        return () => cancelAnimationFrame(animationFrameId);
    }, [handLandmarker]);

    return (
        <HandTrackingContext.Provider value={{ cursorPosition, isHandDetected }}>
            {/* Webcam Preview */}
            <div className="absolute top-4 right-4 z-[100] w-32 h-24 rounded-xl overflow-hidden shadow-lg border-2 border-white/50 opacity-80 hover:opacity-100 transition-opacity bg-black">
                <Webcam
                    ref={webcamRef}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} // Mirror the webcam preview
                    audio={false}
                    onUserMediaError={(err) => setError("Camera access denied")}
                />
            </div>

            {/* Error Message */}
            {error && (
                <div className="absolute top-20 right-4 z-[100] bg-red-500 text-white p-2 rounded text-xs max-w-[200px]">
                    {error}
                </div>
            )}

            {/* Custom Cursor Overlay */}
            {isHandDetected && (
                <div
                    className="fixed w-8 h-8 pointer-events-none z-[9999] transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 ease-out"
                    style={{ left: cursorPosition.x, top: cursorPosition.y }}
                >
                    <div className="w-full h-full bg-yellow-400 rounded-full border-4 border-white shadow-xl animate-pulse"></div>
                    <div className="absolute -top-12 -left-12 w-32 h-32 bg-yellow-400/20 rounded-full blur-xl animate-ping"></div>
                </div>
            )}

            {children}
        </HandTrackingContext.Provider>
    );
};
