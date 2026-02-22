
import { useState, useEffect, useRef } from 'react';

export const useCollision = (targetRef, cursorPosition, onCollisionStart, onCollisionEnd) => {
    const [isColliding, setIsColliding] = useState(false);

    useEffect(() => {
        if (!targetRef.current) return;

        const rect = targetRef.current.getBoundingClientRect();
        const { x, y } = cursorPosition;

        const colliding =
            x >= rect.left &&
            x <= rect.right &&
            y >= rect.top &&
            y <= rect.bottom;

        if (colliding && !isColliding) {
            setIsColliding(true);
            if (onCollisionStart) onCollisionStart();
        } else if (!colliding && isColliding) {
            setIsColliding(false);
            if (onCollisionEnd) onCollisionEnd();
        }
    }, [cursorPosition, isColliding, onCollisionStart, onCollisionEnd]);

    return isColliding;
};
