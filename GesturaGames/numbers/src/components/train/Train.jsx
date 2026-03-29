import { useEffect, useRef, useState } from "react";
import Bogey from "./Bogey";
import { speak } from "../../utils/speak";
import "./Train.css";
import BackgroundMusic from "../common/BackgroundMusic";

const data = [
  { value: 1, object: "🍎" },
  { value: 2, object: "🍎" },
  { value: 3, object: "🍎" },
  { value: 4, object: "🍎" },
  { value: 5, object: "🍎" },
  { value: 6, object: "🍎" },
  { value: 7, object: "🍎" },
  { value: 8, object: "🍎" },
  { value: 9, object: "🍎" },
  { value: 10, object: "🍎" },
];

export default function Train({ onNextLevel }) {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState("enter");
  const [finished, setFinished] = useState(false);

  const speechTimerRef = useRef(null);
  const current = data[index] ?? data[data.length - 1];

  /* =========================
     TRAIN PHASE CONTROL
     ========================= */
  useEffect(() => {
    if (finished) return;

    let timer;

    if (phase === "enter") {
      timer = setTimeout(() => setPhase("wait"), 4000);
    }

    if (phase === "wait") {
      const waitTime = current.value * 700 + 1000;
      timer = setTimeout(() => setPhase("exit"), waitTime);
    }

    if (phase === "exit") {
      if (current.value === 10) {
        setFinished(true);
        return;
      }

      timer = setTimeout(() => {
        setIndex((prev) => prev + 1);
        setPhase("enter");
      }, 4000);
    }

    return () => clearTimeout(timer);
  }, [phase, current.value, finished]);

  /* =========================
     SPEAK NUMBER (ONCE ONLY)
     ========================= */
  useEffect(() => {
    if (finished) return;

    if (speechTimerRef.current) {
      clearTimeout(speechTimerRef.current);
    }

    window.speechSynthesis.cancel();

    speechTimerRef.current = setTimeout(() => {
      speak(String(current.value));
    }, 1200);

    return () => clearTimeout(speechTimerRef.current);
  }, [index, finished]);

  /* =========================
     FINAL MESSAGE
     ========================= */
  useEffect(() => {
    if (!finished) return;

    window.speechSynthesis.cancel();

    const t = setTimeout(() => {
      speak("You have learned the numbers. Good job!");
    }, 1200);

    return () => clearTimeout(t);
  }, [finished]);

  /* =========================
     ⭐ SKIP HANDLER (NEW)
     ========================= */
  const handleSkip = () => {
    window.speechSynthesis.cancel();
    onNextLevel && onNextLevel();
  };

  /* =========================
     FINAL SCREEN
     ========================= */
  if (finished) {
    return (
      <div className="train-scene">
        <BackgroundMusic />

        <img
          src="/images/goodjob.jpeg"
          alt="Good job"
          style={{
            width: "320px",
            borderRadius: "20px",
            marginBottom: "24px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
          }}
        />

        <button
          onClick={() => onNextLevel && onNextLevel()}
          style={{
            padding: "14px 28px",
            fontSize: "20px",
            borderRadius: "16px",
            border: "none",
            background: "#4caf50",
            color: "#fff",
            cursor: "pointer",
            boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
          }}
        >
          Go to Level 1 →
        </button>
      </div>
    );
  }

  /* =========================
     NORMAL GAME RENDER
     ========================= */
  return (
    <div className="train-scene">
      <BackgroundMusic />

      <div className="train-number">{current.value}</div>

      {/* ⭐ SKIP BUTTON (NEW) */}
      <button className="skip-btn" onClick={handleSkip}>
        Skip Tutorial →
      </button>

      <div className="background-layer">
        <div className="tree" style={{ left: "8%" }} />
        <div className="tree" style={{ left: "18%" }} />
        <div className="house" style={{ left: "30%" }} />
        <div className="tree" style={{ left: "45%" }} />
        <div className="house" style={{ left: "65%" }} />
        <div className="tree" style={{ left: "78%" }} />
      </div>

      <div className="train-track" />

      <div className={`train ${phase}`} key={`${index}-${phase}`}>
        <Bogey
          count={current.value}
          object={current.object}
          show={phase === "wait"}
        />
      </div>

      <div className="grass" />
    </div>
  );
}
