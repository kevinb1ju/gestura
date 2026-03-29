
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpeech } from '../hooks/useSpeech';
import Balloon from '../components/Balloon';
import confetti from 'canvas-confetti';
import { Volume2, RefreshCw, Music, VolumeX, Home } from 'lucide-react';
import level3Music from '../music/level3.mp3';

const Level3 = ({ onComplete }) => {
    const { speak } = useSpeech();
    const [targetNumber, setTargetNumber] = useState(null);
    const [balloons, setBalloons] = useState([]);
    const [score, setScore] = useState(0);
    const [showFeedback, setShowFeedback] = useState(false);
    const [feedbackType, setFeedbackType] = useState('success');
    const [poppedBalloons, setPoppedBalloons] = useState(new Set()); // Track popped IDs to prevent double hits

    // Music State
    const [isMusicPlaying, setIsMusicPlaying] = useState(false);
    const [audio] = useState(new Audio(level3Music));

    const COLORS = ['#FF5252', '#448AFF', '#E040FB', '#FFAB40', '#69F0AE', '#FFD740'];

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
            speak("You are a Number Wizard!");
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

    const generateBalloons = (target) => {
        const newBalloons = [];

        // Target Balloon
        newBalloons.push({
            id: Date.now(),
            number: target,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            x: `${Math.random() * 70 + 10}%`,
            delay: 0,
        });

        // Distractors
        for (let i = 0; i < 4; i++) {
            // Ensure distractor is NOT the target
            let num;
            do {
                num = Math.floor(Math.random() * 10) + 1;
            } while (num === target);

            newBalloons.push({
                id: Date.now() + i + 1,
                number: num,
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
                x: `${Math.random() * 70 + 10}%`,
                delay: Math.random() * 5,
            });
        }
        return newBalloons.sort(() => Math.random() - 0.5);
    };

    const startNewRound = () => {
        if (score >= 100) return;

        const nextTarget = Math.floor(Math.random() * 10) + 1; // 1-10
        setTargetNumber(nextTarget);
        setBalloons(generateBalloons(nextTarget));
        setPoppedBalloons(new Set()); // Reset popped tracking
        speak(`Pop number ${nextTarget}`);
        setShowFeedback(false);
    };

    const handleBalloonPop = (balloon) => {
        if (score >= 100) return;
        if (poppedBalloons.has(balloon.id)) return; // Ignore if already popped

        // Mark as popped immediately to prevent echoes
        setPoppedBalloons(prev => new Set(prev).add(balloon.id));

        if (balloon.number === targetNumber) {
            // Success
            // Visual "Blast" is handled by the Balloon component's exit animation (if wired up)
            // or we just remove it and let AnimatePresence do the work.

            confetti({
                particleCount: 150,
                spread: 100,
                origin: { y: 0.6 },
                colors: [balloon.color, '#ffffff']
            });

            setFeedbackType('success');
            setShowFeedback(true);
            setScore(s => s + 10);

            // Remove the balloon from the list basically instantly to trigger exit animation?
            // Or wait slightly? 
            // If we remove it from `balloons`, AnimatePresence handles the exit.
            // We need to remove ALL balloons to start new round, but let's delay that.

            setTimeout(() => {
                startNewRound();
            }, 1500);
        } else {
            // Incorrect
            speak(`That is ${balloon.number}. Find ${targetNumber}!`);
            setFeedbackType('error');
            setShowFeedback(true);
            setScore(s => Math.max(0, s - 5));

            // Remove only this balloon? Or just feedback?
            // Let's just show feedback and keep playing.
            // If we want to "pop" it regardless (as penalty), we could.
            // For now, just feedback.
            setPoppedBalloons(prev => {
                const next = new Set(prev);
                next.delete(balloon.id); // Allow popping again if it was just a wrong guess? 
                // Actually, usually wrong guesses shouldn't pop or should just give error.
                return next;
            });

            setTimeout(() => {
                setShowFeedback(false);
            }, 1500);
        }
    };

    if (score >= 100) {
        return (
            <div className="fixed inset-0 w-screen h-screen bg-blue-200 flex flex-col items-center justify-center font-game overflow-hidden z-50">
                <div className="absolute inset-0 z-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-white/95 p-16 rounded-[3rem] shadow-2xl text-center z-50 border-8 border-blue-500 max-w-3xl"
                >
                    <h1 className="text-8xl mb-8 font-extrabold text-blue-600 drop-shadow-sm">🏆 Champion! 🏆</h1>
                    <p className="text-4xl font-ui text-blue-800 mb-12">You mastered Shapes, Colors, and Numbers!</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="flex items-center justify-center gap-4 px-12 py-6 bg-yellow-400 hover:bg-yellow-300 text-purple-900 text-4xl font-bold rounded-full shadow-[0_10px_0_rgb(202,138,4)] active:translate-y-2 active:shadow-none transition-all mx-auto"
                    >
                        <RefreshCw size={40} /> Play Again
                    </button>
                </motion.div>
            </div>
        );
    }

    // Filter out popped balloons if they are the target (to trigger exit)
    // Actually, we want to keep them in `balloons` state until we decide to remove them,
    // OR we remove them from state and let AnimatePresence handle it.
    // For the "Success" case, we restart the round which replaces `balloons`. 
    // For the "Blast" effect, we want the target to explode.
    // If `startNewRound` replaces `balloons`, they will all exit.
    // We want the *clicked* balloon to blast. 

    // Let's modify handleBalloonPop to remove the specific balloon if it's correct?
    // No, startNewRound does that.
    // We want to make sure the "Exit" animation is a "Blast".

    return (
        <div className="relative w-screen h-screen bg-blue-100 overflow-hidden cursor-crosshair font-game">
            {/* Background/Sky */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-300 to-blue-100 opacity-50"></div>

            {/* Clouds (Static CSS for now) */}
            <div className="absolute top-20 left-20 opacity-60">
                <div className="w-32 h-12 bg-white rounded-full blur-xl"></div>
            </div>
            <div className="absolute top-40 right-40 opacity-60">
                <div className="w-48 h-16 bg-white rounded-full blur-xl"></div>
            </div>

            {/* HUD */}
            <div className="absolute top-8 left-8 flex gap-4 z-20 items-start">
                <div className="p-6 bg-white/90 rounded-3xl shadow-xl border-b-8 border-blue-300 transform hover:scale-105 transition-transform">
                    <h2 className="text-5xl font-bold text-blue-600">Score: <span className="text-blue-800">{score}</span></h2>
                    <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
                        <div className="bg-blue-500 h-4 rounded-full transition-all duration-500" style={{ width: `${Math.min(score, 100)}%` }}></div>
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
                onClick={() => speak(`Pop number ${targetNumber}`)}
            >
                <div className="bg-white/80 backdrop-blur-sm px-12 py-6 rounded-full border-4 border-white shadow-lg flex items-center gap-6 transition-transform group-hover:scale-105 duration-300">
                    <div className="bg-blue-100 p-4 rounded-full text-blue-600 animate-pulse">
                        <Volume2 size={48} />
                    </div>
                    <h1 className="text-6xl font-extrabold text-blue-900 drop-shadow-sm tracking-wide select-none">
                        Pop Number <span className="text-pink-500 underline decoration-wavy decoration-4 underline-offset-8">{targetNumber}</span>
                    </h1>
                </div>
                <p className="text-blue-700 font-ui font-bold mt-3 text-2xl drop-shadow-sm opacity-90 animate-bounce">
                    🔊 Click to listen!
                </p>
            </div>

            {/* Play Area */}
            <div className="relative w-full h-full z-10">
                <AnimatePresence>
                    {balloons.map(balloon => (
                        <Balloon
                            key={balloon.id}
                            number={balloon.number}
                            color={balloon.color}
                            x={balloon.x}
                            delay={balloon.delay}
                            onPop={() => handleBalloonPop(balloon)}
                            isPopped={poppedBalloons.has(balloon.id) && balloon.number === targetNumber} // Pass popped state?
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

export default Level3;
