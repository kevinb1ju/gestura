
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpeech } from '../hooks/useSpeech';
import Flower from '../components/Flower';
import confetti from 'canvas-confetti';
import { Volume2, Home, RefreshCw, Music, VolumeX, ArrowRight } from 'lucide-react';
import level2Music from '../music/level2.mp3';

const Level2 = ({ onComplete }) => {
    const { speak } = useSpeech();
    const [targetColor, setTargetColor] = useState(null);
    const [flowers, setFlowers] = useState([]);
    const [score, setScore] = useState(0);
    const [showFeedback, setShowFeedback] = useState(false);
    const [feedbackType, setFeedbackType] = useState('success');

    // Music State
    const [isMusicPlaying, setIsMusicPlaying] = useState(false);
    const [audio] = useState(new Audio(level2Music));

    const COLORS = [
        { name: 'Red', value: '#FF5252' },
        { name: 'Blue', value: '#448AFF' },
        { name: 'Purple', value: '#E040FB' },
        { name: 'Orange', value: '#FFAB40' },
        { name: 'Pink', value: '#FF4081' }
    ];

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
    }, []);

    useEffect(() => {
        if (score >= 100) {
            speak("Fantastic! You are a Color Master!");
            audio.pause();
        }
    }, [score, speak, audio]);

    const toggleMusic = () => {
        if (isMusicPlaying) {
            audio.pause();
            setIsMusicPlaying(false);
        } else {
            audio.play();
            setIsMusicPlaying(true);
        }
    };

    const generateFlowers = (target) => {
        const newFlowers = [];
        // Target
        newFlowers.push({
            id: Date.now(),
            color: target.value,
            name: target.name,
            x: `${Math.random() * 70 + 5}%`,
            delay: 0,
        });

        // Distractors
        for (let i = 0; i < 4; i++) {
            let randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
            newFlowers.push({
                id: Date.now() + i + 1,
                color: randomColor.value,
                name: randomColor.name,
                x: `${Math.random() * 70 + 5}%`,
                delay: Math.random() * 6,
            });
        }
        return newFlowers.sort(() => Math.random() - 0.5);
    };

    const startNewRound = () => {
        // Stop generating if we won
        if (score >= 100) return;

        const nextTarget = COLORS[Math.floor(Math.random() * COLORS.length)];
        setTargetColor(nextTarget);
        setFlowers(generateFlowers(nextTarget));
        speak(`Find the ${nextTarget.name} flower`);
        setShowFeedback(false);
    };

    const handleFlowerSelect = (flower) => {
        if (score >= 100) return;

        if (flower.color === targetColor.value) {
            // Success
            speak(`Correct! That is ${flower.name}!`);
            confetti({
                particleCount: 200,
                spread: 100,
                origin: { y: 0.6 },
                colors: [flower.color, '#ffffff']
            });
            setFeedbackType('success');
            setShowFeedback(true);
            setScore(s => s + 10);

            setTimeout(() => {
                startNewRound();
            }, 2000);
        } else {
            // Incorrect
            speak(`That is ${flower.name}. Find the ${targetColor.name} one!`);
            setFeedbackType('error');
            setShowFeedback(true);
            setScore(s => Math.max(0, s - 5));

            setTimeout(() => {
                setShowFeedback(false);
            }, 2000);
        }
    };

    if (score >= 100) {
        return (
            <div className="fixed inset-0 w-screen h-screen bg-green-200 flex flex-col items-center justify-center font-game overflow-hidden z-50">
                <div className="absolute inset-0 z-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/flowers.png')]"></div>
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-white/95 p-16 rounded-[3rem] shadow-2xl text-center z-50 border-8 border-green-500 max-w-3xl"
                >
                    <h1 className="text-8xl mb-8 font-extrabold text-green-600 drop-shadow-sm">🎉 You Win! 🎉</h1>
                    <p className="text-4xl font-ui text-green-800 mb-12">You found all the flowers!</p>
                    <button
                        onClick={onComplete} // Go to Level 3
                        className="flex items-center justify-center gap-4 px-12 py-6 bg-green-500 hover:bg-green-400 text-white text-4xl font-bold rounded-full shadow-[0_10px_0_rgb(21,128,61)] active:translate-y-2 active:shadow-none transition-all mx-auto"
                    >
                        Go to Level 3 <ArrowRight size={40} />
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="relative w-screen h-screen bg-green-100 overflow-hidden cursor-crosshair font-game">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/grass.png')]"></div>

            {/* HUD */}
            <div className="absolute top-8 left-8 flex gap-4 z-20 items-start">
                <div className="p-6 bg-white/90 rounded-3xl shadow-xl border-b-8 border-green-300 transform hover:scale-105 transition-transform">
                    <h2 className="text-5xl font-bold text-green-600">Score: <span className="text-green-800">{score}</span></h2>
                    <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
                        <div className="bg-green-500 h-4 rounded-full transition-all duration-500" style={{ width: `${Math.min(score, 100)}%` }}></div>
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
            <div
                className="absolute top-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-20 cursor-pointer group"
                onClick={() => speak(`Find the ${targetColor?.name} Flower`)}
            >
                <div className="bg-white/80 backdrop-blur-sm px-12 py-6 rounded-full border-4 border-white shadow-lg flex items-center gap-6 transition-transform group-hover:scale-105 duration-300">
                    <div className="bg-green-100 p-4 rounded-full text-green-600 animate-pulse">
                        <Volume2 size={48} />
                    </div>
                    <h1 className="text-6xl font-extrabold text-green-900 drop-shadow-sm tracking-wide select-none">
                        Find <span className="capitalize underline decoration-wavy decoration-4 underline-offset-8" style={{ color: targetColor?.value }}>{targetColor?.name}</span>
                    </h1>
                </div>
                <p className="text-green-700 font-ui font-bold mt-3 text-2xl drop-shadow-sm opacity-90 animate-bounce">
                    🔊 Click to listen!
                </p>
            </div>

            {/* Play Area */}
            <div className="relative w-full h-full z-10">
                <AnimatePresence>
                    {flowers.map(flower => (
                        <Flower
                            key={flower.id}
                            color={flower.color}
                            x={flower.x}
                            delay={flower.delay}
                            onSelect={() => handleFlowerSelect(flower)}
                        />
                    ))}
                </AnimatePresence>
            </div>

            {/* Feedback Overlay */}
            <AnimatePresence>
                {showFeedback && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
                    >
                        {feedbackType === 'success' ? (
                            <div className="bg-green-400 p-12 rounded-[3rem] shadow-2xl border-8 border-white transform rotate-3">
                                <span className="text-9xl">🌻</span>
                                <p className="text-4xl text-white font-bold mt-4 text-center">Correct!</p>
                            </div>
                        ) : (
                            <div className="bg-red-400 p-12 rounded-[3rem] shadow-2xl border-8 border-white transform -rotate-3">
                                <span className="text-9xl">🥀</span>
                                <p className="text-4xl text-white font-bold mt-4 text-center">Try Again</p>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Level2;
