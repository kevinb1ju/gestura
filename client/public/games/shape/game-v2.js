const shapes = [
  { name: 'circle', display: '<div class="circle-shape"></div>' },
  { name: 'square', display: '<div class="square-shape"></div>' },
  { name: 'triangle', display: '<div class="triangle-shape"></div>' },
  { name: 'rectangle', display: '<div class="rectangle-shape"></div>' }
];

let currentShapeIndex = 0;
let score = 0;
let lives = 3;
let recognition;
let hasListened = false;
let useGestureControl = false;
let hands = null;
let camera = null;
let videoElement = null;
let canvasElement = null;
let canvasCtx = null;
let gameVideoElement = null;
let gameCanvasElement = null;
let gameCanvasCtx = null;
let fingerPointer = null;
let gameFingerPointer = null;
let currentHoveredShape = null;
let selectionStartTime = null;
let selectionProgressInterval = null;
const SELECTION_TIME = 1500;

// Initialize speech recognition support check
let speechSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;

function updateLivesDisplay() {
  const el = document.getElementById('lives-display');
  if (!el) return;
  el.innerHTML = '';
  for (let i = 0; i < 3; i++) {
    const heart = document.createElement('span');
    heart.textContent = '❤️';
    heart.style.fontSize = '1.5rem';
    heart.style.opacity = i < lives ? '1' : '0.3';
    heart.style.filter = i < lives ? 'none' : 'grayscale(100%)';
    heart.style.transition = 'all 0.3s';
    el.appendChild(heart);
  }
}

function saveScoreAndExit() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const studentId = urlParams.get('studentId');
    if (studentId) {
      const key = `student_performance_${studentId}`;
      const existingData = localStorage.getItem(key);
      let studentData = existingData ? JSON.parse(existingData) : {};
      const gameName = 'Shape Explorers';
      if (!studentData[gameName]) studentData[gameName] = {};
      const baseScore = Math.min(100, score);
      studentData[gameName] = {
        ...studentData[gameName],
        cognitive: {
          shape_recognition: baseScore,
          spatial_awareness: Math.min(100, baseScore + 3),
          categorization: Math.min(100, baseScore - 2),
          visual_discrimination: Math.min(100, baseScore + 5)
        },
        motor: {
          dragging_precision: baseScore,
          finger_control: Math.min(100, baseScore + 2),
          hand_stability: Math.min(100, baseScore - 3)
        },
        social: {
          collaboration: baseScore,
          verbal_expression: Math.min(100, baseScore + 4),
          listening_skills: Math.min(100, baseScore + 6)
        },
        emotional: {
          curiosity: 100,
          task_completion: baseScore,
          confidence_building: Math.min(100, baseScore + 5),
          frustration_management: Math.min(100, baseScore - 5)
        }
      };
      localStorage.setItem(key, JSON.stringify(studentData));
    }
  } catch(e) {
    console.error('Could not save score', e);
  }
  window.location.href = '/dashboard';
}

function loseLife() {
  lives = Math.max(0, lives - 1);
  updateLivesDisplay();
  if (lives <= 0) {
    stopSelection();
    const utterance = new SpeechSynthesisUtterance('Game over! Returning to dashboard.');
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    speechSynthesis.speak(utterance);
    setTimeout(saveScoreAndExit, 3000);
  }
}

// Text-to-speech function
function speakShapeName() {
  const shapeName = shapes[currentShapeIndex].name;
  const utterance = new SpeechSynthesisUtterance(shapeName);
  utterance.rate = 0.9;
  utterance.pitch = 1.3; // Cheerful pitch
  utterance.volume = 1;

  speechSynthesis.speak(utterance);

  hasListened = true;
  document.getElementById('listen-btn').textContent = '🔊 Listen Again';

  setTimeout(() => {
    document.getElementById('practice-section').style.display = 'block';
    if (!recognition) {
      document.getElementById('next-btn').style.display = 'inline-block';
    }
  }, 1000);
}

function startVoiceRecognition() {
  if (!speechSupported) {
    document.getElementById('voice-feedback').textContent =
      'Voice magic not working here. Click Next! ➡️';
    document.getElementById('next-btn').style.display = 'inline-block';
    return;
  }

  if (!hasListened) {
    document.getElementById('voice-status').textContent =
      '🙉 Listen to the name first!';
    return;
  }

  // Create a new recognition instance each time to ensure freshness
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript.toLowerCase();
    const currentShape = shapes[currentShapeIndex].name;

    document.getElementById('voice-status').textContent = `I heard: "${transcript}"`;

    if (transcript.includes(currentShape)) {
      celebrateCorrect();
    } else {
      document.getElementById('voice-feedback').innerHTML =
        `Oops! Try saying "${currentShape}" again! 🌟`;
    }

    document.getElementById('voice-btn').classList.remove('listening');
    document.getElementById('voice-btn').textContent = '🎤 Say It!';
  };

  recognition.onerror = (event) => {
    document.getElementById('voice-status').textContent = 'Subtle magic interference... try again!';
    document.getElementById('voice-btn').classList.remove('listening');
    document.getElementById('voice-btn').textContent = '🎤 Say It!';
  };

  recognition.onend = () => {
    document.getElementById('voice-btn').classList.remove('listening');
    document.getElementById('voice-btn').textContent = '🎤 Say It!';
  };

  try {
    recognition.start();
    document.getElementById('voice-btn').classList.add('listening');
    document.getElementById('voice-btn').textContent = '👂 Listening...';
    document.getElementById('voice-status').textContent = 'Shhh... I\'m listening!';
    document.getElementById('voice-feedback').textContent = '';
  } catch (error) {
    console.log('Recognition start error:', error);
    document.getElementById('voice-status').textContent = 'Magic spell failed. Try clicking again!';
  }
}

function celebrateCorrect() {
  const feedback = document.getElementById('voice-feedback');
  feedback.innerHTML = '<span class="celebration">🎉 Wahoo! You got it! 🎉</span>';

  playSound('correct');

  setTimeout(() => {
    document.getElementById('next-btn').style.display = 'inline-block';
  }, 1000);
}

function nextShape() {
  currentShapeIndex++;
  hasListened = false;

  if (currentShapeIndex >= shapes.length) {
    document.getElementById('start-game-btn').style.display = 'inline-block';
    document.getElementById('next-btn').style.display = 'none';
    document.getElementById('voice-feedback').innerHTML =
      '<span class="celebration">🌈 You are a Shape Master! 🌈</span>';
    document.getElementById('practice-section').style.display = 'none';
    document.getElementById('listen-btn').style.display = 'none';
    document.getElementById('learn-instruction').style.display = 'none';
    return;
  }

  const shape = shapes[currentShapeIndex];
  const capitalizedName = shape.name.charAt(0).toUpperCase() + shape.name.slice(1);

  document.getElementById('shape-name').textContent = capitalizedName;
  document.getElementById('shape-display').innerHTML = shape.display;
  document.getElementById('learn-instruction').innerHTML =
    `This is a <strong>${capitalizedName}</strong>. Let's hear its name!`;
  document.getElementById('listen-btn').textContent = '🔊 Listen to Name';
  document.getElementById('voice-btn').textContent = '🎤 Say It!';
  document.getElementById('voice-feedback').textContent = '';
  document.getElementById('voice-status').textContent = '';
  document.getElementById('next-btn').style.display = 'none';
  document.getElementById('practice-section').style.display = 'none';

  const progress = ((currentShapeIndex + 1) / shapes.length) * 100;
  document.getElementById('progress').style.width = progress + '%';
}

// Camera Setup Functions
function initializeCameraSetup() {
  videoElement = document.getElementById('camera-video');
  canvasElement = document.getElementById('camera-canvas');
  canvasCtx = canvasElement.getContext('2d');
  fingerPointer = document.getElementById('finger-pointer');

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

  camera = new Camera(videoElement, {
    onFrame: async () => {
      await hands.send({ image: videoElement });
    },
    width: 640,
    height: 480
  });

  camera.start().then(() => {
    const statusEl = document.getElementById('camera-status');
    statusEl.textContent = '✨ Magic Mirror Active! Point your finger!';
    statusEl.className = 'camera-status success';
    document.getElementById('start-learning-btn').style.display = 'inline-block';
  }).catch((error) => {
    const statusEl = document.getElementById('camera-status');
    statusEl.textContent = '🔮 Mirror needs resting. Use your mouse pointer!';
    statusEl.className = 'camera-status error';
    console.error('Camera error:', error);
  });

  // Set canvas size
  videoElement.addEventListener('loadedmetadata', () => {
    canvasElement.width = videoElement.videoWidth;
    canvasElement.height = videoElement.videoHeight;
  });
}

function onHandsResults(results) {
  // Handle camera setup phase
  if (canvasCtx && videoElement && document.getElementById('camera-setup-phase').classList.contains('active')) {
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      const landmarks = results.multiHandLandmarks[0];
      const indexFingerTip = landmarks[8]; // Index finger tip landmark

      // Draw hand landmarks - Thicker, more colorful
      if (typeof drawConnectors !== 'undefined' && typeof HAND_CONNECTIONS !== 'undefined') {
        drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, { color: '#4ECDC4', lineWidth: 4 });
        drawLandmarks(canvasCtx, landmarks, { color: '#FF6B6B', lineWidth: 2, radius: 5 });
      }

      // Update finger pointer position
      const rect = videoElement.getBoundingClientRect();
      const x = rect.left + (indexFingerTip.x * rect.width);
      const y = rect.top + (indexFingerTip.y * rect.height);

      if (fingerPointer) {
        fingerPointer.style.left = x + 'px';
        fingerPointer.style.top = y + 'px';
        fingerPointer.style.display = 'block';
      }
    } else {
      if (fingerPointer) fingerPointer.style.display = 'none';
    }

    canvasCtx.restore();
  }

  // Handle game phase
  if (useGestureControl && gameCanvasCtx && gameVideoElement &&
    document.getElementById('game-phase').classList.contains('active')) {
    gameCanvasCtx.save();
    gameCanvasCtx.clearRect(0, 0, gameCanvasElement.width, gameCanvasElement.height);
    gameCanvasCtx.drawImage(results.image, 0, 0, gameCanvasElement.width, gameCanvasElement.height);

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      const landmarks = results.multiHandLandmarks[0];
      const indexFingerTip = landmarks[8]; // Index finger tip landmark

      // Draw hand landmarks
      if (typeof drawConnectors !== 'undefined' && typeof HAND_CONNECTIONS !== 'undefined') {
        drawConnectors(gameCanvasCtx, landmarks, HAND_CONNECTIONS, { color: '#4ECDC4', lineWidth: 4 });
        drawLandmarks(gameCanvasCtx, landmarks, { color: '#FF6B6B', lineWidth: 2, radius: 5 });
      }

      // Handle gesture detection for shape selection
      handleGameGesture(indexFingerTip);
    } else {
      if (gameFingerPointer) gameFingerPointer.style.display = 'none';
      stopSelection();
    }

    gameCanvasCtx.restore();
  }
}

function handleGameGesture(indexFingerTip) {
  if (!gameVideoElement || !gameFingerPointer) return;

  // MediaPipe gives normalized coordinates (0-1) relative to the video
  // We need to map this to actual screen coordinates
  // The finger position in the camera view corresponds to where the user is pointing in 3D space

  // Get the viewport dimensions
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Map the normalized coordinates to screen coordinates
  // No mirror flip needed since video is not mirrored
  const screenX = indexFingerTip.x * viewportWidth;
  const screenY = indexFingerTip.y * viewportHeight;

  // Update the red dot position on screen
  gameFingerPointer.style.left = screenX + 'px';
  gameFingerPointer.style.top = screenY + 'px';
  gameFingerPointer.style.display = 'block';

  // Check if pointing at a shape
  const shapeBoxes = document.querySelectorAll('.game-box-gesture');
  let hoveredBox = null;

  shapeBoxes.forEach(box => {
    const boxRect = box.getBoundingClientRect();

    // Check if finger pointer is over this box
    // Added some tolerance/padding for easier selection
    if (screenX >= boxRect.left && screenX <= boxRect.right &&
      screenY >= boxRect.top && screenY <= boxRect.bottom) {
      hoveredBox = box;
    }
  });

  if (hoveredBox && hoveredBox !== currentHoveredShape) {
    startSelection(hoveredBox);
  } else if (!hoveredBox) {
    stopSelection();
  } else if (hoveredBox === currentHoveredShape) {
    updateSelection();
  }
}

function startSelection(box) {
  stopSelection();
  currentHoveredShape = box;
  selectionStartTime = Date.now();
  box.classList.add('highlighted');
  playSound('selection');

  const progressBar = box.querySelector('.selection-progress');
  const progressFill = box.querySelector('.selection-progress-fill');
  if (progressBar) {
    progressBar.classList.add('active');
    progressFill.style.width = '0%';
  }

  selectionProgressInterval = setInterval(() => {
    updateSelection();
  }, 50);
}

function updateSelection() {
  if (!currentHoveredShape || !selectionStartTime) return;

  const elapsed = Date.now() - selectionStartTime;
  const progress = Math.min((elapsed / SELECTION_TIME) * 100, 100);

  const progressFill = currentHoveredShape.querySelector('.selection-progress-fill');
  if (progressFill) {
    progressFill.style.width = progress + '%';
  }

  if (elapsed >= SELECTION_TIME) {
    const shapeName = currentHoveredShape.dataset.shapeName;
    const targetShape = document.getElementById('instruction').dataset.target;
    checkAnswer(shapeName, targetShape);
    stopSelection();
  }
}

function stopSelection() {
  if (currentHoveredShape) {
    currentHoveredShape.classList.remove('highlighted');
    const progressBar = currentHoveredShape.querySelector('.selection-progress');
    if (progressBar) {
      progressBar.classList.remove('active');
    }
  }
  currentHoveredShape = null;
  selectionStartTime = null;
  if (selectionProgressInterval) {
    clearInterval(selectionProgressInterval);
    selectionProgressInterval = null;
  }
}

function startLearning() {
  // Stop setup camera, but keep hands instance for later use
  if (camera) {
    camera.stop();
    camera = null;
  }
  // Keep hands instance - we'll reuse it in game phase
  useGestureControl = true; // User wants to use gestures
  document.getElementById('camera-setup-phase').classList.remove('active');
  document.getElementById('learning-phase').classList.add('active');
}

function skipCameraSetup() {
  useGestureControl = false;
  if (camera) {
    camera.stop();
    camera = null;
  }
  document.getElementById('camera-setup-phase').classList.remove('active');
  document.getElementById('learning-phase').classList.add('active');
}

function initializeGameCamera() {
  if (!useGestureControl) return;

  gameVideoElement = document.getElementById('game-camera-video');
  gameCanvasElement = document.getElementById('game-camera-canvas');
  gameCanvasCtx = gameCanvasElement.getContext('2d');
  gameFingerPointer = document.getElementById('game-finger-pointer');

  // Stop previous camera if running
  if (camera) {
    camera.stop();
    camera = null;
  }

  // Reuse hands instance if it exists, otherwise create new one
  if (!hands) {
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
  }

  camera = new Camera(gameVideoElement, {
    onFrame: async () => {
      await hands.send({ image: gameVideoElement });
    },
    width: 640,
    height: 480
  });

  camera.start().then(() => {
    document.getElementById('game-camera-status').textContent = '✅ Point your finger at a shape!';
    document.getElementById('camera-side').style.display = 'flex';

    // Set canvas size when video is ready
    gameVideoElement.addEventListener('loadedmetadata', () => {
      gameCanvasElement.width = gameVideoElement.videoWidth;
      gameCanvasElement.height = gameVideoElement.videoHeight;
    }, { once: true });
  }).catch((error) => {
    console.error('Game camera error:', error);
    useGestureControl = false;
    document.getElementById('camera-side').style.display = 'none';
    document.getElementById('game-camera-status').textContent = 'Camera not available. Using click controls.';
  });
}

function startGame() {
  document.getElementById('learning-phase').classList.remove('active');
  document.getElementById('game-phase').classList.add('active');
  score = 0;
  lives = 3;
  updateScore();
  updateLivesDisplay();

  // Check if we should use gesture control - hands instance should be preserved
  if (useGestureControl && hands) {
    initializeGameCamera();
  } else {
    useGestureControl = false;
    document.getElementById('camera-side').style.display = 'none';
  }

  newRound();
}

function newRound() {
  const targetShape = shapes[Math.floor(Math.random() * shapes.length)];
  const instruction = document.getElementById('instruction');
  const capitalizedName = targetShape.name.charAt(0).toUpperCase() + targetShape.name.slice(1);
  instruction.textContent = `Find the ${capitalizedName}!`;
  instruction.dataset.target = targetShape.name;

  // Speak the instruction
  const utterance = new SpeechSynthesisUtterance(`Find the ${targetShape.name}`);
  utterance.rate = 0.9;
  utterance.pitch = 1.2;
  speechSynthesis.speak(utterance);

  stopSelection();

  const gameArea = document.getElementById('game-area');
  const gameAreaGesture = document.getElementById('game-area-gesture');
  gameArea.innerHTML = '';
  gameAreaGesture.innerHTML = '';

  const shuffled = [...shapes].sort(() => Math.random() - 0.5);

  shuffled.forEach(shape => {
    if (useGestureControl) {
      // Create gesture-controlled box
      const box = document.createElement('div');
      box.className = 'game-box-gesture';
      box.dataset.shapeName = shape.name;
      box.innerHTML = shape.display +
        '<div class="selection-progress"><div class="selection-progress-fill"></div></div>';
      gameAreaGesture.appendChild(box);
    } else {
      // Create click-controlled box
      const box = document.createElement('div');
      box.className = 'game-box';
      box.innerHTML = shape.display;
      box.onclick = () => checkAnswer(shape.name, targetShape.name);
      gameArea.appendChild(box);
    }
  });

  document.getElementById('game-feedback').textContent = '';
}

function checkAnswer(selected, target) {
  const feedback = document.getElementById('game-feedback');

  if (selected === target) {
    feedback.innerHTML = '<span class="celebration">🎉 Awesome! You found it! 🎉</span>';
    feedback.style.color = '#FF6B6B'; // Match primary color
    score += 10;
    updateScore();
    playSound('correct');

    if (score >= 100) {
      // Level 1 Complete -> Go to Level 2
      feedback.innerHTML = '<span class="celebration">✨ Level 1 Complete! Get Ready... ✨</span>';
      playSound('win');
      setTimeout(() => {
        window.location.href = `level2.html?score=${score}`;
      }, 2000);
    } else {
      setTimeout(newRound, 1500);
    }
  } else {
    feedback.innerHTML = '<span style="color: #2D3436;">Oopsiedaisy! Try again! 💫</span>';
    score = Math.max(0, score - 5);
    updateScore();
    playSound('incorrect');
    loseLife();
  }
}

function updateScore() {
  document.getElementById('score').textContent = `⭐ Score: ${score}`;
}

function showVictoryScreen() {
  stopSelection();
  if (camera) {
    camera.stop();
    camera = null;
  }

  // Cleanup Level 2
  clearInterval(spawnIntervalId);
  cancelAnimationFrame(level2LoopId);

  document.getElementById('game-phase').classList.remove('active');
  document.getElementById('level2-phase').classList.remove('active');
  document.getElementById('victory-phase').classList.add('active');
  document.getElementById('final-score').textContent = score;
}

function resetToLearning() {
  stopSelection();
  if (camera) {
    camera.stop();
    camera = null;
  }

  // Cleanup Level 2
  currentLevel = 1;
  clearInterval(spawnIntervalId);
  cancelAnimationFrame(level2LoopId);
  fallingShapes.forEach(s => {
    if (s.element && s.element.parentNode) s.element.remove();
  });
  fallingShapes = [];

  document.getElementById('game-phase').classList.remove('active');
  document.getElementById('level2-phase').classList.remove('active');
  document.getElementById('victory-phase').classList.remove('active');
  document.getElementById('learning-phase').classList.add('active');

  // Put pointer back to original place (optional, but good practice)
  if (document.getElementById('game-finger-pointer')) {
    document.getElementById('game-phase').appendChild(document.getElementById('game-finger-pointer'));
  }

  // Restore camera container to original place if needed? 
  // Actually startLearning/initializeGameCamera handles camera recreation, so the container structure matters.
  // We moved the container DOM element. We should put it back.
  const cameraContainer = document.querySelector('.camera-container.small-mirror');
  if (cameraContainer && document.getElementById('camera-side')) {
    document.getElementById('camera-side').appendChild(cameraContainer);
  }

  currentShapeIndex = 0;
  hasListened = false;

  document.getElementById('shape-name').textContent = 'Circle';
  document.getElementById('shape-display').innerHTML = '<div class="circle-shape"></div>';
  document.getElementById('learn-instruction').innerHTML =
    'This is a <strong>Circle</strong>. Let\'s hear its name!';
  document.getElementById('listen-btn').textContent = '🔊 Listen to Name';
  document.getElementById('listen-btn').style.display = 'inline-block';
  document.getElementById('learn-instruction').style.display = 'block';
  document.getElementById('voice-btn').textContent = '🎤 Say It!';
  document.getElementById('voice-feedback').textContent = '';
  document.getElementById('voice-status').textContent = '';
  document.getElementById('next-btn').style.display = 'none';
  document.getElementById('start-game-btn').style.display = 'none';
  document.getElementById('practice-section').style.display = 'none';
  document.getElementById('progress').style.width = '25%';
}

function startMusic() {
  const music = document.getElementById('bg-music');
  if (music) {
    music.volume = 0.3;
    music.play()
      .then(() => console.log("Music started successfully!"))
      .catch(e => console.log("Audio play failed (waiting for user interaction):", e));
  }
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
  // Start with camera setup phase
  document.getElementById('learning-phase').classList.remove('active');
  document.getElementById('camera-setup-phase').classList.add('active');
  initializeCameraSetup();

  // Try to play music on any interaction
  const musicStartEvents = ['click', 'touchstart', 'keydown'];
  const startMusicOnce = () => {
    startMusic();
    musicStartEvents.forEach(event => document.body.removeEventListener(event, startMusicOnce));
  };

  musicStartEvents.forEach(event => document.body.addEventListener(event, startMusicOnce));
});

// Level 2 Functions
function startLevel2() {
  currentLevel = 2;
  // Keep existing score

  document.getElementById('game-phase').classList.remove('active');
  document.getElementById('level2-phase').classList.add('active');
  document.getElementById('level2-score').textContent = `⭐ Score: ${score}`;

  // Move Camera and Pointer
  const cameraContainer = document.querySelector('.camera-container.small-mirror');
  if (cameraContainer) {
    document.getElementById('level2-camera-side').appendChild(cameraContainer);
  }

  const pointer = document.getElementById('game-finger-pointer');
  if (pointer) {
    document.body.appendChild(pointer);
    pointer.style.zIndex = '1000';
  }

  // Start Spawning
  spawnIntervalId = setInterval(spawnShape, 1500);
  level2LoopId = requestAnimationFrame(updateLevel2);
}

function spawnShape() {
  if (currentLevel !== 2) return;

  const shapeTypes = ['circle', 'square', 'triangle', 'rectangle'];
  const type = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
  const shapeObj = shapes.find(s => s.name === type);

  const el = document.createElement('div');
  el.className = 'falling-shape';
  el.innerHTML = shapeObj.display;
  el.dataset.type = type;

  // Random X position (avoiding edges)
  const left = 10 + Math.random() * 80;
  el.style.left = `${left}%`;

  document.getElementById('level2-area').appendChild(el);
  fallingShapes.push({
    element: el,
    y: -50,
    speed: 1 + Math.random() * 2, // Varied speed
    caught: false
  });
}

function updateLevel2() {
  if (currentLevel !== 2) return;

  fallingShapes.forEach((shape, index) => {
    if (shape.caught) return;

    shape.y += shape.speed;
    shape.element.style.top = `${shape.y}px`;

    // Remove if off screen
    if (shape.y > 500) {
      shape.element.remove();
      fallingShapes.splice(index, 1);
    }
  });

  level2LoopId = requestAnimationFrame(updateLevel2);
}

function handleLevel2Gesture(indexFingerTip) {
  if (!gameVideoElement || !gameFingerPointer) return;

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const screenX = indexFingerTip.x * viewportWidth;
  const screenY = indexFingerTip.y * viewportHeight;

  gameFingerPointer.style.left = screenX + 'px';
  gameFingerPointer.style.top = screenY + 'px';
  gameFingerPointer.style.display = 'block';

  // Check collision with falling shapes
  fallingShapes.forEach(shape => {
    if (shape.caught) return;

    const rect = shape.element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Distance check
    const dist = Math.hypot(screenX - centerX, screenY - centerY);

    if (dist < 50) { // Catch radius
      catchShape(shape);
    }
  });
}

function catchShape(shape) {
  shape.caught = true;
  shape.element.classList.add('caught');
  playSound('selection');

  // Add points
  score += 5;
  document.getElementById('level2-score').textContent = `⭐ Score: ${score}`;

  setTimeout(() => {
    if (shape.element.parentNode) {
      shape.element.remove();
    }
    const idx = fallingShapes.indexOf(shape);
    if (idx > -1) fallingShapes.splice(idx, 1);
  }, 200);

  if (score >= 100) {
    winLevel2();
  }
}

function winLevel2() {
  currentLevel = 3; // Game Over / Win
  clearInterval(spawnIntervalId);
  cancelAnimationFrame(level2LoopId);

  fallingShapes.forEach(s => s.element.remove());
  fallingShapes = [];

  showVictoryScreen();
}

function playSound(type) {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();

  if (type === 'correct') {
    // Happy ascending melody
    const notes = [523, 659, 784]; // C, E, G
    notes.forEach((freq, index) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = freq;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime + index * 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + index * 0.1 + 0.2);

      oscillator.start(audioContext.currentTime + index * 0.1);
      oscillator.stop(audioContext.currentTime + index * 0.1 + 0.2);
    });
  } else if (type === 'incorrect') {
    // Gentle "boop" error
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.2);
    oscillator.type = 'triangle'; // Softer than sawtooth
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
  } else if (type === 'win') {
    // Triumphant fanfare
    const notes = [523, 659, 784, 1047, 784, 1047];
    notes.forEach((freq, index) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = freq;
      oscillator.type = 'square'; // Arcade-like
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime + index * 0.12);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + index * 0.12 + 0.3);

      oscillator.start(audioContext.currentTime + index * 0.12);
      oscillator.stop(audioContext.currentTime + index * 0.12 + 0.3);
    });
  } else if (type === 'selection') {
    // Pop sound
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
  }
}
