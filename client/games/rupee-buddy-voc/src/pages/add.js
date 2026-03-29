import { useEffect, useRef, useState } from "react";
import { Hands } from "@mediapipe/hands";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import { HAND_CONNECTIONS } from "@mediapipe/hands";
import styled, { keyframes, css } from 'styled-components';

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

const VideoContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 240px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
  border: 3px solid white;
  z-index: 1000;
  background: black;
  
  canvas {
    width: 100%;
    height: auto;
    display: block;
    transform: scaleX(-1); /* mirror */
  }
`;

const Title = styled.h1`
  font-size: 3rem;
  color: #ff6600;
  font-weight: 900;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
`;

const TargetAmountContainer = styled.div`
  background: white;
  padding: 15px 40px;
  border-radius: 30px;
  border: 4px solid #138808;
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TargetLabel = styled.div`
  font-size: 1.2rem;
  color: #2d5016;
  font-weight: bold;
`;

const TargetValue = styled.div`
  font-size: 3.5rem;
  color: #138808;
  font-weight: 900;
`;

const SelectedAmountContainer = styled.div`
  font-size: 1.8rem;
  font-weight: bold;
  color: ${p => (p.match ? "#138808" : p.over ? "#d32f2f" : "#ff6600")};
  margin-bottom: 30px;
  background: rgba(255,255,255,0.9);
  padding: 10px 30px;
  border-radius: 20px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
`;

const NotesRow = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
  max-width: 1000px;
`;

const NoteCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 8px;
  border: 6px solid ${p => {
        if (p.selected) return "#138808";
        if (p.hovered) return "#ff9933";
        return "transparent";
    }};
  transform: ${p => (p.hovered || p.selected ? "scale(1.05)" : "scale(1)")};
  box-shadow: ${p =>
        p.selected
            ? "0 0 20px rgba(19,136,8,0.6)"
            : p.hovered
                ? "0 0 15px rgba(255,153,51,0.5)"
                : "0 8px 15px rgba(0,0,0,0.1)"};
  transition: all 0.2s ease;
  position: relative;
  
  &::after {
    content: ${p => p.selected ? "'✓'" : "''"};
    position: absolute;
    top: -15px;
    right: -15px;
    background: #138808;
    color: white;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 20px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    opacity: ${p => p.selected ? 1 : 0};
    transform: scale(${p => p.selected ? 1 : 0});
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
`;

const NoteImage = styled.img`
  width: ${p => p.isCoin ? "120px" : "180px"};
  height: auto;
  border-radius: ${p => p.isCoin ? "50%" : "8px"};
  object-fit: contain;
`;

const ProgressRing = styled.svg`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-90deg);
  width: 100px;
  height: 100px;
  pointer-events: none;
  z-index: 10;
  opacity: ${p => (p.show ? 1 : 0)};
  transition: opacity 0.2s;

  circle {
    fill: none;
    stroke-width: 8;
    stroke-linecap: round;
  }
  
  .bg {
    stroke: rgba(255,255,255,0.5);
  }
  
  .progress {
    stroke: #ff6600;
    stroke-dasharray: 251.2; /* 2 * pi * r (r=40) */
    stroke-dashoffset: ${p => 251.2 - (251.2 * p.progress) / 100};
    transition: stroke-dashoffset 0.1s linear;
  }
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
  margin-top: 30px;
  background: rgba(255, 255, 255, 0.95);
  border: 3px solid #ff9933;
  border-radius: 20px;
  padding: 15px 25px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
  font-size: 1.1rem;
  color: #2d5016;
  font-weight: 600;
  text-align: center;
`;

const SubmitContainer = styled.div`
  margin-top: 30px;
  position: relative;
`;

const SubmitButton = styled.div`
  background: ${p => p.disabled ? "#ccc" : "linear-gradient(135deg, #138808, #2d5016)"};
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  padding: 15px 40px;
  border-radius: 30px;
  box-shadow: 0 10px 20px rgba(0,0,0,0.2);
  transition: all 0.2s;
  border: 4px solid ${p => p.submitting && !p.disabled ? "#ff9933" : "transparent"};
  cursor: ${p => p.disabled ? "not-allowed" : "pointer"};
  opacity: ${p => p.disabled ? 0.6 : 1};
  
  ${p => p.submitting && !p.disabled && css`
    background: #ff9933;
    animation: ${float} 0.5s ease-in-out infinite;
  `}
`;

/* ---------------- DATA ---------------- */

const allCurrencies = [
    { id: 'c1', value: 1, label: "1", image: "/1.png", isCoin: true },
    { id: 'c2', value: 2, label: "2", image: "/2.png", isCoin: true },
    { id: 'c5', value: 5, label: "5", image: "/5.png", isCoin: true },
    { id: 'c10', value: 10, label: "10", image: "/10c.png", isCoin: true },
    { id: 'c20', value: 20, label: "20", image: "/20c.png", isCoin: true },
    { id: 'n10', value: 10, label: "10", image: "/10.png", isCoin: false },
    { id: 'n20', value: 20, label: "20", image: "/20.png", isCoin: false },
    { id: 'n50', value: 50, label: "50", image: "/50.png", isCoin: false },
    { id: 'n100', value: 100, label: "100", image: "/100.png", isCoin: false },
    { id: 'n200', value: 200, label: "200", image: "/200.jpg", isCoin: false },
    { id: 'n500', value: 500, label: "500", image: "/500.jpg", isCoin: false }
];

// Target amounts to generate questions for
// E.g., target 15 can be formed by 10 note + 5 coin
const targetOptions = [15, 25, 30, 40, 50, 70, 150, 250, 600];

// How long to hover to select a note (ms)
const HOVER_SELECT_TIME = 1500;
const SUBMIT_HOVER_TIME = 3000;

/* ---------------- COMPONENT ---------------- */

export default function Add() {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const optionRefs = useRef([]);
    const submitRef = useRef(null);

    const [halo, setHalo] = useState({ x: 0, y: 0, visible: false });
    const handsRef = useRef(null);

    const [level, setLevel] = useState(1);
    const [stars, setStars] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(generateQuestion(1));
    const [selectedNotes, setSelectedNotes] = useState([]);

    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [isHoveringSubmit, setIsHoveringSubmit] = useState(false);
    const [isFist, setIsFist] = useState(false);

    const [hoverProgress, setHoverProgress] = useState(0);
    const hoverStartTimeRef = useRef(null);
    const fistStartTimeRef = useRef(null);
    const lastHoveredIndexRef = useRef(null);
    const wasHoveringSubmitRef = useRef(false);

    const [voice, setVoice] = useState(null);
    const lockedRef = useRef(false);

    // References for current state inside requestAnimationFrame
    const stateRef = useRef({
        hoveredIndex,
        isHoveringSubmit,
        selectedNotes,
        currentQuestion,
        locked: lockedRef.current
    });

    useEffect(() => {
        stateRef.current = {
            hoveredIndex,
            isHoveringSubmit,
            selectedNotes,
            currentQuestion,
            locked: lockedRef.current
        };
    }, [hoveredIndex, isHoveringSubmit, selectedNotes, currentQuestion]);

    /* ---------------- VOICE ---------------- */

    useEffect(() => {
        const loadVoices = () => {
            const voices = speechSynthesis.getVoices();
            const female =
                voices.find(v => v.name.toLowerCase().includes("google") && v.name.toLowerCase().includes("female")) ||
                voices.find(v => v.lang.startsWith("en") && v.name.toLowerCase().includes("female")) ||
                voices.find(v => v.lang.startsWith("en"));
            setVoice(female || null);
        };

        loadVoices();
        speechSynthesis.onvoiceschanged = loadVoices;
    }, []);

    const lastSpokenRef = useRef("");

    const speak = (text, onEnd) => {
        if (text === lastSpokenRef.current && !onEnd) return;
        lastSpokenRef.current = text;

        speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.voice = voice;
        u.rate = 0.85;
        u.pitch = 1.1;
        if (onEnd) u.onend = onEnd;
        speechSynthesis.speak(u);
    };

    useEffect(() => {
        if (voice && currentQuestion && !lockedRef.current) {
            speak(`Make ${currentQuestion.target} rupees.`);
        }
    }, [currentQuestion, voice]);

    function generateQuestion(lvl) {
        // Pick a random target amount based on level
        const maxIndex = Math.min(lvl * 2 + 2, targetOptions.length);
        const target = targetOptions[Math.floor(Math.random() * maxIndex)];

        // Pick 5-6 random currencies that can sum up to this target (plus some noise)
        // We make sure the target is achievable.
        let options = [];

        // Simple greedy approach to guarantee solvability
        let tempTarget = target;
        const sortedCurrencies = [...allCurrencies].sort((a, b) => b.value - a.value);

        // Add correct notes
        for (const currency of sortedCurrencies) {
            while (tempTarget >= currency.value && options.length < 4) {
                options.push({ ...currency, uid: Math.random().toString(36).substring(7) });
                tempTarget -= currency.value;
            }
        }

        // Fill the rest with random noise notes up to 4 total options
        while (options.length < 4) {
            const randCurrency = allCurrencies[Math.floor(Math.random() * allCurrencies.length)];
            options.push({ ...randCurrency, uid: Math.random().toString(36).substring(7) });
        }

        // Shuffle options
        options = options.sort(() => 0.5 - Math.random());

        return { target, options };
    }

    /* ---------------- HAND TRACKING ---------------- */

    // Calculates Euclidean distance between two MediaPipe landmarks
    const getDistance = (lm1, lm2) => {
        return Math.sqrt(Math.pow(lm1.x - lm2.x, 2) + Math.pow(lm1.y - lm2.y, 2) + Math.pow(lm1.z - lm2.z, 2));
    };

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
                    if (!res.multiHandLandmarks?.length || stateRef.current.locked) {
                        setHalo(h => ({ ...h, visible: false }));
                        setHoveredIndex(null);
                        setIsHoveringSubmit(false);
                        setHoverProgress(0);
                        hoverStartTimeRef.current = null;
                        return;
                    }

                    const lm = res.multiHandLandmarks[0];
                    const tip = lm[8]; // Index finger tip

                    // Draw on canvas
                    if (canvasRef.current && videoRef.current) {
                        const ctx = canvasRef.current.getContext('2d');
                        canvasRef.current.width = videoRef.current.videoWidth;
                        canvasRef.current.height = videoRef.current.videoHeight;
                        ctx.save();
                        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

                        // Render video feed first
                        ctx.translate(canvasRef.current.width, 0);
                        ctx.scale(-1, 1);
                        ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
                        ctx.translate(canvasRef.current.width, 0);
                        ctx.scale(-1, 1);

                        // Draw landmarks over it
                        drawConnectors(ctx, lm, HAND_CONNECTIONS, { color: '#00FF00', lineWidth: 3 });
                        drawLandmarks(ctx, lm, { color: '#FF0000', lineWidth: 1, radius: 2 });
                        ctx.restore();
                    }

                    // mirror fix
                    const x = (1 - tip.x) * window.innerWidth;
                    const y = tip.y * window.innerHeight;

                    setHalo({ x, y, visible: true });

                    // -- Fist Detection Logic --
                    // We check the distance from each finger tip (8, 12, 16, 20) to the wrist (0).
                    // When the hand is open, the distance is large.
                    // When closed in a fist, the tips are close to the wrist.
                    const wrist = lm[0];
                    const indexTip = lm[8];
                    const middleTip = lm[12];
                    const ringTip = lm[16];
                    const pinkyTip = lm[20];

                    const dIndex = getDistance(indexTip, wrist);
                    const dMiddle = getDistance(middleTip, wrist);
                    const dRing = getDistance(ringTip, wrist);
                    const dPinky = getDistance(pinkyTip, wrist);

                    // A threshold around 0.25 to 0.35 is usually reliable for distinguishing closed vs open.
                    // If all finger tips are close to the base, it's a fist.
                    const isHandClosed = dIndex < 0.3 && dMiddle < 0.3 && dRing < 0.3 && dPinky < 0.3;

                    if (isHandClosed !== isFist) {
                        setIsFist(isHandClosed);
                    }

                    // Check intersections
                    let currentHovered = null;
                    let hoveringSubmit = false; // We won't use this explicitly anymore but let's keep it harmless

                    // Check notes
                    optionRefs.current.forEach((el, i) => {
                        if (!el) return;
                        const r = el.getBoundingClientRect();
                        // Add some padding to hitbox
                        if (x >= r.left - 20 && x <= r.right + 20 && y >= r.top - 20 && y <= r.bottom + 20) {
                            currentHovered = i;
                        }
                    });

                    // Handle state updates based on tracking results
                    const now = Date.now();

                    // If hover target changed
                    if (currentHovered !== lastHoveredIndexRef.current) {
                        hoverStartTimeRef.current = now;
                        setHoverProgress(0);
                        setHoveredIndex(currentHovered);
                        lastHoveredIndexRef.current = currentHovered;

                        if (currentHovered === null && !isHandClosed) {
                            if (fistStartTimeRef.current) fistStartTimeRef.current = null;
                            setIsHoveringSubmit(false);
                        }
                    } else if (currentHovered !== null) {
                        // Hovering over a note
                        const elapsed = now - hoverStartTimeRef.current;
                        const progress = Math.min((elapsed / HOVER_SELECT_TIME) * 100, 100);
                        setHoverProgress(progress);

                        if (progress >= 100) {
                            // Toggle selection
                            const selectedSet = new Set(stateRef.current.selectedNotes);
                            if (selectedSet.has(currentHovered)) {
                                selectedSet.delete(currentHovered);
                            } else {
                                selectedSet.add(currentHovered);
                            }
                            setSelectedNotes(Array.from(selectedSet));

                            // Play a tick sound or speech?
                            speak("Selected");

                            // Reset hover 
                            hoverStartTimeRef.current = now;
                            setHoverProgress(0);
                        }
                    } else if (isHandClosed) {
                        // Using 'Fist' to submit
                        const { selectedNotes, currentQuestion } = stateRef.current;
                        const currentTotal = selectedNotes.reduce((sum, idx) => sum + currentQuestion.options[idx].value, 0);

                        if (currentTotal > 0) {
                            if (!fistStartTimeRef.current) fistStartTimeRef.current = now;

                            const elapsed = now - fistStartTimeRef.current;
                            // Submit takes 2 seconds of holding a fist
                            const progress = Math.min((elapsed / 2000) * 100, 100);
                            setHoverProgress(progress);
                            setIsHoveringSubmit(true);

                            if (progress >= 100 && !stateRef.current.locked) {
                                lockedRef.current = true;
                                setHoverProgress(0);
                                setIsHoveringSubmit(false);
                                fistStartTimeRef.current = null;
                                handleSubmission(currentTotal, currentQuestion.target);
                            }
                        }
                    } else {
                        // Hand is open and not hovering over a note
                        if (fistStartTimeRef.current) {
                            fistStartTimeRef.current = null;
                            setHoverProgress(0);
                            setIsHoveringSubmit(false);
                        }
                    }
                });

                const loop = async () => {
                    if (videoRef.current?.readyState === 4 && !isProcessing) {
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

    const handleSubmission = (total, target) => {
        if (total === target) {
            setStars(s => s + 1);
            setLevel(l => l + 1);
            speak(`Correct! ₹${total}. Well done!`, () => {
                setCurrentQuestion(generateQuestion(level + 1));
                setSelectedNotes([]);
                lockedRef.current = false;
            });
        } else {
            speak(`That makes ₹${total}, but we need ₹${target}. Try again.`, () => {
                setSelectedNotes([]); // Reset selection on fail, or keep it? Resetting is easier
                lockedRef.current = false;
            });
        }
    };

    /* ---------------- RENDER UI ---------------- */

    const currentTotal = selectedNotes.reduce((sum, idx) => sum + currentQuestion.options[idx].value, 0);
    const isMatch = currentTotal === currentQuestion.target;
    const isOver = currentTotal > currentQuestion.target;

    return (
        <Container>
            <VideoContainer>
                <video ref={videoRef} style={{ display: "none" }} autoPlay playsInline />
                <canvas ref={canvasRef} />
            </VideoContainer>

            <CoinDecoration className="coin-1">₹</CoinDecoration>
            <CoinDecoration className="coin-2">₹</CoinDecoration>
            <CoinDecoration className="coin-3">₹</CoinDecoration>
            <CoinDecoration className="coin-4">₹</CoinDecoration>

            <Title>Add the Notes</Title>

            <TargetAmountContainer>
                <TargetLabel>Target Amount</TargetLabel>
                <TargetValue>₹{currentQuestion.target}</TargetValue>
            </TargetAmountContainer>

            <SelectedAmountContainer match={isMatch} over={isOver}>
                Current Sum: ₹{currentTotal}
            </SelectedAmountContainer>

            <NotesRow>
                {currentQuestion.options.map((option, i) => {
                    const isSelected = selectedNotes.includes(i);
                    const isHovered = hoveredIndex === i;

                    return (
                        <NoteCard
                            key={option.uid}
                            ref={el => (optionRefs.current[i] = el)}
                            selected={isSelected}
                            hovered={isHovered}
                        >
                            <NoteImage src={option.image} alt={option.label} isCoin={option.isCoin} />
                            <ProgressRing show={isHovered} progress={hoverProgress}>
                                <circle className="bg" cx="50" cy="50" r="40" />
                                <circle className="progress" cx="50" cy="50" r="40" />
                            </ProgressRing>
                        </NoteCard>
                    );
                })}
            </NotesRow>

            <SubmitContainer ref={submitRef}>
                <SubmitButton submitting={isHoveringSubmit} disabled={currentTotal === 0}>
                    {isHoveringSubmit ? "Submitting..." : (isFist ? "Checking..." : "Make a Fist to Submit ✊")}
                </SubmitButton>
                <ProgressRing show={isHoveringSubmit} progress={hoverProgress} style={{ width: 120, height: 120 }}>
                    <circle className="bg" cx="60" cy="60" r="50" />
                    <circle className="progress" cx="60" cy="60" r="50" style={{ strokeDasharray: 314, strokeDashoffset: 314 - (314 * hoverProgress) / 100 }} />
                </ProgressRing>
            </SubmitContainer>

            <InstructionBox>
                ✋ Hover over a note until the circle completes to select it.<br />
                Hover over it again to deselect.<br />
                ✊ **Make a fist anywhere** and hold it to Check Answer!
            </InstructionBox>

            {halo.visible && (
                <div
                    style={{
                        position: "fixed",
                        left: halo.x,
                        top: halo.y,
                        width: 50,
                        height: 50,
                        borderRadius: "50%",
                        background: "rgba(255,102,0,0.4)",
                        boxShadow: "0 0 20px rgba(255,102,0,0.8)",
                        transform: "translate(-50%, -50%)",
                        pointerEvents: "none",
                        zIndex: 9999,
                        border: "2px solid white"
                    }}
                />
            )}
        </Container>
    );
}
