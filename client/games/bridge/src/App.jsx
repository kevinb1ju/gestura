
import { useState } from 'react';
import Level1 from './levels/Level1';
import Level2 from './levels/Level2';
import Level3 from './levels/Level3';
import { HandTrackingProvider } from './context/HandTrackingContext';

function App() {
    const [gameState, setGameState] = useState('menu'); // menu, level1, level2, level3

    const startGame = () => {
        setGameState('level1');
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
                    <Level1 onComplete={() => setGameState('level2')} />
                )}

                {gameState === 'level2' && (
                    <Level2 onComplete={() => setGameState('level3')} />
                )}

                {gameState === 'level3' && (
                    <Level3 onComplete={() => setGameState('menu')} />
                )}
            </div>
        </HandTrackingProvider>
    );
}

export default App;
