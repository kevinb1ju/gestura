
import { useState } from 'react';
import Level1 from './levels/Level1';
import Level2 from './levels/Level2';
import Level3 from './levels/Level3';
import { HandTrackingProvider } from './context/HandTrackingContext';
import { useSpeech } from './hooks/useSpeech';

function App() {
    const { speak } = useSpeech();
    const [gameState, setGameState] = useState('menu'); // menu, level1, level2, level3
    const [lives, setLives] = useState(3);
    const [completedLevelsCount, setCompletedLevelsCount] = useState(0);

    const startGame = () => {
        setLives(3);
        setCompletedLevelsCount(0);
        setGameState('level1');
    };

    const saveScoreAndExit = (currentLevelScore) => {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const studentId = urlParams.get('studentId');
            if (studentId) {
                const key = `student_performance_${studentId}`;
                const existingData = localStorage.getItem(key);
                let studentData = existingData ? JSON.parse(existingData) : {};
                
                const gameName = "Bridge Game";
                if (!studentData[gameName]) studentData[gameName] = {};
                
                const baseScore = Math.min(100, ((completedLevelsCount * 100) + currentLevelScore) / 3);
                
                studentData[gameName] = {
                    ...studentData[gameName],
                    cognitive: {
                        strategic_thinking: baseScore,
                        cause_and_effect: Math.min(100, baseScore + 5),
                        logical_reasoning: Math.min(100, baseScore - 2),
                        adaptability: baseScore
                    },
                    motor: {
                        construction_skills: baseScore,
                        precision_placement: Math.min(100, baseScore + 3),
                        tool_usage: Math.min(100, baseScore - 5)
                    },
                    social: {
                        teamwork: baseScore,
                        leadership: Math.min(100, baseScore + 4),
                        conflict_resolution: baseScore
                    },
                    emotional: {
                        goal_orientation: 100,
                        patience_with_process: Math.min(100, baseScore + 2),
                        sense_of_accomplishment: Math.min(100, baseScore + 10),
                        resilience_to_setbacks: Math.min(100, baseScore + 5)
                    }
                };
                
                localStorage.setItem(key, JSON.stringify(studentData));
            }
        } catch(e) {
            console.error("Could not save score", e);
        }
        window.location.href = "/dashboard";
    };

    const handleWrong = (currentScore) => {
        setLives(l => {
            const next = l - 1;
            if (next === 0) {
                speak("Game over! You ran out of lives. Returning to dashboard.");
                setTimeout(() => saveScoreAndExit(currentScore), 3500);
            }
            return next;
        });
    };

    const handleLevelComplete = (nextLevel) => {
        setCompletedLevelsCount(c => c + 1);
        if (nextLevel === 'menu') {
            saveScoreAndExit(100);
        } else {
            setGameState(nextLevel);
        }
    };

    return (
        <HandTrackingProvider>
            <div className="w-screen h-screen bg-gradient-to-br from-indigo-500 to-purple-600 font-game text-white overflow-hidden">
                {gameState === 'menu' && (
                    <div className="w-full h-full flex flex-row items-center justify-center space-x-12 p-12 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
                        <div className="flex-1 text-right">
                            <h1 className="text-9xl font-extrabold drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-500 transform -rotate-6">
                                Shape<br />Catch
                            </h1>
                        </div>

                        <div className="flex-1 flex justify-start">
                            <div className="bg-white/10 backdrop-blur-md rounded-[3rem] p-12 border-4 border-white/20 shadow-2xl max-w-md w-full transform rotate-3 hover:rotate-0 transition-transform duration-300">
                                <p className="text-4xl mb-8 font-ui text-center text-yellow-300">Ready to play?</p>

                                <div className="text-lg font-ui bg-black/20 p-6 rounded-2xl mb-8 border-2 border-white/10">
                                    <p className="mb-2">👋 <span className="font-bold text-green-300">Wave</span> to play!</p>
                                    <p>Score <span className="font-bold text-yellow-300">100 points</span> to unlock next level!</p>
                                </div>

                                <button
                                    onClick={startGame}
                                    className="w-full px-8 py-6 bg-yellow-400 hover:bg-yellow-300 text-purple-900 text-4xl font-bold rounded-full transition-all transform hover:scale-110 active:scale-95 shadow-[0_10px_0_rgb(202,138,4)] border-b-0 active:translate-y-2 active:shadow-none"
                                >
                                    Start! 🚀
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {gameState === 'level1' && (
                    <Level1 onComplete={() => handleLevelComplete('level2')} lives={lives} onWrong={handleWrong} />
                )}

                {gameState === 'level2' && (
                    <Level2 onComplete={() => handleLevelComplete('level3')} lives={lives} onWrong={handleWrong} />
                )}

                {gameState === 'level3' && (
                    <Level3 onComplete={() => handleLevelComplete('menu')} lives={lives} onWrong={handleWrong} />
                )}
            </div>
        </HandTrackingProvider>
    );
}

export default App;
