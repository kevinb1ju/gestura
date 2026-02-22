import { useEffect, useRef } from "react";

export default function Level2Music() {
    const audioRef = useRef(null);

    useEffect(() => {
        // using bg.mp3 for level 2 since level2.mp3 does not exist
        audioRef.current = new Audio("/music/bg.mp3");
        audioRef.current.loop = true;
        audioRef.current.volume = 0.25;

        const startMusic = () => {
            audioRef.current.play().catch(() => { });
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
