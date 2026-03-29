
import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useHoverHold } from '../hooks/useHoverHold';
import { useHandTracking } from '../context/HandTrackingContext';

const Flower = ({ color, size = 200, x, delay = 0, onSelect }) => {
    const flowerRef = useRef(null);
    const { cursorPosition, isHandDetected } = useHandTracking();
    const { isHovering, progress, startHover, endHover } = useHoverHold(2000, onSelect);

    // Check collision with "virtual cursor" (index finger)
    useEffect(() => {
        if (!flowerRef.current || !isHandDetected) return;

        const rect = flowerRef.current.getBoundingClientRect();
        const cx = cursorPosition.x;
        const cy = cursorPosition.y;
        const padding = 30;

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

    return (
        <motion.div
            ref={flowerRef}
            className="absolute cursor-pointer touch-none"
            style={{ left: x, width: size, height: size, zIndex: 50 }}
            initial={{ y: -300, opacity: 1, rotate: 0 }}
            animate={{
                y: window.innerHeight + 300,
                rotate: [0, 20, -20, 0]
            }}
            transition={{
                y: { repeat: Infinity, duration: 12, ease: "linear", delay: delay },
                rotate: { repeat: Infinity, duration: 6, ease: "easeInOut" }
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl" style={{ overflow: 'visible' }}>
                <motion.g
                    animate={{
                        scale: isHovering ? 1.2 : 1,
                        filter: isHovering ? "drop-shadow(0 0 20px rgba(255,255,255,0.9))" : "drop-shadow(0 0 0px rgba(0,0,0,0))"
                    }}
                >
                    {/* Stem */}
                    <path d="M50 60 Q 50 80 40 100" stroke="#4CAF50" strokeWidth="4" fill="none" />
                    <path d="M50 60 Q 50 80 60 100" stroke="#4CAF50" strokeWidth="4" fill="none" />

                    {/* Leaves */}
                    <path d="M50 80 Q 30 70 30 80 Q 40 90 50 85" fill="#4CAF50" />
                    <path d="M50 80 Q 70 70 70 80 Q 60 90 50 85" fill="#4CAF50" />

                    {/* Petals */}
                    <g fill={color}>
                        <circle cx="50" cy="35" r="15" />
                        <circle cx="35" cy="50" r="15" />
                        <circle cx="65" cy="50" r="15" />
                        <circle cx="50" cy="65" r="15" />
                        <circle cx="40" cy="40" r="15" />
                        <circle cx="60" cy="40" r="15" />
                        <circle cx="40" cy="60" r="15" />
                        <circle cx="60" cy="60" r="15" />
                    </g>

                    {/* Center */}
                    <circle cx="50" cy="50" r="12" fill="#FFEB3B" stroke="#FBC02D" strokeWidth="2" />
                </motion.g>

                {/* Progress Ring */}
                {isHovering && (
                    <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="white"
                        strokeWidth="6"
                        strokeDasharray="282.7"
                        strokeDashoffset={282.7 - (282.7 * progress) / 100}
                        strokeLinecap="round"
                        className="transition-all duration-100 ease-linear"
                        transform="rotate(-90 50 50)"
                    />
                )}
            </svg>
        </motion.div>
    );
};

export default Flower;
