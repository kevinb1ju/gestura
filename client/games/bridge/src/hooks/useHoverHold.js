
import { useState, useRef, useEffect, useCallback } from 'react';

export const useHoverHold = (holdDuration = 2000, onComplete) => {
    const [isHovering, setIsHovering] = useState(false);
    const [progress, setProgress] = useState(0);
    const startTimeRef = useRef(null);
    const animationFrameRef = useRef(null);
    const onCompleteRef = useRef(onComplete);

    // Keep callback fresh
    useEffect(() => {
        onCompleteRef.current = onComplete;
    }, [onComplete]);

    const updateProgress = useCallback(() => {
        if (!startTimeRef.current) return;

        const elapsed = Date.now() - startTimeRef.current;
        const newProgress = Math.min((elapsed / holdDuration) * 100, 100);

        setProgress(newProgress);

        if (elapsed >= holdDuration) {
            setIsHovering(false);
            setProgress(0);
            startTimeRef.current = null;
            if (onCompleteRef.current) onCompleteRef.current();
        } else {
            animationFrameRef.current = requestAnimationFrame(updateProgress);
        }
    }, [holdDuration]);

    const startHover = useCallback(() => {
        setIsHovering(true);
        startTimeRef.current = Date.now();
        animationFrameRef.current = requestAnimationFrame(updateProgress);
    }, [updateProgress]);

    const endHover = useCallback(() => {
        setIsHovering(false);
        setProgress(0);
        startTimeRef.current = null;
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }
    }, []);

    // Cleanup
    useEffect(() => {
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []);

    return { isHovering, progress, startHover, endHover };
};
