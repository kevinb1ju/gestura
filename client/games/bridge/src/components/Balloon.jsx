
import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useHoverHold } from '../hooks/useHoverHold';
import { useHandTracking } from '../context/HandTrackingContext';

const Balloon = ({ number, color, x, delay = 0, onPop }) => {
    const balloonRef = useRef(null);
    const { cursorPosition, isHandDetected } = useHandTracking();
    const { isHovering, startHover, endHover } = useHoverHold(500, onPop); // Faster pop (0.5s)

    // Check collision with "virtual cursor" (index finger)
    useEffect(() => {
        if (!balloonRef.current || !isHandDetected) return;

        const rect = balloonRef.current.getBoundingClientRect();
        const cx = cursorPosition.x;
        const cy = cursorPosition.y;
        const padding = 20;

        const isColliding =
            cx >= rect.left - padding &&
            cx <= rect.right + padding &&
            cy >= rect.top - padding &&
            cy <= rect.bottom + padding;

        if (isColliding && !isHovering) {
            startHover();
        } else if (!isColliding && isHovering) {
            endHover();
        }
    }, [cursorPosition, isHandDetected, isHovering, startHover, endHover]);

    const handleMouseEnter = () => {
        if (!isHovering) startHover();
    };

    const handleMouseLeave = () => {
        if (isHovering) endHover();
    };

    const handlePointerDown = () => {
        onPop();
    };

    return (
        <motion.div
            ref={balloonRef}
            className="absolute cursor-pointer touch-none select-none"
            style={{
                left: x,
                width: 180,
                height: 220,
                zIndex: 50
            }}
            initial={{ y: window.innerHeight + 200, opacity: 1, scale: 1 }}
            animate={{
                y: -300,
                x: [0, 20, -20, 0],
                scale: 1,
                opacity: 1
            }}
            exit={{
                scale: [1.2, 0], // Blast effect!
                opacity: 0,
                transition: { duration: 0.3 }
            }}
            transition={{
                y: { repeat: Infinity, duration: 10, ease: "linear", delay: delay },
                x: { repeat: Infinity, duration: 4, ease: "easeInOut" }
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onPointerDown={handlePointerDown}
        >
            <div className="relative w-full h-full transform transition-transform hover:scale-110">
                {/* Balloon Body */}
                <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-lg">
                    <path
                        d="M50 2 C 20 2 5 30 5 55 C 5 80 20 100 50 100 C 80 100 95 80 95 55 C 95 30 80 2 50 2 Z"
                        fill={color}
                    />
                    {/* Knot */}
                    <path d="M45 100 L55 100 L50 110 Z" fill={color} />
                    {/* String */}
                    <path d="M50 110 Q 50 125 45 130" stroke="white" strokeWidth="2" fill="none" opacity="0.6" />

                    {/* Shine */}
                    <ellipse cx="30" cy="30" rx="10" ry="20" fill="white" opacity="0.3" transform="rotate(-30 30 30)" />
                </svg>

                {/* Number */}
                <div className="absolute inset-0 flex items-center justify-center pb-6">
                    <span className="text-6xl font-extrabold text-white drop-shadow-md font-game">{number}</span>
                </div>

                {/* Hover Progress */}
                {isHovering && (
                    <motion.div
                        className="absolute inset-0 bg-white/30 rounded-full blur-xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, scale: 1.2 }}
                    />
                )}
            </div>
        </motion.div>
    );
};

export default Balloon;
