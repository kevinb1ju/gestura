// ============================================================
//  App.jsx  –  React game components
//  Uses window.SoundManager and window.HandTracker
// ============================================================

const { useState, useEffect, useRef, useCallback } = React;

// ── Config ──────────────────────────────────────────────────

const BALLOON_COLORS = [
  { bg: 'radial-gradient(circle at 35% 35%, #FF9999, #FF2222)', tie: '#CC1111', size: 88 },
  { bg: 'radial-gradient(circle at 35% 35%, #FFEE66, #FFAA00)', tie: '#CC8800', size: 80 },
  { bg: 'radial-gradient(circle at 35% 35%, #88EE88, #22AA44)', tie: '#118833', size: 84 },
  { bg: 'radial-gradient(circle at 35% 35%, #88AAFF, #2244DD)', tie: '#1133BB', size: 78 },
  { bg: 'radial-gradient(circle at 35% 35%, #FF99DD, #EE22AA)', tie: '#BB1188', size: 90 },
  { bg: 'radial-gradient(circle at 35% 35%, #FFAA66, #FF5511)', tie: '#CC3300', size: 82 },
  { bg: 'radial-gradient(circle at 35% 35%, #CC99FF, #8833EE)', tie: '#6611BB', size: 76 },
  { bg: 'radial-gradient(circle at 35% 35%, #55DDDD, #009999)', tie: '#007777', size: 94 },
];

const BALLOON_EMOJIS = ['⭐','🌟','🌈','🦋','🌸','🐶','🐱','🦄','🍭','🎵','🌺','💖','🎀','🌙','🐸','🍦'];

const LEVELS = [
  { speed: 15000, spawnMs: 2500, maxBalloons: 2 },
  { speed: 12000, spawnMs: 2100, maxBalloons: 3 },
  { speed: 9500,  spawnMs: 1800, maxBalloons: 4 },
  { speed: 7800,  spawnMs: 1500, maxBalloons: 5 },
  { speed: 6200,  spawnMs: 1200, maxBalloons: 5 },
];

const POPS_PER_LEVEL = 8;
const GAME_SECONDS   = 90;

const getLevelConfig = l => LEVELS[Math.min(l - 1, LEVELS.length - 1)];
const rand = (a, b)  => a + Math.random() * (b - a);
const uid  = ()      => Math.random().toString(36).slice(2, 8);

// ── Speech helper ────────────────────────────────────────────

function speak(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate  = 0.88;
  u.pitch = 1.3;
  u.volume = 1;
  const voices = window.speechSynthesis.getVoices();
  const nice = voices.find(v => v.lang.startsWith('en'));
  if (nice) u.voice = nice;
  window.speechSynthesis.speak(u);
}

// ── Welcome Screen ───────────────────────────────────────────

function WelcomeScreen({ onStart }) {
  useEffect(() => {
    const t = setTimeout(() => speak("Hello! Let's pop some balloons!"), 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="welcome">
      <div className="balloons">
        <span onClick={() => speak('Pop!')}>🎈</span>
        <span onClick={() => speak('Pop!')}>🎈</span>
        <span onClick={() => speak('Pop!')}>🎈</span>
      </div>
      <h1>Pop the Balloon!</h1>
      <button className="btn-play" onClick={onStart}>▶ Play!</button>
    </div>
  );
}

// ── Game Over Screen ─────────────────────────────────────────

function GameOverScreen({ score, won, onPlayAgain }) {
  useEffect(() => {
    const msgs = won
      ? ['Amazing! You are a superstar!', 'Wonderful! You did it!']
      : ['Good try! You can do it!', 'Keep practicing! You are awesome!'];
    setTimeout(() => speak(msgs[Math.floor(Math.random() * msgs.length)]), 500);
  }, []);

  const stars = score >= 150 ? '⭐⭐⭐' : score >= 80 ? '⭐⭐' : '⭐';

  return (
    <div className={`game-over ${won ? 'win' : 'lose'}`}>
      {won && <Confetti />}
      <div className="go-emoji">{won ? '🏆' : '💪'}</div>
      <div className="go-msg">{won ? 'Amazing!' : 'Keep Trying!'}</div>
      <div className="go-box">
        <div className="go-label">Score</div>
        <div className="go-score">{score}</div>
        <div className="go-stars">{stars}</div>
      </div>
      <button className="btn-again" onClick={onPlayAgain}>🎈 Play Again!</button>
    </div>
  );
}

// ── Confetti ─────────────────────────────────────────────────

function Confetti() {
  const pieces = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    left: rand(0, 100),
    delay: rand(0, 2),
    dur: rand(2, 4),
    em: ['⭐','🎊','🎉','💖','✨','🌟'][i % 6],
  }));
  return (
    <>
      {pieces.map(p => (
        <div key={p.id} className="confetti"
          style={{ left: `${p.left}%`, animationDuration: `${p.dur}s`, animationDelay: `${p.delay}s` }}>
          {p.em}
        </div>
      ))}
    </>
  );
}

// ── Single Balloon ────────────────────────────────────────────

function Balloon({ data, onPop, onMiss }) {
  const wrapRef  = useRef(null);
  const doneRef  = useRef(false);
  const c  = BALLOON_COLORS[data.colorIdx % BALLOON_COLORS.length];
  const em = BALLOON_EMOJIS[data.emojiIdx % BALLOON_EMOJIS.length];
  const sz = c.size;

  // Detect when balloon floats off the top → miss
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const handler = () => {
      if (!doneRef.current) { doneRef.current = true; onMiss(data.id); }
    };
    el.addEventListener('animationend', handler);
    return () => el.removeEventListener('animationend', handler);
  }, []);

  const handleClick = e => {
    e.stopPropagation();
    if (doneRef.current) return;
    doneRef.current = true;
    onPop(data.id);
  };

  return (
    <div
      ref={wrapRef}
      className="balloon-wrap"
      data-bid={data.id}
      style={{ left: `${data.x}%`, animationDuration: `${data.speed}ms` }}
    >
      <div className="balloon-sway" style={{ animationDuration: `${1.2 + Math.random() * 0.8}s` }}>
        <div
          className="balloon-body"
          style={{ background: c.bg, width: sz, height: sz * 1.18 }}
          onClick={handleClick}
        >
          <div className="balloon-shine" />
          <span className="balloon-emoji" style={{ fontSize: sz * 0.35 }}>{em}</span>
        </div>
        <div className="balloon-tie"   style={{ background: c.tie, width: 6, height: 10 }} />
        <div className="balloon-string" style={{ height: 48 }} />
      </div>
    </div>
  );
}

// ── Game Screen ───────────────────────────────────────────────

function GameScreen({ onGameOver }) {
  const [balloons, setBalloons]   = useState([]);
  const [score,    setScore]      = useState(0);
  const [level,    setLevel]      = useState(1);
  const [lives,    setLives]      = useState(3);
  const [pops,     setPops]       = useState(0);
  const [feedback, setFeedback]   = useState(null);
  const [feedKey,  setFeedKey]    = useState(0);
  const [showLvUp, setShowLvUp]   = useState(false);
  const [flashing, setFlashing]   = useState(false);
  const [loading,  setLoading]    = useState(true);
  const [loadErr,  setLoadErr]    = useState('');
  const [timeLeft, setTimeLeft]   = useState(GAME_SECONDS);
  const [handPos,  setHandPos]    = useState(null);
  const [gesture,  setGesture]    = useState('none');
  const [sparks,   setSparks]     = useState([]);
  const [muted,    setMuted]      = useState(false);

  // Refs for closures
  const scoreRef    = useRef(0);
  const levelRef    = useRef(1);
  const livesRef    = useRef(3);
  const popsRef     = useRef(0);
  const activeRef   = useRef(true);
  const spawnTimer  = useRef(null);
  const comboRef    = useRef(0);
  const lastPopTime = useRef(0);
  const balloonsRef = useRef([]);
  const gestureRef  = useRef('none');
  const handPosRef  = useRef(null);

  // Keep refs in sync
  useEffect(() => { balloonsRef.current = balloons; }, [balloons]);
  useEffect(() => { gestureRef.current  = gesture;  }, [gesture]);
  useEffect(() => { handPosRef.current  = handPos;  }, [handPos]);

  // Show a feedback pop-up message
  const showFeedback = (text, color) => {
    setFeedback({ text, color });
    setFeedKey(k => k + 1);
    setTimeout(() => setFeedback(null), 900);
  };

  // Create spark particles at a position
  const addSparks = (px, py) => {
    const pts = Array.from({ length: 9 }, (_, i) => {
      const angle = (i / 9) * Math.PI * 2;
      const dist  = 50 + Math.random() * 50;
      return {
        id: uid(), px, py,
        dx: Math.cos(angle) * dist,
        dy: Math.sin(angle) * dist,
        em: ['✨','⭐','💥','🌟','🎊','💫'][Math.floor(Math.random() * 6)],
      };
    });
    setSparks(s => [...s, ...pts]);
    setTimeout(() => setSparks(s => s.filter(p => !pts.some(q => q.id === p.id))), 700);
  };

  // Handle balloon miss (floated away)
  const handleMiss = useCallback(id => {
    if (!activeRef.current) return;
    setBalloons(prev => prev.filter(b => b.id !== id));
    livesRef.current--;
    setLives(livesRef.current);
    comboRef.current = 0;
    window.SoundManager.miss();
    showFeedback('😢', '#FF4444');
    setFlashing(true);
    setTimeout(() => setFlashing(false), 400);
    const enc = ['Try again!', 'You can do it!', 'Go go go!'];
    speak(enc[Math.floor(Math.random() * enc.length)]);
    if (livesRef.current <= 0) {
      activeRef.current = false;
      window.SoundManager.stopBg();
      setTimeout(() => onGameOver(scoreRef.current, false), 700);
    }
  }, [onGameOver]);

  // Handle balloon pop (clicked or hand touch)
  const handlePop = useCallback((id, px, py) => {
    if (!activeRef.current) return;
    setBalloons(prev => prev.filter(b => b.id !== id));
    window.SoundManager.pop();

    const now     = Date.now();
    const isCombo = (now - lastPopTime.current) < 1500;
    lastPopTime.current = now;
    if (isCombo) comboRef.current++;
    else         comboRef.current = 0;

    const gain = 10 * levelRef.current + (comboRef.current > 1 ? comboRef.current * 5 : 0);
    scoreRef.current += gain;
    setScore(scoreRef.current);
    popsRef.current++;
    setPops(popsRef.current);

    if (comboRef.current > 1) {
      showFeedback(`🔥 x${comboRef.current}`, '#9C27B0');
      speak('Combo!');
    } else {
      const cheers = ['Pop!', 'Great!', 'Yes!', 'Wow!'];
      showFeedback('🎉 Pop!', '#FF6B6B');
      speak(cheers[Math.floor(Math.random() * cheers.length)]);
    }

    if (px !== undefined) addSparks(px, py);

    // Level up?
    if (popsRef.current >= POPS_PER_LEVEL * levelRef.current) {
      levelRef.current++;
      setLevel(levelRef.current);
      setShowLvUp(true);
      window.SoundManager.levelUp();
      speak(`Level ${levelRef.current}! Amazing!`);
      setTimeout(() => setShowLvUp(false), 2200);
      restartSpawner();
    }
  }, []);

  // Spawn a new balloon
  const spawnBalloon = useCallback(() => {
    if (!activeRef.current) return;
    const cfg = getLevelConfig(levelRef.current);
    setBalloons(prev => {
      if (prev.length >= cfg.maxBalloons) return prev;
      return [...prev, {
        id:       uid(),
        x:        rand(8, 80),
        speed:    cfg.speed + rand(-600, 600),
        colorIdx: Math.floor(Math.random() * BALLOON_COLORS.length),
        emojiIdx: Math.floor(Math.random() * BALLOON_EMOJIS.length),
      }];
    });
  }, []);

  // Restart the spawn interval (called on level up)
  const restartSpawner = useCallback(() => {
    if (spawnTimer.current) clearInterval(spawnTimer.current);
    const cfg = getLevelConfig(levelRef.current);
    spawnTimer.current = setInterval(spawnBalloon, cfg.spawnMs);
  }, [spawnBalloon]);

  // ── Poll HandTracker every 50ms ──────────────────────────
  useEffect(() => {
    const poll = setInterval(() => {
      const ht = window.HandTracker?.state;
      if (!ht) return;

      setHandPos(ht.x !== null ? { x: ht.x, y: ht.y } : null);
      setGesture(ht.gesture);

      // Collision: open palm touching a balloon
      if (ht.gesture === 'open' && ht.x !== null && activeRef.current) {
        balloonsRef.current.forEach(b => {
          const el = document.querySelector(`[data-bid="${b.id}"]`);
          if (!el) return;
          const r  = el.getBoundingClientRect();
          const cx = r.left + r.width  / 2;
          const cy = r.top  + r.height / 2;
          if (Math.hypot(ht.x - cx, ht.y - cy) < 72) {
            handlePop(b.id, cx, cy);
          }
        });
      }
    }, 50);
    return () => clearInterval(poll);
  }, [handlePop]);

  // ── Wait for HandTracker to be ready, then start game ───
  useEffect(() => {
    const check = setInterval(() => {
      const ht = window.HandTracker?.state;
      if (ht && ht.ready) {
        clearInterval(check);
        setLoadErr(ht.error || '');
        setLoading(false);
        window.SoundManager.startBg();
        setTimeout(spawnBalloon, 500);
        restartSpawner();
      }
    }, 200);
    return () => clearInterval(check);
  }, [spawnBalloon, restartSpawner]);

  // ── Countdown timer ──────────────────────────────────────
  useEffect(() => {
    const t = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === 20) speak('Twenty seconds left!');
        if (prev === 10) speak('Ten seconds! Hurry!');
        if (prev <= 1) {
          clearInterval(t);
          activeRef.current = false;
          window.SoundManager.stopBg();
          setTimeout(() => onGameOver(scoreRef.current, scoreRef.current >= 50), 700);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      clearInterval(t);
      if (spawnTimer.current) clearInterval(spawnTimer.current);
    };
  }, [onGameOver]);

  // ── Gesture indicator info ───────────────────────────────
  const gestureInfo = {
    open:    { icon: '🖐️', text: 'POP!',      color: '#4CAF50' },
    closed:  { icon: '✊',  text: 'Open hand', color: '#FF9800' },
    partial: { icon: '🤚', text: 'Almost!',   color: '#2196F3' },
    none:    { icon: '👋', text: 'Show hand', color: '#aaa'    },
  }[gesture];

  const livesStr = [0,1,2].map(i => i < lives ? '❤️' : '🖤').join('');
  const popsNeeded = POPS_PER_LEVEL * level;

  return (
    <div className="game">
      {/* Background */}
      <div className="cloud" style={{ top: '8%',  animationDuration: '28s', animationDelay: '-5s'  }}>☁️</div>
      <div className="cloud" style={{ top: '18%', animationDuration: '38s', animationDelay: '-18s' }}>☁️</div>
      <div className="cloud" style={{ top: '12%', animationDuration: '46s', animationDelay: '-28s' }}>☁️</div>
      <div className="sun">☀️</div>
      <div className="grass" />

      {/* Timer strip */}
      <div className="timer-strip">
        <div className="timer-fill" style={{
          width: `${(timeLeft / GAME_SECONDS) * 100}%`,
          background: timeLeft < 15
            ? 'linear-gradient(90deg,#FF4444,#FF6B6B)'
            : 'linear-gradient(90deg,#FF6B6B,#FFD700)',
        }} />
      </div>

      {/* Mute */}
      <button className="mute-btn" onClick={() => setMuted(window.SoundManager.toggleMute())}>
        {muted ? '🔇' : '🔊'}
      </button>

      {/* HUD */}
      <div className="hud">
        <div className="hcard">
          <span className="ico">⭐</span>
          <div className="val red">{score}</div>
        </div>
        <div className="hcard">
          <span className="ico">🏅</span>
          <div className="val gold">{level}</div>
        </div>
        <div className="hcard">
          <span className="ico">❤️</span>
          <div className="val sm">{livesStr}</div>
        </div>
        <div className="hcard">
          <span className="ico">⏱️</span>
          <div className="val blue" style={{
            color: timeLeft < 15 ? '#FF4444' : '#2196F3',
            animation: timeLeft < 15 ? 'wiggle 0.5s ease-in-out infinite' : 'none',
          }}>
            {timeLeft}
          </div>
        </div>
        <div className="hcard">
          <span className="ico">🎯</span>
          <div className="val" style={{ fontSize: '0.95rem', color: '#7C3AED' }}>{pops}/{popsNeeded}</div>
        </div>
      </div>

      {/* Balloons */}
      {balloons.map(b => (
        <Balloon
          key={b.id}
          data={b}
          onPop={id => {
            const el = document.querySelector(`[data-bid="${id}"]`);
            let cx = window.innerWidth / 2, cy = window.innerHeight / 2;
            if (el) {
              const r = el.getBoundingClientRect();
              cx = r.left + r.width  / 2;
              cy = r.top  + r.height / 2;
            }
            handlePop(id, cx, cy);
          }}
          onMiss={handleMiss}
        />
      ))}

      {/* Spark particles */}
      {sparks.map(p => (
        <div key={p.id} className="spark"
          style={{ left: p.px, top: p.py, '--dx': `${p.dx}px`, '--dy': `${p.dy}px`, fontSize: '1.5rem' }}>
          {p.em}
        </div>
      ))}

      {/* Hand cursor */}
      {handPos && (
        <div className="hand-cursor" style={{
          left: handPos.x,
          top:  handPos.y,
          fontSize: gesture === 'open' ? '4rem' : '3rem',
          transform: `translate(-50%, -50%) ${gesture === 'open' ? 'scale(1.25)' : 'scale(1)'}`,
        }}>
          {gesture === 'open' ? '🖐️' : gesture === 'closed' ? '✊' : '✋'}
        </div>
      )}

      {/* Feedback pop */}
      {feedback && (
        <div key={feedKey} className="feedback" style={{ color: feedback.color }}>
          {feedback.text}
        </div>
      )}

      {/* Level up banner */}
      {showLvUp && (
        <div className="level-up">🎊 Level {level}! 🎊</div>
      )}

      {/* Red flash on miss */}
      <div className={`flash${flashing ? ' on' : ''}`} />

      {/* Gesture indicator */}
      <div className={`gesture-box${gesture !== 'none' ? ' active' : ''}`}
        style={{ borderTopColor: gestureInfo.color }}>
        <span className="g-ico">{gestureInfo.icon}</span>
        <span className="g-txt" style={{ color: gestureInfo.color }}>{gestureInfo.text}</span>
      </div>

      {/* Loading / error overlay */}
      {loading && (
        <div className="loading">
          <div className="spin">🎈</div>
          {loadErr
            ? <>
                <p>{loadErr}</p>
                <button className="btn-mouse" onClick={() => {
                  setLoading(false);
                  window.SoundManager.startBg();
                  setTimeout(spawnBalloon, 400);
                  restartSpawner();
                }}>🖱️ Use Mouse!</button>
              </>
            : <p>📷 Starting camera…</p>
          }
        </div>
      )}
    </div>
  );
}

// ── App – screen routing ─────────────────────────────────────

function App() {
  const [screen,  setScreen]  = useState('welcome');
  const [score,   setScore]   = useState(0);
  const [won,     setWon]     = useState(false);
  const [gameKey, setGameKey] = useState(0);

  const handleStart = () => {
    window.SoundManager.unlock();
    setGameKey(k => k + 1);
    setScreen('game');
    speak("Go! Pop the balloons!");
  };

  const handleGameOver = (finalScore, didWin) => {
    setScore(finalScore);
    setWon(didWin);
    window.SoundManager.cheer();
    setScreen('over');
  };

  const handlePlayAgain = () => {
    window.SoundManager.unlock();
    setGameKey(k => k + 1);
    setScreen('game');
    speak("Let's go! Pop those balloons!");
  };

  return (
    <>
      {screen === 'welcome' && <WelcomeScreen onStart={handleStart} />}
      {screen === 'game'    && <GameScreen key={gameKey} onGameOver={handleGameOver} />}
      {screen === 'over'    && <GameOverScreen score={score} won={won} onPlayAgain={handlePlayAgain} />}
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
