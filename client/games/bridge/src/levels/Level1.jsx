
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpeech } from '../hooks/useSpeech';
import Shape from '../components/Shape';
import confetti from 'canvas-confetti';
import { Volume2, Music, VolumeX, ArrowRight } from 'lucide-react';
import level1Music from '../music/level1.mp3';

const Level1 = ({ onComplete }) => {
    const { speak } = useSpeech();
    const [targetShape, setTargetShape] = useState(null);
    const [shapes, setShapes] = useState([]);
    const [score, setScore] = useState(0);
    const [showFeedback, setShowFeedback] = useState(false);
    const [feedbackType, setFeedbackType] = useState('success');
    const [isLevelComplete, setIsLevelComplete] = useState(false);

    // Music State
    const [isMusicPlaying, setIsMusicPlaying] = useState(false);
    const [audio] = useState(new Audio(level1Music));

    const SHAPE_TYPES = ['circle', 'square', 'triangle', 'rectangle'];
    const COLORS = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#FF9F43'];

    // Initialize level
    useEffect(() => {
        startNewRound();

        // Setup Music
        audio.loop = true;
        audio.volume = 0.4;

        // Try autoplay
        const playMusic = async () => {
            try {
                await audio.play();
                setIsMusicPlaying(true);
            } catch (err) {
                console.log("Audio autoplay blocked, waiting for user interaction:", err);
            }
        };

        playMusic();

        return () => {
            audio.pause();
            audio.currentTime = 0;
        };
    }, []); // Run once on mount

    // Check win condition
    useEffect(() => {
        if (score >= 100 && !isLevelComplete) {
            setIsLevelComplete(true);
            speak("Congratulations! You won Level 1!");
            audio.pause(); // Stop music when level is done
        }
    }, [score, isLevelComplete, speak, audio]);

    const toggleMusic = () => {
        if (isMusicPlaying) {
            audio.pause();
            setIsMusicPlaying(false);
        } else {
            audio.play();
            setIsMusicPlaying(true);
        }
    };

    const generateShapes = (targetType) => {
        const newShapes = [];
        // Ensure target shape is present
        newShapes.push({
            id: Date.now(),
            type: targetType,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            x: `${Math.random() * 70 + 5}%`,
            delay: 0,
        });

        // Add distractor shapes
        for (let i = 0; i < 3; i++) {
            let type = SHAPE_TYPES[Math.floor(Math.random() * SHAPE_TYPES.length)];
            newShapes.push({
                id: Date.now() + i + 1,
                type: type,
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
                x: `${Math.random() * 70 + 5}%`,
                delay: Math.random() * 8,
            });
        }
        return newShapes.sort(() => Math.random() - 0.5);
    };

    const startNewRound = () => {
        if (isLevelComplete) return;

        const nextTarget = SHAPE_TYPES[Math.floor(Math.random() * SHAPE_TYPES.length)];
        setTargetShape(nextTarget);
        setShapes(generateShapes(nextTarget));
        speak(`Find the ${nextTarget}`);
        setShowFeedback(false);
    };

    const handleShapeSelect = (shape) => {
        if (isLevelComplete) return;

        if (shape.type === targetShape) {
            // Success
            speak("Great job!");
            confetti({
                particleCount: 150,
                spread: 80,
                origin: { y: 0.6 },
                colors: ['#FF6B6B', '#4ECDC4', '#FFE66D']
            });
            setFeedbackType('success');
            setShowFeedback(true);
            setScore(s => s + 10);

            setTimeout(() => {
                startNewRound();
            }, 2000);
        } else {
            // Incorrect
            speak("Oops, try again!");
            setFeedbackType('error');
            setShowFeedback(true);
            setScore(s => Math.max(0, s - 5));

            setTimeout(() => {
                setShowFeedback(false);
            }, 1500);
        }
    };

    return (
        <div className="relative w-screen h-screen bg-sky-100 overflow-hidden cursor-crosshair font-game">
            {/* HUD */}
            <div className="absolute top-8 left-8 flex gap-4 z-20 items-start">
                <div className="p-6 bg-white/90 rounded-3xl shadow-xl border-b-8 border-sky-200 transform hover:scale-105 transition-transform">
                    <h2 className="text-5xl font-bold text-sky-500">Score: <span className="text-sky-800">{score}</span></h2>
                    <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
                        <div className="bg-sky-500 h-4 rounded-full transition-all duration-500" style={{ width: `${Math.min(score, 100)}%` }}></div>
                    </div>
                </div>

                {/* Music Toggle */}
                <button
                    onClick={toggleMusic}
                    className="p-4 bg-white/90 rounded-full shadow-xl border-b-8 border-purple-200 hover:scale-110 transition-transform h-fit mt-2"
                    title={isMusicPlaying ? "Mute Music" : "Play Music"}
                >
                    {isMusicPlaying ? <Music className="text-purple-600" size={32} /> : <VolumeX className="text-gray-400" size={32} />}
                </button>
            </div>

            {/* Instruction */}
            {!isLevelComplete && (
                <div
                    className="absolute top-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-20 cursor-pointer group"
                    onClick={() => speak(`Find the ${targetShape}`)}
                    title="Click to hear instruction again"
                >
                    <div className="bg-white/80 backdrop-blur-sm px-12 py-6 rounded-full border-4 border-white shadow-lg flex items-center gap-6 transition-transform group-hover:scale-105 duration-300">
                        <div className="bg-sky-100 p-4 rounded-full text-sky-600 animate-pulse">
                            <Volume2 size={48} />
                        </div>
                        <h1 className="text-6xl font-extrabold text-sky-900 drop-shadow-sm tracking-wide select-none">
                            Find the <span className="text-pink-500 capitalize underline decoration-wavy decoration-4 underline-offset-8">{targetShape}</span>
                        </h1>
                    </div>
                    <p className="text-sky-700 font-ui font-bold mt-3 text-2xl drop-shadow-sm opacity-90 animate-bounce">
                        🔊 Click to listen!
                    </p>
                </div>
            )}

            {/* Play Area */}
            <div className="relative w-full h-full z-10">
                <AnimatePresence>
                    {!isLevelComplete && shapes.map(shape => (
                        <Shape
                            key={shape.id}
                            type={shape.type}
                            color={shape.color}
                            x={shape.x}
                            delay={shape.delay}
                            onSelect={() => handleShapeSelect(shape)}
                        />
                    ))}
                </AnimatePresence>
            </div>

            {/* Level Complete Overlay */}
            <AnimatePresence>
                {isLevelComplete && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
                    >
                        <div className="bg-white p-12 rounded-[3rem] shadow-2xl border-8 border-sky-400 text-center max-w-2xl">
                            <h1 className="text-7xl font-extrabold text-sky-900 mb-4">Level Complete! 🎉</h1>
                            <p className="text-3xl text-sky-600 font-ui mb-8">You found all the shapes!</p>
                            <div className="flex justify-center">
                                <button
                                    onClick={onComplete}
                                    className="flex items-center gap-4 px-12 py-6 bg-green-500 hover:bg-green-400 text-white text-4xl font-bold rounded-full shadow-[0_8px_0_rgb(21,128,61)] hover:shadow-[0_12px_0_rgb(21,128,61)] active:shadow-none active:translate-y-2 transition-all"
                                >
                                    Go to Level 2 <ArrowRight size={48} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Manual Respawn Button (Debug) */}
            {!isLevelComplete && (
                <button
                    onClick={startNewRound}
                    className="absolute bottom-4 right-4 z-[9999] bg-gray-500/50 hover:bg-gray-500 text-white px-4 py-2 rounded text-sm"
                >
                    Stuck? Respawn Shapes
                </button>
            )}

            {/* Feedback Overlay */}
            <AnimatePresence>
                {showFeedback && !isLevelComplete && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
                    >
                        {feedbackType === 'success' ? (
                            <div className="bg-green-400 p-12 rounded-[3rem] shadow-2xl border-8 border-white transform rotate-3">
                                <span className="text-9xl">🌟</span>
                                <p className="text-4xl text-white font-bold mt-4 text-center">+10</p>
                            </div>
                        ) : (
                            <div className="bg-red-400 p-12 rounded-[3rem] shadow-2xl border-8 border-white transform -rotate-3">
                                <span className="text-9xl">❌</span>
                                <p className="text-4xl text-white font-bold mt-4 text-center">-5</p>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Level1;
