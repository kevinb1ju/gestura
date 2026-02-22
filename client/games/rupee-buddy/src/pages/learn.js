import { useEffect, useRef, useState } from "react";
import { Hands } from "@mediapipe/hands";
import styled, { keyframes } from "styled-components";
import WebcamOverlay from "../components/WebcamOverlay";

/* ================= ANIMATIONS ================= */

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

/* ================= STYLES ================= */

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #ff9933 0%, #ffffff 50%, #138808 100%);
  padding: 40px 20px;
  text-align: center;
  position: relative;
  overflow: hidden;
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: clamp(2rem, 5vw, 3rem);
  color: #ff6600;
  margin-bottom: 40px;
  font-weight: 900;
  animation: ${fadeIn} 0.6s ease-out;
`;

const MainContent = styled.div`
  display: flex;
  justify-content: center;
  gap: 40px;
  flex-wrap: wrap;
`;

const StyledVideo = styled.video`
  position: absolute;
  opacity: 0;
  pointer-events: none;
  width: 1px;
  height: 1px;
`;

const CurrencyCard = styled.div`
  background: white;
  border-radius: 25px;
  padding: 30px;
  box-shadow: 0 15px 40px rgba(0,0,0,0.2);
  border: 5px solid #ff9933;
  max-width: 380px;
`;

const CurrencyImage = styled.img`
  width: 100%;
  max-width: 300px;
  border-radius: 15px;
  border: 3px solid #138808;
  animation: ${pulse} 2s infinite;
`;

const CurrencyValue = styled.h2`
  font-size: 3rem;
  color: #ff6600;
  margin: 15px 0 10px;
  font-weight: 900;
`;

const CurrencyName = styled.p`
  font-size: 1.3rem;
  color: #2d5016;
  font-weight: 700;
`;

const GestureDisplay = styled.div`
  margin-top: 30px;
  background: linear-gradient(135deg, #138808, #0d5c06);
  color: white;
  padding: 18px 40px;
  border-radius: 50px;
  font-size: 1.3rem;
  font-weight: 700;
  display: inline-block;
  animation: ${float} 2s ease-in-out infinite;
`;

const InstructionBox = styled.div`
  margin-top: 25px;
  background: rgba(255, 255, 255, 0.95);
  border: 3px solid #ff9933;
  border-radius: 20px;
  padding: 20px 30px;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
  font-size: 1.1rem;
  color: #2d5016;
  font-weight: 600;
  line-height: 1.6;
`;

/* ================= COMPONENT ================= */

function Learn() {
  const videoRef = useRef(null);
  const handsRef = useRef(null);
  const cameraRef = useRef(null);

  const lastGestureRef = useRef(null);
  const lastGestureTimeRef = useRef(0);
  const indexRef = useRef(0);
  const isSpeakingRef = useRef(false);
  const femaleVoiceRef = useRef(null);

  const [gesture, setGesture] = useState("Waiting for hand...");
  const [index, setIndex] = useState(0);
  const [halo, setHalo] = useState({ x: 0, y: 0, visible: false });
  const [landmarks, setLandmarks] = useState(null);

  const currencies = [
    { name: "One Rupee Coin", value: "₹1", audio: "One rupee coin", image: "/1.png" },
    { name: "Two Rupee Coin", value: "₹2", audio: "Two rupee coin", image: "/2.png" },
    { name: "Five Rupee Coin", value: "₹5", audio: "Five rupee coin", image: "/5.png" },
    { name: "Ten Rupee Coin", value: "₹10", audio: "Ten rupee coin", image: "/10c.png" },
    { name: "Twenty Rupee Coin", value: "₹20", audio: "Twenty rupee coin", image: "/20c.png" },
    { name: "Ten Rupee Note", value: "₹10", audio: "Ten rupee note", image: "/10.png" },
    { name: "Twenty Rupee Note", value: "₹20", audio: "Twenty rupee note", image: "/20.png" },
    { name: "Fifty Rupee Note", value: "₹50", audio: "Fifty rupee note", image: "/50.png" },
    { name: "One Hundred Rupee Note", value: "₹100", audio: "One hundred rupee note", image: "/100.png" },
    { name: "Two Hundred Rupee Note", value: "₹200", audio: "Two hundred rupee note", image: "/200.jpg" },
    { name: "Five Hundred Rupee Note", value: "₹500", audio: "Five hundred rupee note", image: "/500.jpg" },
  ];

  const speak = (text) => {
    if (isSpeakingRef.current) return;
    isSpeakingRef.current = true;

    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.8;
    utter.pitch = 1.1;
    if (femaleVoiceRef.current) utter.voice = femaleVoiceRef.current;

    utter.onend = utter.onerror = () => {
      isSpeakingRef.current = false;
    };

    window.speechSynthesis.speak(utter);
  };

  /* ================= MEDIAPIPE ================= */

  useEffect(() => {
    let stream;
    let rafId;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: 640,
            height: 480,
          },
        });

        videoRef.current.srcObject = stream;
        await videoRef.current.play();

        const hands = new Hands({
          locateFile: (file) =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
        });

        hands.setOptions({
          maxNumHands: 1,
          modelComplexity: 0,
          minDetectionConfidence: 0.7,
          minTrackingConfidence: 0.7,
        });

        hands.onResults((results) => {
          if (!results.multiHandLandmarks?.length) {
            setGesture("No hand");
            setHalo((h) => ({ ...h, visible: false }));
            setLandmarks(null);
            return;
          }

          const now = Date.now();
          const lm = results.multiHandLandmarks[0];
          setLandmarks(lm);

          const tip = lm[8];
          setHalo({
            x: (1 - tip.x) * window.innerWidth,
            y: tip.y * window.innerHeight,
            visible: true,
          });

          const tips = [8, 12, 16, 20];
          const bases = [6, 10, 14, 18];

          let open = 0;
          for (let i = 0; i < tips.length; i++) {
            if (lm[tips[i]].y < lm[bases[i]].y) open++;
          }

          let g = null;
          if (open >= 4) g = "NEXT";
          else if (open === 0) g = "REPEAT";

          if (
            g &&
            (g !== lastGestureRef.current ||
              now - lastGestureTimeRef.current > 1500)
          ) {
            lastGestureRef.current = g;
            lastGestureTimeRef.current = now;

            if (g === "NEXT") {
              setGesture("✋ OPEN PALM → NEXT");
              setIndex((p) => {
                const n = (p + 1) % currencies.length;
                indexRef.current = n;
                speak(currencies[n].audio);
                return n;
              });
            }

            if (g === "REPEAT") {
              setGesture("✊ FIST → REPEAT");
              speak(currencies[indexRef.current].audio);
            }
          }
        });

        const processFrame = async () => {
          if (videoRef.current?.readyState === 4) {
            await hands.send({ image: videoRef.current });
          }
          rafId = requestAnimationFrame(processFrame);
        };

        processFrame();

        handsRef.current = hands;
      } catch (err) {
        console.error("Camera error:", err);
        setGesture("Camera error");
      }
    };

    startCamera();

    return () => {
      cancelAnimationFrame(rafId);
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
      if (handsRef.current) handsRef.current.close();
    };
  }, []);

  /* ================= UI ================= */

  return (
    <Container>
      <ContentWrapper>
        <Title>🇮🇳 Learn Indian Currency</Title>

        <MainContent>
          <WebcamOverlay videoRef={videoRef} landmarks={landmarks} />
          <CurrencyCard>
            <CurrencyImage src={currencies[index].image} />
            <CurrencyValue>{currencies[index].value}</CurrencyValue>
            <CurrencyName>{currencies[index].name}</CurrencyName>
          </CurrencyCard>
        </MainContent>

        <GestureDisplay>{gesture}</GestureDisplay>
        <InstructionBox>
          ✋ <strong>Open Palm</strong> → Go to the next currency <br />
          ✊ <strong>Fist</strong> → Repeat the current currency
        </InstructionBox>
      </ContentWrapper>

      {halo.visible && (
        <div
          style={{
            position: "fixed",
            left: halo.x,
            top: halo.y,
            width: 70,
            height: 70,
            borderRadius: "50%",
            background: "rgba(19,136,8,0.15)",
            boxShadow: "0 0 35px rgba(19,136,8,0.6)",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
            zIndex: 9999,
          }}
        />
      )}
    </Container>
  );
}

export default Learn;
