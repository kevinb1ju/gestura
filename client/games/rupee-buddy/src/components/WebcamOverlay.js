import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

const OverlayContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 240px;
  height: 180px;
  border-radius: 15px;
  overflow: hidden;
  border: 4px solid #ff9933;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  z-index: 1000;
  background: black;
`;

const MirroredVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scaleX(-1);
`;

const LandmarkCanvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: scaleX(-1);
`;

const WebcamOverlay = ({ videoRef, landmarks }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!canvasRef.current || !landmarks) return;

        const ctx = canvasRef.current.getContext('2d');
        const { width, height } = canvasRef.current;

        ctx.clearRect(0, 0, width, height);

        // Draw landmarks
        ctx.fillStyle = "#138808"; // Indian Green
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;

        landmarks.forEach((landmark) => {
            const x = landmark.x * width;
            const y = landmark.y * height;

            ctx.beginPath();
            ctx.arc(x, y, 3, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();
        });

        // Draw connections (simplified for game feel)
        const connections = [
            [0, 1, 2, 3, 4], // thumb
            [0, 5, 6, 7, 8], // index
            [0, 9, 10, 11, 12], // middle
            [0, 13, 14, 15, 16], // ring
            [0, 17, 18, 19, 20], // pinky
            [5, 9, 13, 17] // palm
        ];

        ctx.strokeStyle = "#138808"; // Indian Green
        ctx.lineWidth = 2;
        connections.forEach(chain => {
            ctx.beginPath();
            ctx.moveTo(landmarks[chain[0]].x * width, landmarks[chain[0]].y * height);
            for (let i = 1; i < chain.length; i++) {
                ctx.lineTo(landmarks[chain[i]].x * width, landmarks[chain[i]].y * height);
            }
            ctx.stroke();
        });

    }, [landmarks]);

    return (
        <OverlayContainer>
            <MirroredVideo
                ref={videoRef}
                autoPlay
                playsInline
                muted
            />
            <LandmarkCanvas
                ref={canvasRef}
                width={640}
                height={480}
            />
        </OverlayContainer>
    );
};

export default WebcamOverlay;
