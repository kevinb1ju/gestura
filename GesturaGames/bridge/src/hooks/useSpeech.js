
import { useCallback } from 'react';

export const useSpeech = () => {
    const speak = useCallback((text) => {
        if (!window.speechSynthesis) return;

        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9; // Slightly slower for kids
        utterance.pitch = 1.1; // Slightly higher pitch for friendliness
        utterance.volume = 1;

        window.speechSynthesis.speak(utterance);
    }, []);

    return { speak };
};
