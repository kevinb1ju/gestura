import { useEffect, useRef, useState } from "react";
import Bogey from "../../components/train/Bogey";
import { speak } from "../../utils/speak";
import "./Level2.css";
import Level2Music from "../../components/common/Level2Music";

const numbers = [6, 7, 8, 9, 10];

export default function Level2({ onComplete = () => { } }) {
  const [index, setIndex] = useState(0);
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [locked, setLocked] = useState(false);
  const [hoverIndex, setHoverIndex] = useState(null);
  const [score, setScore] = useState(0);
  /* =========================
     DEBUG MOUNT
     ========================= */
  useEffect(() => {
    console.log("Level2 mounted!");
  }, []);

  const [completed, setCompleted] = useState(false);

  const optionRefs = useRef([]);
  const dwellTimer = useRef(null);

  const target = numbers[index];

  /* =========================
     GENERATE OPTIONS
     ========================= */
  useEffect(() => {
    if (completed) return;

    setSelected(null);
    setLocked(false);
    setHoverIndex(null);

    const correct = target;
    // ensure unique wrong answers around the target
    let wrong1 = correct - 1;
    let wrong2 = correct + 1;

    // adjust if outside logical bounds, though 5-11 is fine for 6-10 range

    const shuffled = [correct, wrong1, wrong2].sort(
      () => Math.random() - 0.5
    );

    setOptions(shuffled);
    speak(`Hover over the bogey with ${correct} apples`);
  }, [target, completed]);

  /* =========================
     HAND HOVER LOGIC
     ========================= */
  useEffect(() => {
    if (completed) return;

    const interval = setInterval(() => {
      if (!window.handCursor || locked) return;

      const { x, y } = window.handCursor;

      optionRefs.current.forEach((el, i) => {
        if (!el) return;

        const rect = el.getBoundingClientRect();
        const inside =
          x >= rect.left &&
          x <= rect.right &&
          y >= rect.top &&
          y <= rect.bottom;

        if (inside) {
          setHoverIndex(i);

          if (!dwellTimer.current) {
            dwellTimer.current = setTimeout(() => {
              handleSelect(options[i]);
              dwellTimer.current = null;
            }, 1000);
          }
        } else if (hoverIndex === i) {
          setHoverIndex(null);
          if (dwellTimer.current) {
            clearTimeout(dwellTimer.current);
            dwellTimer.current = null;
          }
        }
      });
    }, 80);

    return () => clearInterval(interval);
  }, [options, locked, hoverIndex, completed]);

  /* =========================
     HANDLE SELECT (GAME ONLY)
     ========================= */
  const handleSelect = (count) => {
    if (locked || completed) return;

    setLocked(true);
    setSelected(count);

    if (count === target) {
      setScore((prev) => prev + 10);
      speak("Correct!");

      setTimeout(() => {
        setIndex((prev) =>
          prev === numbers.length - 1 ? 0 : prev + 1
        );
        setSelected(null);
        setLocked(false);
      }, 1200);
    } else {
      setScore((prev) => Math.max(0, prev - 5));
      speak("Try again");

      setTimeout(() => {
        setSelected(null);
        setLocked(false);
      }, 1000);
    }
  };

  /* =========================
     LEVEL COMPLETE (SAFE)
     ========================= */
  useEffect(() => {
    if (score >= 100 && !completed) {
      setCompleted(true);
      window.speechSynthesis.cancel();
      speak("Level 2 completed! Awesome!");
    }
  }, [score, completed]);

  /* =========================
     COMPLETION SCREEN
     ========================= */
  if (completed) {
    return (
      <div className="level2-complete-screen">
        <div className="celebration-card wizard-theme">
          <div className="magic-particles">
            <span className="particle">✨</span>
            <span className="particle">✨</span>
            <span className="particle">✨</span>
            <span className="particle">✨</span>
            <span className="particle">✨</span>
          </div>

          <div className="trophy-container">
            <div className="glow-circle"></div>
            <svg className="trophy-icon" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#FFD700', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#FFA500', stopOpacity: 1 }} />
                </linearGradient>
              </defs>
              <path fill="url(#goldGrad)" d="M30,15 h40 l-5,30 h-30 z" /> {/* Cup */}
              <path fill="none" stroke="#FFA500" strokeWidth="3" d="M30,15 q-15,0 -15,15 q0,15 15,10" /> {/* Left Handle */}
              <path fill="none" stroke="#FFA500" strokeWidth="3" d="M70,15 q15,0 15,15 q0,15 -15,10" /> {/* Right Handle */}
              <rect x="45" y="45" width="10" height="20" fill="#DAA520" /> {/* Stem */}
              <rect x="35" y="65" width="30" height="10" fill="#8B4513" rx="2" /> {/* Base */}
              <path fill="#FFF" opacity="0.4" d="M35,15 l5,30 h5 l-5,-30 z" /> {/* Shine */}
            </svg>
          </div>

          <h2 className="premium-text wizard-text">Math Wizard!</h2>
          <div className="badges">
            <span className="badge">🧙‍♂️</span>
            <span className="badge">🏆</span>
            <span className="badge">🔢</span>
          </div>
          <p className="premium-subtext wizard-subtext">Level 2 Conquered</p>

          <button
            className="finish-game-btn"
            onClick={onComplete}
          >
            Finish Game 🏆
          </button>
        </div>
      </div>
    );
  }

  /* =========================
     RENDER GAME
     ========================= */
  return (
    <div className="level2-scene">
      <Level2Music />

      <div className="level2-number">{target}</div>

      <div className="level2-instruction">
        Hover over the bogey with {target} apples
      </div>

      <div className="score-board">
        Score: <strong>{score}</strong>
      </div>

      <div className="level2-options">
        {options.map((count, i) => (
          <div
            key={i}
            ref={(el) => (optionRefs.current[i] = el)}
            className={`
              level2-option
              ${hoverIndex === i ? "hovering" : ""}
              ${selected === count
                ? count === target
                  ? "correct"
                  : "wrong"
                : ""
              }
            `}
          >
            <Bogey count={count} object="🍎" show />
          </div>
        ))}
      </div>
    </div>
  );
}
