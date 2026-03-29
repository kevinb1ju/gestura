import { useEffect, useRef } from "react";

export default function Level1Music() {
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio("/music/level1.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = 0.25;

    const startMusic = () => {
      audioRef.current.play().catch(() => {});
      window.removeEventListener("click", startMusic);
      window.removeEventListener("touchstart", startMusic);
    };

    window.addEventListener("click", startMusic);
    window.addEventListener("touchstart", startMusic);

    return () => {
      window.removeEventListener("click", startMusic);
      window.removeEventListener("touchstart", startMusic);
      audioRef.current?.pause();
    };
  }, []);

  return null;
}
