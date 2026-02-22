
import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useHoverHold } from '../hooks/useHoverHold';
import { useHandTracking } from '../context/HandTrackingContext';

const Shape = ({ type, color, size = 250, x, delay = 0, onSelect }) => {
    const shapeRef = useRef(null);
    const { cursorPosition, isHandDetected } = useHandTracking();
    const { isHovering, progress, startHover, endHover } = useHoverHold(2000, onSelect);

    // Check collision with "virtual cursor" (index finger)
    useEffect(() => {
        // If no hand is detected, we rely purely on mouse events
        if (!shapeRef.current || !isHandDetected) {
            return;
        }

        const rect = shapeRef.current.getBoundingClientRect();
        const cx = cursorPosition.x;
        const cy = cursorPosition.y;

        // Expand detection area for easier interaction with hand
        // Larger padding for larger shapes
        const padding = 40;
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

    const getShapePath = () => {
        switch (type) {
            case 'circle':
                return <circle cx="50" cy="50" r="45" />;
            case 'square':
                return <rect x="5" y="5" width="90" height="90" rx="10" />;
            case 'triangle':
                return <polygon points="50,5 95,90 5,90" />;
            case 'rectangle':
                return <rect x="5" y="25" width="90" height="50" rx="10" />;
            default:
                return <circle cx="50" cy="50" r="45" />;
        }
    };

    return (
        <motion.div
            ref={shapeRef}
            className="absolute cursor-pointer touch-none"
            style={{
                left: x,
                width: size,
                height: size,
                zIndex: 50,
            }}
            initial={{ y: -300, opacity: 1 }} // Start above screen
            animate={{
                y: window.innerHeight + 300, // Fall to below screen
                rotate: [0, 5, -5, 0] // Gentle wobble
            }}
            transition={{
                y: {
                    repeat: Infinity,
                    duration: 15, // Slow fall
                    ease: "linear",
                    delay: delay // Staggered start
                },
                rotate: {
                    repeat: Infinity,
                    duration: 4,
                    ease: "easeInOut"
                }
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl" style={{ overflow: 'visible' }}>
                <motion.g
                    fill={color}
                    stroke="white"
                    strokeWidth="3"
                    animate={{
                        filter: isHovering ? "drop-shadow(0 0 25px rgba(255,255,255,1))" : "drop-shadow(0 0 0px rgba(0,0,0,0))",
                        scale: isHovering ? 1.1 : 1
                    }}
                >
                    {getShapePath()}
                </motion.g>

                {/* Progress Ring */}
                {isHovering && (
                    <circle
                        cx="50"
                        cy="50"
                        r="48"
                        fill="none"
                        stroke="white"
                        strokeWidth="6"
                        strokeDasharray="301.59"
                        strokeDashoffset={301.59 - (301.59 * progress) / 100}
                        strokeLinecap="round"
                        className="transition-all duration-100 ease-linear"
                        transform="rotate(-90 50 50)"
                    />
                )}
            </svg>
        </motion.div>
    );
};

export default Shape;
