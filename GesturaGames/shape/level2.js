
const shapes = [
    { name: 'circle', display: '<div class="circle-shape"></div>' },
    { name: 'square', display: '<div class="square-shape"></div>' },
    { name: 'triangle', display: '<div class="triangle-shape"></div>' },
    { name: 'rectangle', display: '<div class="rectangle-shape"></div>' }
];

let score = 0;
let fallingShapes = [];
let level2LoopId = null;
let spawnIntervalId = null;

// Camera variables
let hands = null;
let camera = null;
let gameVideoElement = null;
let gameCanvasElement = null;
let gameCanvasCtx = null;
let gameFingerPointer = null;

window.addEventListener('DOMContentLoaded', () => {
    // Get score from URL
    const urlParams = new URLSearchParams(window.location.search);
    const startScore = parseInt(urlParams.get('score')) || 50;
    score = startScore;
    document.getElementById('level2-score').textContent = `⭐ Score: ${score}`;

    const music = document.getElementById('bg-music');
    if (music) {
        music.volume = 0.2;
        music.play().catch(e => {
            console.log("Audio play failed, waiting for interaction:", e);
            document.body.addEventListener('click', () => music.play(), { once: true });
        });
    }

    initializeGameCamera();

    // Level 2 Intro Audio
    const utterance = new SpeechSynthesisUtterance("Level 2! Catch the falling shapes!");
    utterance.rate = 0.9;
    utterance.pitch = 1.2;
    speechSynthesis.speak(utterance);

    // Start Game Loop
    setTimeout(() => {
        document.getElementById('level2-message').style.display = 'none';
        spawnIntervalId = setInterval(spawnShape, 1500);
        level2LoopId = requestAnimationFrame(updateLevel2);
    }, 2000);
});

function initializeGameCamera() {
    gameVideoElement = document.getElementById('game-camera-video');
    gameCanvasElement = document.getElementById('game-camera-canvas');
    gameCanvasCtx = gameCanvasElement.getContext('2d');
    gameFingerPointer = document.getElementById('game-finger-pointer');

    hands = new Hands({
        locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
        }
    });

    hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });

    hands.onResults(onHandsResults);

    camera = new Camera(gameVideoElement, {
        onFrame: async () => {
            await hands.send({ image: gameVideoElement });
        },
        width: 640,
        height: 480
    });

    camera.start().then(() => {
        // Camera started
        gameVideoElement.addEventListener('loadedmetadata', () => {
            gameCanvasElement.width = gameVideoElement.videoWidth;
            gameCanvasElement.height = gameVideoElement.videoHeight;
        }, { once: true });
    });
}

function onHandsResults(results) {
    gameCanvasCtx.save();
    gameCanvasCtx.clearRect(0, 0, gameCanvasElement.width, gameCanvasElement.height);
    gameCanvasCtx.drawImage(results.image, 0, 0, gameCanvasElement.width, gameCanvasElement.height);

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const landmarks = results.multiHandLandmarks[0];
        const indexFingerTip = landmarks[8];

        if (typeof drawConnectors !== 'undefined') {
            drawConnectors(gameCanvasCtx, landmarks, HAND_CONNECTIONS, { color: '#4ECDC4', lineWidth: 4 });
            drawLandmarks(gameCanvasCtx, landmarks, { color: '#FF6B6B', lineWidth: 2, radius: 5 });
        }

        handleLevel2Gesture(indexFingerTip);
    } else {
        if (gameFingerPointer) gameFingerPointer.style.display = 'none';
    }
    gameCanvasCtx.restore();
}

function handleLevel2Gesture(indexFingerTip) {
    if (!gameVideoElement || !gameFingerPointer) return;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const screenX = (1 - indexFingerTip.x) * viewportWidth;
    const screenY = indexFingerTip.y * viewportHeight;

    gameFingerPointer.style.left = screenX + 'px';
    gameFingerPointer.style.top = screenY + 'px';
    gameFingerPointer.style.display = 'block';

    fallingShapes.forEach(shape => {
        if (shape.caught) return;

        const rect = shape.element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const dist = Math.hypot(screenX - centerX, screenY - centerY);

        if (dist < 50) {
            catchShape(shape);
        }
    });
}

function spawnShape() {
    const shapeTypes = ['circle', 'square', 'triangle', 'rectangle'];
    const type = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
    const shapeObj = shapes.find(s => s.name === type);

    const el = document.createElement('div');
    el.className = 'falling-shape';
    el.innerHTML = shapeObj.display;
    el.dataset.type = type;

    const left = 10 + Math.random() * 80;
    el.style.left = `${left}%`;

    document.getElementById('level2-area').appendChild(el);
    fallingShapes.push({
        element: el,
        y: -50,
        speed: 1 + Math.random() * 2,
        caught: false
    });
}

function updateLevel2() {
    fallingShapes.forEach((shape, index) => {
        if (shape.caught) return;

        shape.y += shape.speed;
        shape.element.style.top = `${shape.y}px`;

        if (shape.y > 500) {
            shape.element.remove();
            fallingShapes.splice(index, 1);
        }
    });

    level2LoopId = requestAnimationFrame(updateLevel2);
}

function catchShape(shape) {
    shape.caught = true;
    shape.element.classList.add('caught');
    playSound('selection');

    score += 5;
    document.getElementById('level2-score').textContent = `⭐ Score: ${score}`;

    setTimeout(() => {
        if (shape.element.parentNode) {
            shape.element.remove();
        }
        const idx = fallingShapes.indexOf(shape);
        if (idx > -1) fallingShapes.splice(idx, 1);
    }, 200);

    if (score >= 200) {
        winLevel2();
    }
}

function winLevel2() {
    clearInterval(spawnIntervalId);
    cancelAnimationFrame(level2LoopId);

    fallingShapes.forEach(s => s.element.remove());
    fallingShapes = [];

    document.getElementById('level2-phase').classList.remove('active');
    document.getElementById('victory-phase').classList.add('active');
    document.getElementById('final-score').textContent = score;
    playSound('win');
}

function playSound(type) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    if (type === 'selection') {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 600;
        oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1);
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    } else if (type === 'win') {
        const notes = [523, 659, 784, 1047, 784, 1047];
        notes.forEach((freq, index) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = freq;
            oscillator.type = 'square';
            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime + index * 0.12);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + index * 0.12 + 0.3);

            oscillator.start(audioContext.currentTime + index * 0.12);
            oscillator.stop(audioContext.currentTime + index * 0.12 + 0.3);
        });
    }
}
