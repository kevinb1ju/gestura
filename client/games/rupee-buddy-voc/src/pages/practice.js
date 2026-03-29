import { useEffect, useRef, useState } from "react";
import { Hands } from "@mediapipe/hands";
import styled, { keyframes } from 'styled-components';

/* ---------------- UI ---------------- */

const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(10deg); }
`;

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #ff9933, #ffffff, #138808);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const Title = styled.h1`
  font-size: 3rem;
  color: #ff6600;
  font-weight: 900;
  margin-bottom: 20px;
`;

const NotesRow = styled.div`
  display: flex;
  gap: 30px;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 40px;
`;

const NoteCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 12px;
  border: 6px solid ${p => (p.active ? "#138808" : "#ff9933")};
  transform: ${p => (p.active ? "scale(1.1)" : "scale(1)")};
  box-shadow: ${p =>
    p.active
      ? "0 0 30px rgba(19,136,8,0.8)"
      : "0 12px 25px rgba(0,0,0,0.25)"};
  transition: all 0.25s ease;
`;

const NoteImage = styled.img`
  width: 260px;
  height: auto;
  border-radius: 12px;
`;

const Stars = styled.div`
  margin-top: 30px;
  font-size: 2.2rem;
`;

const CoinDecoration = styled.div`
  position: absolute;
  font-size: 70px;
  color: rgba(255, 153, 51, 0.3);
  animation: ${float} 6s ease-in-out infinite;
  pointer-events: none;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  
  &.coin-1 { top: 8%; left: 8%; animation-delay: 0s; }
  &.coin-2 { top: 15%; right: 12%; animation-delay: 2s; }
  &.coin-3 { bottom: 12%; left: 10%; animation-delay: 4s; }
  &.coin-4 { bottom: 20%; right: 15%; animation-delay: 3s; }
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

/* ---------------- DATA ---------------- */

const currencies = [
  { value: 1, label: "1", image: "/1.png" },
  { value: 2, label: "2", image: "/2.png" },
  { value: 5, label: "5", image: "/5.png" },
  { value: "10_coin", label: "10", image: "/10c.png" },
  { value: "20_coin", label: "20", image: "/20c.png" },
  { value: "10_note", label: "10", image: "/10.png" },
  { value: "20_note", label: "20", image: "/20.png" },
  { value: 50, label: "50", image: "/50.png" },
  { value: 100, label: "100", image: "/100.png" },
  { value: 200, label: "200", image: "/200.jpg" },
  { value: 500, label: "500", image: "/500.jpg" }
];

/* ---------------- COMPONENT ---------------- */

export default function Practice() {
  const videoRef = useRef(null); // hidden camera
  const optionRefs = useRef([]);
  const hoverIndexRef = useRef(null);
  const lockedRef = useRef(false);
  const [halo, setHalo] = useState({ x: 0, y: 0, visible: false });

  const handsRef = useRef(null);
  const cameraRef = useRef(null);

  const [highlighted, setHighlighted] = useState(null);
  const [stars, setStars] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(generateQuestion());
  const [voice, setVoice] = useState(null);
  const questionRef = useRef(currentQuestion);

  useEffect(() => {
    questionRef.current = currentQuestion;
  }, [currentQuestion]);


  /* ---------------- VOICE ---------------- */

  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      const female =
        voices.find(v =>
          v.name.toLowerCase().includes("google") &&
          v.name.toLowerCase().includes("female")
        ) ||
        voices.find(v =>
          v.lang.startsWith("en") &&
          v.name.toLowerCase().includes("female")
        ) ||
        voices.find(v => v.lang.startsWith("en"));

      setVoice(female || null);
    };

    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const speak = (text, onEnd) => {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.voice = voice;
    u.rate = 0.85;
    u.pitch = 1.1;

    if (onEnd) {
      u.onend = onEnd;
    }

    speechSynthesis.speak(u);
  };

  useEffect(() => {
    if (voice && currentQuestion) {
      speak(currentQuestion.questionText);
    }
  }, [currentQuestion, voice]);

  useEffect(() => {
    if (voice && currentQuestion) {
      speak(currentQuestion.questionText);
    }
  }, [voice]);

  /* ---------------- HAND TRACKING ---------------- */

  useEffect(() => {
    let stream;
    let rafId;
    let isProcessing = false;

    const startHands = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 },
        });

        videoRef.current.srcObject = stream;
        await videoRef.current.play();

        const hands = new Hands({
          locateFile: f =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f.replace("_simd", "")}`,
        });

        hands.setOptions({
          maxNumHands: 1,
          modelComplexity: 0,
          minDetectionConfidence: 0.7,
          minTrackingConfidence: 0.7,
        });

        hands.onResults(res => {
          if (!res.multiHandLandmarks?.length || lockedRef.current) {
            setHalo(h => ({ ...h, visible: false }));
            setHighlighted(null);
            hoverIndexRef.current = null;
            return;
          }

          const lm = res.multiHandLandmarks[0];

          const tips = [8, 12, 16, 20];
          const bases = [6, 10, 14, 18];
          const fingersUp = tips.map((t, i) => lm[t].y < lm[bases[i]].y);
          const fist = fingersUp.every(v => !v);

          const tip = lm[8];

          // mirror fix
          const x = (1 - tip.x) * window.innerWidth;
          const y = tip.y * window.innerHeight;

          setHalo({ x, y, visible: true });

          let hovered = null;
          optionRefs.current.forEach((el, i) => {
            if (!el) return;
            const r = el.getBoundingClientRect();
            if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) {
              hovered = i;
            }
          });

          if (hovered !== null) {
            setHighlighted(hovered);
            hoverIndexRef.current = hovered;
          }

          if (fist && hoverIndexRef.current !== null) {
            lockedRef.current = true;
            const chosen = hoverIndexRef.current;
            hoverIndexRef.current = null;

            const currentQ = questionRef.current;
            const chosenOption = currentQ.options[chosen];

            if (chosenOption.value === currentQ.correctAnswer) {
              setStars(s => s + 1);
              speak("Correct, well done!", () => {
                setCurrentQuestion(generateQuestion());
                setHighlighted(null);
                lockedRef.current = false;
              });
            } else {
              speak("That is not correct. Try again.");
              setHighlighted(null);
              lockedRef.current = false;
            }
          }
        });

        const loop = async () => {
          if (
            videoRef.current?.readyState === 4 &&
            !isProcessing
          ) {
            isProcessing = true;
            await hands.send({ image: videoRef.current });
            isProcessing = false;
          }

          rafId = requestAnimationFrame(loop);
        };

        loop();
        handsRef.current = hands;
      } catch (err) {
        console.error("Camera error:", err);
      }
    };

    startHands();

    return () => {
      cancelAnimationFrame(rafId);
      if (stream) stream.getTracks().forEach(t => t.stop());
      handsRef.current?.close();
    };
  }, []);

  function generateQuestion() {
    const correctCurrency =
      currencies[Math.floor(Math.random() * currencies.length)];

    // create 2 wrong options
    const wrongOptions = currencies
      .filter(c => c.value !== correctCurrency.value)
      .sort(() => 0.5 - Math.random())
      .slice(0, 2);

    const options = [...wrongOptions, correctCurrency]
      .sort(() => 0.5 - Math.random());

    return {
      questionText: `Show me ₹${correctCurrency.label}`,
      correctAnswer: correctCurrency.value,
      options
    };
  }

  /* ---------------- UI ---------------- */

  return (
    <Container>
      {/* Hidden camera */}
      <video ref={videoRef} style={{ display: "none" }} autoPlay playsInline />

      <CoinDecoration className="coin-1">₹</CoinDecoration>
      <CoinDecoration className="coin-2">₹</CoinDecoration>
      <CoinDecoration className="coin-3">₹</CoinDecoration>
      <CoinDecoration className="coin-4">₹</CoinDecoration>

      <Title>Find the Currency</Title>

      <NotesRow>
        {currentQuestion.options.map((option, i) => (
          <NoteCard
            key={i}
            ref={el => (optionRefs.current[i] = el)}
            active={highlighted === i}
          >
            <NoteImage src={option.image} alt={option.label} />
          </NoteCard>
        ))}
      </NotesRow>
      {halo.visible && (
        <div
          style={{
            position: "fixed",
            left: halo.x,
            top: halo.y,
            width: 60,
            height: 60,
            borderRadius: "50%",
            background: "rgba(19,136,8,0.15)",
            boxShadow: "0 0 30px rgba(19,136,8,0.6)",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
            zIndex: 9999,
          }}
        />
      )}
      <InstructionBox>
        ✋ <strong>Open Palm</strong> → Hover over the options <br />
        ✊ <strong>Fist</strong> → Choose the answer
      </InstructionBox>
    </Container>
  );
} 