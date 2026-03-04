import { useEffect, useRef, useState } from "react";
import Bogey from "../../components/train/Bogey";
import { speak } from "../../utils/speak";
import "./Level1.css";
import Level1Music from "../../components/common/Level1Music";

const numbers = [1, 2, 3, 4, 5];

export default function Level1({ onComplete = () => { }, onFail = () => { } }) {
  const [index, setIndex] = useState(0);
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [locked, setLocked] = useState(false);
  const [hoverIndex, setHoverIndex] = useState(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    // Initialize Game Tracker for Level 1
    const getStudentData = () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const urlStudentId = urlParams.get('studentId');
        if (urlStudentId) return urlStudentId;
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        return user.studentId || 'DEMO_STUDENT';
      } catch (e) {
        return 'DEMO_STUDENT';
      }
    };
    if (window.GameTracker) {
      window.GameTracker.setupNumberAdventures(getStudentData());
    }
  }, []);

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
    const wrong1 = Math.max(1, correct - 1);
    const wrong2 = correct + 1;

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

      if (window.GameTracker) {
        window.GameTracker.recordCorrect({
          number: target,
          reaction_time: Math.random() * 3 + 1,
          accuracy: 'high'
        });
        window.GameTracker.recordPattern({ pattern: 'counting', success: true });
      }

      setTimeout(() => {
        setIndex((prev) =>
          prev === numbers.length - 1 ? 0 : prev + 1
        );
        setSelected(null);
        setLocked(false);
      }, 1200);
    } else {
      setScore((prev) => Math.max(0, prev - 5));
      setLives((prev) => prev - 1);
      speak("Try again");

      if (window.GameTracker) {
        window.GameTracker.recordIncorrect({
          selected: count,
          target: target,
          reaction_time: Math.random() * 4 + 1,
          accuracy: 'low'
        });
        window.GameTracker.recordPersistence({ attempt: 'try_again', motivation: 'high' });
      }

      setTimeout(() => {
        setSelected(null);
        setLocked(false);
      }, 1000);
    }
  };

  /* =========================
     LEVEL COMPLETE / FAIL (SAFE)
     ========================= */
  useEffect(() => {
    if (lives <= 0 && !completed) {
      setCompleted(true);
      window.speechSynthesis.cancel();
      speak("Game Over. Out of lives.");

      if (window.GameTracker) {
        window.GameTracker.end();
      }
      setTimeout(onFail, 2000);
    }
    else if (score >= 100 && !completed) {
      setCompleted(true);
      window.speechSynthesis.cancel();
      speak("Level successfully completed");
      console.log("Level complete. Waiting for user to proceed.");

      if (window.GameTracker) {
        window.GameTracker.end();
      }
    }
  }, [score, lives, completed, onFail, onComplete]);

  /* =========================
     COMPLETION SCREEN
     ========================= */
  if (completed) {
    return (
      <div className="level1-complete-screen">
        <div className="celebration-card">
          <div className="sun-rays"></div>
          <div className="clouds">
            <svg className="cloud cloud-1" viewBox="0 0 24 24"><path fill="#fff" d="M18.5,12c-0.3,0-0.6,0.1-0.9,0.1C17.2,8.6,14,6,10.5,6C6.4,6,3,9.4,3,13.5C3,13.7,3,13.8,3,14c-1.7,0.4-3,2-3,3.8c0,2.1,1.7,3.8,3.8,3.8h14.8c2.4,0,4.4-2,4.4-4.4S20.9,12.9,18.5,12z" /></svg>
            <svg className="cloud cloud-2" viewBox="0 0 24 24"><path fill="#fff" d="M18.5,12c-0.3,0-0.6,0.1-0.9,0.1C17.2,8.6,14,6,10.5,6C6.4,6,3,9.4,3,13.5C3,13.7,3,13.8,3,14c-1.7,0.4-3,2-3,3.8c0,2.1,1.7,3.8,3.8,3.8h14.8c2.4,0,4.4-2,4.4-4.4S20.9,12.9,18.5,12z" /></svg>
          </div>

          <div className="icon-container">
            <svg className="apple-icon" viewBox="0 0 100 100">
              <path fill="#FF5252" d="M50,85c-15,0-25-10-25-25c0-20,15-35,25-35s25,15,25,35C75,75,65,85,50,85z" />
              <path fill="#4CAF50" d="M50,25c0,0,10-15,25-10C60,20,50,25,50,25z" />
              <path fill="#795548" d="M50,25v10" stroke="#795548" strokeWidth="3" />
              {/* Cute Face */}
              <circle cx="40" cy="55" r="3" fill="#333" />
              <circle cx="60" cy="55" r="3" fill="#333" />
              <path d="M45,65 q5,5 10,0" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <div className="shine"></div>
          </div>

          <h2 className="premium-text">Splendid!</h2>
          <div className="star-rating">
            <span className="star filled">★</span>
            <span className="star filled">★</span>
            <span className="star filled">★</span>
          </div>
          <p className="premium-subtext">Orchard Master</p>

          <button
            className="next-level-btn"
            onClick={onComplete}
          >
            Proceed to Level 2 ➡
          </button>
        </div>
      </div>
    );

  }

  /* =========================
     RENDER GAME
     ========================= */
  return (
    <div className="level1-scene">
      <Level1Music />

      <div className="level1-number">{target}</div>

      <div className="level1-instruction">
        Hover over the bogey with {target} apples
      </div>

      <div className="score-board">
        Score: <strong>{score}</strong> | Lives: <strong>{lives}</strong>
      </div>

      <div className="level1-options">
        {options.map((count, i) => (
          <div
            key={i}
            ref={(el) => (optionRefs.current[i] = el)}
            className={`
              level1-option
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
