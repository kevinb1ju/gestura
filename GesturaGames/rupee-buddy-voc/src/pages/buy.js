import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Hands } from "@mediapipe/hands";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import { HAND_CONNECTIONS } from "@mediapipe/hands";
import styled, { keyframes } from 'styled-components';
import img1 from '../assets/1.png';
import img2 from '../assets/2.png';
import img5 from '../assets/5.png';
import img10c from '../assets/10c.png';
import img20c from '../assets/20c.png';
import img10 from '../assets/10.png';
import img20 from '../assets/20.png';
import img50 from '../assets/50.png';
import img100 from '../assets/100.png';
import img200 from '../assets/200.jpg';
import img500 from '../assets/500.jpg';

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
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
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


const HUDContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 30px;
  margin-bottom: 20px;
  z-index: 100;
`;

const ScoreBoard = styled.div`
  background: white;
  padding: 10px 30px;
  border-radius: 20px;
  border: 3px solid #ff9933;
  font-size: 1.5rem;
  font-weight: bold;
  color: #ff6600;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
`;

const LivesDisplay = styled.div`
  background: white;
  padding: 10px 20px;
  border-radius: 20px;
  border: 3px solid #e11d48;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  gap: 5px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
`;

const ItemContainer = styled.div`
  background: white;
  padding: 20px 50px;
  border-radius: 30px;
  border: 4px solid #138808;
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ItemEmoji = styled.div`
  font-size: 6rem;
  margin-bottom: 10px;
  filter: drop-shadow(0 10px 10px rgba(0,0,0,0.2));
  animation: ${float} 4s ease-in-out infinite;
`;

const ItemName = styled.div`
  font-size: 1.5rem;
  color: #2d5016;
  font-weight: bold;
`;

const ItemPrice = styled.div`
  font-size: 2.5rem;
  color: #138808;
  font-weight: 900;
  margin-top: 10px;
  background: #f0fdf4;
  padding: 5px 20px;
  border-radius: 15px;
  border: 2px dashed #138808;
`;

const SelectedAmountContainer = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${p => (p.match ? "#138808" : p.over ? "#d32f2f" : "#ff6600")};
  margin-bottom: 20px;
  background: rgba(255,255,255,0.9);
  padding: 10px 30px;
  border-radius: 20px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  display: ${p => p.visible ? "block" : "none"};
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
    stroke-dasharray: 251.2;
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
  margin-top: 20px;
  position: relative;
  display: ${p => p.visible ? "block" : "none"};
`;

const SubmitButton = styled.div`
  background: ${p => p.disabled ? "#ccc" : "linear-gradient(135deg, #138808, #2d5016)"};
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  padding: 15px 40px;
  border-radius: 30px;
  box-shadow: 0 10px 20px rgba(0,0,0,0.2);
  transform: ${p => p.hovered && !p.disabled ? "scale(1.05)" : "scale(1)"};
  transition: all 0.2s;
  border: 4px solid ${p => p.hovered && !p.disabled ? "#ff9933" : "transparent"};
  cursor: ${p => p.disabled ? "not-allowed" : "pointer"};
`;

/* ---------------- DATA ---------------- */

const allCurrencies = [
    { id: 'c1', value: 1, label: "1", image: img1, isCoin: true },
    { id: 'c2', value: 2, label: "2", image: img2, isCoin: true },
    { id: 'c5', value: 5, label: "5", image: img5, isCoin: true },
    { id: 'c10', value: 10, label: "10", image: img10c, isCoin: true },
    { id: 'c20', value: 20, label: "20", image: img20c, isCoin: true },
    { id: 'n10', value: 10, label: "10", image: img10, isCoin: false },
    { id: 'n20', value: 20, label: "20", image: img20, isCoin: false },
    { id: 'n50', value: 50, label: "50", image: img50, isCoin: false },
    { id: 'n100', value: 100, label: "100", image: img100, isCoin: false },
    { id: 'n200', value: 200, label: "200", image: img200, isCoin: false },
    { id: 'n500', value: 500, label: "500", image: img500, isCoin: false }
];

const items = [
    { emoji: "✏️", name: "Pencil", priceOptions: [2, 5] },
    { emoji: "🖊️", name: "Pen", priceOptions: [10, 20] },
    { emoji: "🍎", name: "Apple", priceOptions: [15, 25] },
    { emoji: "🍫", name: "Chocolate", priceOptions: [50, 100] },
    { emoji: "🧸", name: "Toy Bear", priceOptions: [150, 200] },
    { emoji: "🎒", name: "School Bag", priceOptions: [500] }
];

const HOVER_SELECT_TIME = 1500;
const SUBMIT_HOVER_TIME = 3000;

/* ---------------- COMPONENT ---------------- */

export default function Buy() {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const optionRefs = useRef([]);
    const submitRef = useRef(null);

    const [halo, setHalo] = useState({ x: 0, y: 0, visible: false });
    const handsRef = useRef(null);

    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [currentQuestion, setCurrentQuestion] = useState(generateQuestion(0));
    const [selectedNotes, setSelectedNotes] = useState([]);

    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [isHoveringSubmit, setIsHoveringSubmit] = useState(false);

    const [hoverProgress, setHoverProgress] = useState(0);
    const hoverStartTimeRef = useRef(null);
    const lastHoveredIndexRef = useRef(null);
    const wasHoveringSubmitRef = useRef(false);

    const [voice, setVoice] = useState(null);
    const lockedRef = useRef(false);

    const stateRef = useRef({
        hoveredIndex,
        isHoveringSubmit,
        selectedNotes,
        currentQuestion,
        lives,
        score,
        locked: lockedRef.current
    });

    useEffect(() => {
        stateRef.current = {
            hoveredIndex,
            isHoveringSubmit,
            selectedNotes,
            currentQuestion,
            lives,
            score,
            locked: lockedRef.current
        };
    }, [hoveredIndex, isHoveringSubmit, selectedNotes, currentQuestion, lives, score]);


    /* ---------------- VOICE ---------------- */

    useEffect(() => {
        const loadVoices = () => {
            const voices = speechSynthesis.getVoices();
            const female = voices.find(v => v.name.toLowerCase().includes("google") && v.name.toLowerCase().includes("female")) ||
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
            speak(`Buy the ${currentQuestion.item.name} for ₹${currentQuestion.price}`);
        }
    }, [currentQuestion, voice]);

    function generateQuestion(currentScore) {
        // Phase 1: Score < 3, require single currency note to buy item
        // Phase 2: Score >= 3, require multiple combinations
        const isPhase1 = currentScore < 3;

        let targetPrice;
        let selectedItem;

        if (isPhase1) {
            // Pick an item that matches exactly one currency value
            const simpleCurrencies = allCurrencies.map(c => c.value);
            let validItems = items.filter(it => it.priceOptions.some(p => simpleCurrencies.includes(p)));
            selectedItem = validItems[Math.floor(Math.random() * validItems.length)];
            const validPrices = selectedItem.priceOptions.filter(p => simpleCurrencies.includes(p));
            targetPrice = validPrices[Math.floor(Math.random() * validPrices.length)];
        } else {
            // Pick any item, target price can be combination
            selectedItem = items[Math.floor(Math.random() * items.length)];
            targetPrice = selectedItem.priceOptions[Math.floor(Math.random() * selectedItem.priceOptions.length)];
            // Ensure it requires combination if possible
            if (targetPrice < 15) targetPrice += 5;
        }

        let options = [];
        let tempTarget = targetPrice;
        const sortedCurrencies = [...allCurrencies].sort((a, b) => b.value - a.value);

        for (const currency of sortedCurrencies) {
            while (tempTarget >= currency.value && options.length < 4) {
                options.push({ ...currency, uid: Math.random().toString(36).substring(7) });
                tempTarget -= currency.value;
            }
        }

        while (options.length < 4) {
            const randCurrency = allCurrencies[Math.floor(Math.random() * allCurrencies.length)];
            options.push({ ...randCurrency, uid: Math.random().toString(36).substring(7) });
        }

        options = options.sort(() => 0.5 - Math.random());

        return { item: selectedItem, price: targetPrice, options, isPhase1 };
    }

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
                    if (!res.multiHandLandmarks?.length || stateRef.current.locked) {
                        setHalo(h => ({ ...h, visible: false }));
                        setHoveredIndex(null);
                        setIsHoveringSubmit(false);
                        setHoverProgress(0);
                        hoverStartTimeRef.current = null;
                        return;
                    }

                    const lm = res.multiHandLandmarks[0];
                    const tip = lm[8];

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

                        // Draw landmarks
                        drawConnectors(ctx, lm, HAND_CONNECTIONS, { color: '#00FF00', lineWidth: 3 });
                        drawLandmarks(ctx, lm, { color: '#FF0000', lineWidth: 1, radius: 2 });
                        ctx.restore();
                    }

                    const x = (1 - tip.x) * window.innerWidth;
                    const y = tip.y * window.innerHeight;

                    setHalo({ x, y, visible: true });

                    let currentHovered = null;
                    let hoveringSubmit = false;

                    optionRefs.current.forEach((el, i) => {
                        if (!el) return;
                        const r = el.getBoundingClientRect();
                        if (x >= r.left - 20 && x <= r.right + 20 && y >= r.top - 20 && y <= r.bottom + 20) {
                            currentHovered = i;
                        }
                    });

                    if (submitRef.current && currentHovered === null) {
                        const sr = submitRef.current.getBoundingClientRect();
                        if (x >= sr.left - 30 && x <= sr.right + 30 && y >= sr.top - 30 && y <= sr.bottom + 30) {
                            hoveringSubmit = true;
                        }
                    }

                    const now = Date.now();

                    if (currentHovered !== lastHoveredIndexRef.current || hoveringSubmit !== wasHoveringSubmitRef.current) {
                        hoverStartTimeRef.current = now;
                        setHoverProgress(0);
                        setHoveredIndex(currentHovered);
                        setIsHoveringSubmit(hoveringSubmit);
                        lastHoveredIndexRef.current = currentHovered;
                        wasHoveringSubmitRef.current = hoveringSubmit;
                    } else if (currentHovered !== null) {
                        const elapsed = now - hoverStartTimeRef.current;
                        const progress = Math.min((elapsed / HOVER_SELECT_TIME) * 100, 100);
                        setHoverProgress(progress);

                        if (progress >= 100) {
                            const { selectedNotes, currentQuestion } = stateRef.current;

                            if (currentQuestion.isPhase1) {
                                // Phase 1: Only one selection allowed, auto submits
                                setSelectedNotes([currentHovered]);
                                lockedRef.current = true;
                                setHoverProgress(0);
                                const val = currentQuestion.options[currentHovered].value;
                                handleSubmission(val, currentQuestion.price);
                            } else {
                                // Phase 2: Multiple selections, toggle
                                const selectedSet = new Set(selectedNotes);
                                if (selectedSet.has(currentHovered)) {
                                    selectedSet.delete(currentHovered);
                                } else {
                                    selectedSet.add(currentHovered);
                                }
                                setSelectedNotes(Array.from(selectedSet));
                                speak("Selected");
                                hoverStartTimeRef.current = now;
                                setHoverProgress(0);
                            }
                        }
                    } else if (hoveringSubmit) {
                        const { selectedNotes, currentQuestion } = stateRef.current;
                        if (!currentQuestion.isPhase1 && selectedNotes.length > 0) {
                            const currentTotal = selectedNotes.reduce((sum, idx) => sum + currentQuestion.options[idx].value, 0);
                            const elapsed = now - hoverStartTimeRef.current;
                            const progress = Math.min((elapsed / SUBMIT_HOVER_TIME) * 100, 100);
                            setHoverProgress(progress);

                            if (progress >= 100 && !stateRef.current.locked) {
                                lockedRef.current = true;
                                setHoverProgress(0);
                                handleSubmission(currentTotal, currentQuestion.price);
                            }
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
            const nextScore = stateRef.current.score + 1;
            setScore(nextScore);
            speak(`Correct! Enjoy your ${stateRef.current.currentQuestion.item.name}!`, () => {
                const updatedScore = stateRef.current.currentQuestion.isPhase1 ? nextScore : nextScore + 1;
                // If phase 2, score increases by 2. We already added 1, so add another 1 to match original logic
                if (!stateRef.current.currentQuestion.isPhase1) setScore(updatedScore);
                setCurrentQuestion(generateQuestion(updatedScore));
                setSelectedNotes([]);
                lockedRef.current = false;
            });
        } else {
            const nextLives = stateRef.current.lives - 1;
            setLives(nextLives);
            if (nextLives <= 0) {
                speak(`Game over! You ran out of lives. Returning to dashboard.`, () => {
                    try {
                        const urlParams = new URLSearchParams(window.location.search);
                        const studentId = urlParams.get('studentId');
                        if (studentId) {
                            const key = `student_performance_${studentId}`;
                            const existingData = localStorage.getItem(key);
                            let studentData = existingData ? JSON.parse(existingData) : {};
                            
                            const gameName = "Rupee Buddy Vocational";
                            if (!studentData[gameName]) studentData[gameName] = {};
                            
                            const baseScore = Math.min(100, stateRef.current.score * 15 + 30);
                            studentData[gameName] = {
                                ...studentData[gameName],
                                cognitive: {
                                    advanced_financial_planning: baseScore,
                                    market_understanding: Math.min(100, baseScore + 5),
                                    business_math: baseScore,
                                    risk_assessment: Math.min(100, baseScore - 5)
                                },
                                motor: {
                                    professional_skills: baseScore,
                                    equipment_operation: Math.min(100, baseScore + 2),
                                    endurance: Math.min(100, baseScore - 3)
                                },
                                social: {
                                    professional_communication: baseScore,
                                    customer_service: Math.min(100, baseScore + 5),
                                    team_collaboration: Math.min(100, baseScore - 2)
                                },
                                emotional: {
                                    work_ethic: 100,
                                    stress_management: Math.min(100, baseScore + 3),
                                    career_confidence: baseScore,
                                    adaptability_to_change: Math.min(100, baseScore + 6)
                                }
                            };
                            
                            localStorage.setItem(key, JSON.stringify(studentData));
                        }
                    } catch(e) {
                        console.error("Could not save score", e);
                    }
                    window.location.href = "/dashboard";
                });
            } else {
                speak(`Oops, you gave ₹${total}, but the price is ₹${target}. Try again.`, () => {
                    setSelectedNotes([]);
                    lockedRef.current = false;
                });
            }
        }
    };

    /* ---------------- RENDER UI ---------------- */

    const currentTotal = selectedNotes.reduce((sum, idx) => sum + currentQuestion.options[idx].value, 0);
    const isMatch = currentTotal === currentQuestion.price;
    const isOver = currentTotal > currentQuestion.price;

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

            <HUDContainer>
                <ScoreBoard>Score: {score}</ScoreBoard>
                <LivesDisplay>
                    {Array.from({ length: 3 }).map((_, i) => (
                        <span key={i} style={{ opacity: i < lives ? 1 : 0.3, filter: i < lives ? 'none' : 'grayscale(100%)' }}>❤️</span>
                    ))}
                </LivesDisplay>
            </HUDContainer>

            <ItemContainer>
                <ItemEmoji>{currentQuestion.item.emoji}</ItemEmoji>
                <ItemName>{currentQuestion.item.name}</ItemName>
                <ItemPrice>₹{currentQuestion.price}</ItemPrice>
            </ItemContainer>

            <SelectedAmountContainer visible={!currentQuestion.isPhase1 && selectedNotes.length > 0} match={isMatch} over={isOver}>
                Cash Given: ₹{currentTotal}
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

            <SubmitContainer ref={submitRef} visible={!currentQuestion.isPhase1}>
                <SubmitButton hovered={isHoveringSubmit} disabled={currentTotal === 0}>
                    Pay ₹{currentTotal}
                </SubmitButton>
                <ProgressRing show={isHoveringSubmit} progress={hoverProgress} style={{ width: 120, height: 120 }}>
                    <circle className="bg" cx="60" cy="60" r="50" />
                    <circle className="progress" cx="60" cy="60" r="50" style={{ strokeDasharray: 314, strokeDashoffset: 314 - (314 * hoverProgress) / 100 }} />
                </ProgressRing>
            </SubmitContainer>

            <InstructionBox>
                {currentQuestion.isPhase1 ? (
                    <>✋ Hover over the correct note to pay for the item.</>
                ) : (
                    <>
                        ✋ Hover over notes to select them to match the total price.<br />
                        Hover over 'Pay' when you are done.
                    </>
                )}
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
