const basket = document.getElementById("basket");
const basketCover = document.getElementById("basket-cover");
const egg = document.getElementById("egg");
const scoreDisplay = document.getElementById("score");
const livesDisplay = document.getElementById("lives");
const pauseOverlay = document.getElementById("pause-overlay");
const gameWrapper = document.querySelector(".game-container-wrapper");
const leftBtn = document.getElementById("left-btn");
const rightBtn = document.getElementById("right-btn");
const mobileControls = document.querySelector('.mobile-controls');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const gameOverSound = document.getElementById("game-over-sound");
const moveSpeed = 3; // Much slower movement (was 5)
const acceleration = 0.3; // Slower acceleration (was 0.5)
const maxSpeed = 5; // Much lower max speed for better control (was 8)
const friction = 0.98; // Higher friction for smoother stops (was 0.95)

let score = 0;
let lives = 3;
let basketX = window.innerWidth / 2 - 50;
let movingLeft = false;
let movingRight = false;
let fallInterval = null;
let bounceInterval = null;
let gameOver = false;
let highScore = 0;
let isPaused = false;
let gameWasRunning = false;
let isMuted = false;
let basketVelocity = 0;
let gameStartTime = null;
let studentId = null;
let eggSpawnInterval = null;
let activeEggs = new Set(); // Track multiple eggs

// Get student data from localStorage or URL parameter
function getStudentData() {
  try {
    // First try to get from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const urlStudentId = urlParams.get('studentId');
    if (urlStudentId) {
      console.log('🎮 Student ID from URL:', urlStudentId);
      return urlStudentId;
    }
    
    // Fallback to localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const studentId = user.studentId || 'DEMO_STUDENT';
    console.log('🎮 Student ID from localStorage:', studentId);
    return studentId;
  } catch (e) {
    console.log('🎮 Using fallback student ID');
    return 'DEMO_STUDENT';
  }
}

function updateVH() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

updateVH();

window.addEventListener('resize', updateVH);
window.addEventListener('orientationchange', updateVH);

if (window.visualViewport) {
  window.visualViewport.addEventListener('resize', updateVH);
  window.visualViewport.addEventListener('scroll', updateVH);
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") movingLeft = true;
  else if (e.key === "ArrowRight") movingRight = true;
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft") movingLeft = false;
  else if (e.key === "ArrowRight") movingRight = false;
});

function gameLoop() {
  if (!isPaused) {
    if (movingLeft && !movingRight) {
      basketVelocity -= acceleration;
    } else if (movingRight && !movingLeft) {
      basketVelocity += acceleration;
    } else {
      basketVelocity = 0;
    }

    basketVelocity = Math.max(-maxSpeed, Math.min(maxSpeed, basketVelocity));
    basketX += basketVelocity;
    basketX = Math.max(0, Math.min(window.innerWidth - basket.offsetWidth, basketX));
    updateBasketPosition();
  }

  requestAnimationFrame(gameLoop);
}

function dropEgg(eggId = null) {
  // Generate unique ID for this egg
  const currentEggId = eggId || 'egg_' + Date.now() + '_' + Math.random();
  activeEggs.add(currentEggId);
  
  const lane = Math.floor(Math.random() * 4);
  const hen = document.getElementById(`hen-${lane}`);
  const henRect = hen.getBoundingClientRect();

  // More predictable egg types for accessibility
  const random = Math.random();
  let eggType = "white"; // default

  if (random < 0.05) {
    eggType = "black"; // Only 5% chance black (was 10%) - less stressful
  } else if (random < 0.15) {
    eggType = "golden"; // 10% chance golden (was 15%) - more positive
  }

  // Clone the egg element for multiple eggs
  const eggClone = egg.cloneNode(true);
  eggClone.id = currentEggId;
  eggClone.dataset.eggId = currentEggId;
  eggClone.classList.remove("golden-egg", "black-egg"); // reset all classes
  if (eggType === "golden") eggClone.classList.add("golden-egg");
  if (eggType === "black") eggClone.classList.add("black-egg");
  eggClone.dataset.type = eggType;
  eggClone.style.left = henRect.left + henRect.width / 2 - 15 + "px";
  eggClone.style.top = henRect.bottom + "px";
  eggClone.style.display = "block";
  
  // Add visual indicator for accessibility
  if (eggType === "golden") {
    eggClone.style.boxShadow = "0 0 20px gold";
  } else if (eggType === "black") {
    eggClone.style.boxShadow = "0 0 20px red";
  } else {
    eggClone.style.boxShadow = "0 0 10px rgba(0,0,0,0.3)";
  }
  
  // Add to game container
  document.querySelector(".game-container").appendChild(eggClone);

  // Play sound with less frequency for sensory sensitivity
  if (Math.random() > 0.5) { // Only play sound 50% of the time
    document.getElementById("hen-sound").play();
  }

  let y = henRect.bottom;
  let velocity = 0.3; // Very slow initial speed (was 0.5)
  const gravity = 0.05; // Much slower gravity for easier tracking (was 0.08)

  const fallInterval = setInterval(() => {
    if (gameOver) {
      clearInterval(fallInterval);
      // Remove this egg
      if (eggClone.parentNode) {
        eggClone.parentNode.removeChild(eggClone);
      }
      activeEggs.delete(currentEggId);
      return;
    }

    velocity += gravity;
    y += velocity;
    eggClone.style.top = y + "px";

    const eggRect = eggClone.getBoundingClientRect();
    const basketRect = basket.getBoundingClientRect();
    const basketWidth = basketRect.width;
    const leftBound = basketRect.left + basketWidth * 0.01;
    const rightBound = basketRect.right - basketWidth * 0.01;

    // Egg caught
    if (
      eggRect.bottom >= basketRect.top &&
      eggRect.left >= leftBound &&
      eggRect.right <= rightBound
    ) {
      clearInterval(fallInterval);

      // Bounce animation
      let bounceY = basketRect.top + 5;
      eggClone.style.top = bounceY + "px";
      let bounceVelocity = -6;
      let bounceGravity = 0.5;
      let bounceCount = 0;

      const bounceInterval = setInterval(() => {
        bounceVelocity += bounceGravity;
        bounceY += bounceVelocity;
        eggClone.style.top = bounceY + "px";

        const maxY = basketRect.top + 10;

        if (bounceY >= maxY || bounceCount > 2) {
          bounceY = maxY;
          eggClone.style.top = bounceY + "px";
          clearInterval(bounceInterval);
          eggClone.style.display = "none";
          if (eggClone.parentNode) {
            eggClone.parentNode.removeChild(eggClone);
          }
          activeEggs.delete(currentEggId);
          
          let pointValue = 0;
          const eggTypeData = eggClone.dataset.type;

          if (eggTypeData === "golden") {
            pointValue = 5;
            document.getElementById("point-sound").play();
          } else if (eggTypeData === "white") {
            pointValue = 1;
            document.getElementById("point-sound").play();
          } else if (eggTypeData === "black") {
            pointValue = -10;
            document.getElementById("black-egg-sound").play();
          }

          score += pointValue;
          scoreDisplay.textContent = score;
          
          // Record successful catch
          if (window.GameTracker && gameStartTime) {
            window.GameTracker.recordCorrect({ 
              egg: pointValue > 0 ? 'golden' : 'regular',
              points: pointValue,
              time: Date.now() - gameStartTime,
              position: eggRect.left + ',' + y
            });
            
            // Record pattern recognition for successful catches
            window.GameTracker.recordPattern({ 
              pattern: 'egg_catch',
              success: true,
              difficulty: pointValue > 0 ? 'hard' : 'easy'
            });
            
            // Record motor skill for hand-eye coordination
            window.GameTracker.recordClick({ 
              accuracy: 'high',
              target: 'egg',
              success: true
            });
          }
          
          if (score < 0 && !gameOver) {
            gameOver = true;
            document.getElementById("game-over-sound").play();
            updateHighScoreIfNeeded();

            const gameOverScreen = document.getElementById("game-over-screen");
            document.getElementById("high-score").textContent = `High Score: ${highScore}`;
            const finalScore = document.getElementById("final-score");
            finalScore.textContent = `Score: ${score}`;
            gameOverScreen.classList.remove("hidden");
            
            // End game tracking
            if (window.GameTracker && gameStartTime) {
              const result = window.GameTracker.end();
              console.log('🎮 Egg Hunt game ended. Performance data:', result);
            }

            return;
          }

          // Show floating points from basket
          const basketRect = basket.getBoundingClientRect();
          const gameRect = document.querySelector(".game-container").getBoundingClientRect();
          const x = basketRect.left + basketRect.width / 2 - gameRect.left - 10;
          const y = basketRect.top - gameRect.top - 20;
          showFloatingPoints(pointValue, x, y);
        }

        if (bounceY >= maxY) {
          bounceY = maxY;
          bounceVelocity *= -0.5;
          bounceCount++;
        }
      }, 20);
    }

    if (y > window.innerHeight) {
      clearInterval(fallInterval);

      const eggRect = eggClone.getBoundingClientRect();
      const gameRect = document.querySelector(".game-container").getBoundingClientRect();
      const x = eggRect.left - gameRect.left;
      const yOffset = gameRect.height - 70;

      document.getElementById("crack-sound").play();
      showCrackedEgg(x, yOffset);

      eggClone.style.display = "none";
      if (eggClone.parentNode) {
        eggClone.parentNode.removeChild(eggClone);
      }
      activeEggs.delete(currentEggId);

      // 🛑 Do NOT lose life if black egg
      if (eggClone.dataset.type !== "black") {
        lives--;
        livesDisplay.textContent = lives;

        // Record missed egg
        if (window.GameTracker && gameStartTime) {
          window.GameTracker.recordIncorrect({ 
            egg: eggType,
            missed: true,
            time: Date.now() - gameStartTime,
            lives_remaining: lives
          });
          
          // Record persistence (continuing despite missing)
          window.GameTracker.recordPersistence({ 
            attempt: 'continue_playing',
            lives: lives,
            motivation: 'high'
          });
        }

        if (lives === 0) {
          gameOver = true;

          document.getElementById("game-over-sound").play();

          // ✅ Call it here
          updateHighScoreIfNeeded();

          const gameOverScreen = document.getElementById("game-over-screen");
          document.getElementById("high-score").textContent = `High Score: ${highScore}`;
          const finalScore = document.getElementById("final-score");
          finalScore.textContent = `Score: ${score}`;
          gameOverScreen.classList.remove("hidden");
          
          // End game tracking
          if (window.GameTracker && gameStartTime) {
            const result = window.GameTracker.end();
            console.log('🎮 Egg Hunt game ended. Performance data:', result);
          }

          return;
        }
      }
    }
  }, 20);
}

function updateBasketPosition() {
  basket.style.left = basketX + "px";
  basketCover.style.left = basketX + "px";
}

function resetGame() {
  document.getElementById("final-score").textContent = "";
  clearInterval(fallInterval);
  clearInterval(eggSpawnInterval);
  
  // Clear all active eggs
  activeEggs.forEach(eggId => {
    const eggElement = document.getElementById(eggId);
    if (eggElement && eggElement.parentNode) {
      eggElement.parentNode.removeChild(eggElement);
    }
  });
  activeEggs.clear();
  
  egg.style.display = "none";

  score = 0;
  lives = 3;
  gameOver = false;

  scoreDisplay.textContent = score;
  livesDisplay.textContent = lives;

  basketX = window.innerWidth / 2 - 50;
  updateBasketPosition();
}

function startEggSpawning() {
    // Clear any existing spawning interval
    if (eggSpawnInterval) {
      clearInterval(eggSpawnInterval);
    }
    
    // Start very slow, predictable egg spawning for accessibility
    eggSpawnInterval = setInterval(() => {
      if (!gameOver && !isPaused) {
        // Only drop egg if no other eggs are active (one egg at a time)
        if (activeEggs.size === 0) {
          dropEgg();
        }
      }
    }, 8000); // Drop egg every 8 seconds instead of 4 (much slower pace)
    
    // Drop first egg after a longer delay to let child prepare
    setTimeout(() => dropEgg(), 3000); // 3 second delay before first egg
  }

function showCrackedEgg(x, y) {
  const crackedEgg = document.createElement("div");
  crackedEgg.className = "cracked-egg";
  crackedEgg.style.left = `${x}px`;
  crackedEgg.style.bottom = "0";
  document.querySelector(".game-container").appendChild(crackedEgg);

  // Trigger fade-out after a short delay
  setTimeout(() => {
    crackedEgg.style.opacity = "0";
  }, 100); // allow it to be visible first

  // Remove from DOM after 2 seconds
  setTimeout(() => {
    crackedEgg.remove();
  }, 2100);
}

function showFloatingPoints(points, x, y) {
  const pointEl = document.createElement("div");
  pointEl.className = "floating-points";

  // Set text and color
  pointEl.textContent = points > 0 ? `+${points}` : `${points}`;
  pointEl.style.color = points > 0 ? "gold" : "red";

  pointEl.style.left = `${x}px`;
  pointEl.style.top = `${y}px`;
  document.querySelector(".game-container").appendChild(pointEl);

  setTimeout(() => {
    pointEl.remove();
  }, 2000); // remove after animation
}

function startCountdown(callback) {
  const countdownEl = document.createElement("div");
  countdownEl.className = "countdown";
  countdownEl.textContent = "3";
  document.body.appendChild(countdownEl);

  let count = 3;
  const interval = setInterval(() => {
    count--;
    if (count > 0) {
      countdownEl.textContent = count;
    } else {
      clearInterval(interval);
      countdownEl.remove();
      callback(); // call resetGame() + dropEgg()
    }
  }, 1000);
}

function fetchHighScore() {
  const stored = localStorage.getItem("highScore");
  if (stored) {
    highScore = parseInt(stored);
    document.getElementById("high-score").textContent = `High Score: ${highScore}`;
    document.getElementById("highScore").textContent = highScore;
  } else {
    highScore = 0;
    document.getElementById("high-score").textContent = `High Score: 0`;
    document.getElementById("highScore").textContent = 0;
  }
}

function updateHighScoreIfNeeded() {
  if (score > highScore) {
    highScore = score; // update in memory
    localStorage.setItem("highScore", score); // update localStorage

    document.getElementById("high-score").textContent = `High Score: ${score}`;
    document.getElementById("highScore").textContent = score;
  }
}

document.getElementById("retry-btn").addEventListener("click", () => {
  document.getElementById("button-sound").play();

  gameOverSound.pause();
  gameOverSound.currentTime = 0;

  const gameOverScreen = document.getElementById("game-over-screen");
  gameOverScreen.classList.add('hidden'); 
  gameOver = false;

  startCountdown(() => {
    if (window.innerWidth <= 850) {
      mobileControls.classList.remove('hidden');
    }
    resetGame();
    fetchHighScore();
    startEggSpawning(); // Use new spawning system
  });
});

document.getElementById("start-btn").addEventListener("click", () => {
  document.getElementById("button-sound").play();
  const startScreen = document.getElementById("start-screen");
  startScreen.style.display = "none";
  startScreen.classList.add('hidden');
  if (window.innerWidth <= 850) {
    mobileControls.classList.remove('hidden');
  }

  startCountdown(() => {
    resetGame();
    fetchHighScore();
    startEggSpawning(); // Use new spawning system
  });
});

document.getElementById("rules-btn").addEventListener("click", () => {
  document.getElementById("rules-screen").classList.remove("hidden");
});

document.getElementById("close-rules-btn").addEventListener("click", () => {
  document.getElementById("rules-screen").classList.add("hidden");
});

function updateMuteIcons() {
  const allMuteBtns = document.querySelectorAll("#mute-btn-start, #mute-btn-over");
  const allUnmuteBtns = document.querySelectorAll("#unmute-btn-start, #unmute-btn-over");

  if (isMuted) {
    allMuteBtns.forEach(btn => btn.classList.add("hidden"));
    allUnmuteBtns.forEach(btn => btn.classList.remove("hidden"));
  } else {
    allUnmuteBtns.forEach(btn => btn.classList.add("hidden"));
    allMuteBtns.forEach(btn => btn.classList.remove("hidden"));
  }
}

function muteAllSounds() {
  document.querySelectorAll("audio").forEach(audio => audio.muted = true);
}

function unmuteAllSounds() {
  document.querySelectorAll("audio").forEach(audio => audio.muted = false);
}

const gameContainer = document.querySelector(".game-container");

// Hook up all buttons
document.querySelectorAll("#mute-btn-start, #mute-btn-over").forEach(btn => {
  btn.addEventListener("click", () => {
    isMuted = true;
    muteAllSounds();
    updateMuteIcons();
  });
});

document.querySelectorAll("#unmute-btn-start, #unmute-btn-over").forEach(btn => {
  btn.addEventListener("click", () => {
    isMuted = false;
    unmuteAllSounds();
    updateMuteIcons();
  });
});

let touchLeftInterval = null;
let touchRightInterval = null;

leftBtn.addEventListener("touchstart", () => {
  movingLeft = true;

  // Immediate tap movement
  basketX -= 5;
  basketX = Math.max(0, basketX);
  updateBasketPosition();

  // Start continuous movement
  touchLeftInterval = setInterval(() => {
    if (!isPaused && !gameOver) {
      basketVelocity -= acceleration;
      basketVelocity = Math.max(-maxSpeed, basketVelocity);
    }
  }, 20);
});

leftBtn.addEventListener("touchend", () => {
  movingLeft = false;
  clearInterval(touchLeftInterval);
  basketVelocity = 0;
});

rightBtn.addEventListener("touchstart", () => {
  movingRight = true;

  // Immediate tap movement
  basketX += 5;
  basketX = Math.min(window.innerWidth - basket.offsetWidth, basketX);
  updateBasketPosition();

  // Start continuous movement
  touchRightInterval = setInterval(() => {
    if (!isPaused && !gameOver) {
      basketVelocity += acceleration;
      basketVelocity = Math.min(maxSpeed, basketVelocity);
    }
  }, 20);
});

rightBtn.addEventListener("touchend", () => {
  movingRight = false;
  clearInterval(touchRightInterval);
  basketVelocity = 0;
});

window.onload = () => {
  updateVH();
  updateBasketPosition();
  gameLoop();
  fetchHighScore();
  
  gameContainer.addEventListener("touchmove", function (e) {
    if (e.touches.length > 0) {
      e.preventDefault(); // Required to stop scrolling
      const touch = e.touches[0];
      basketX = touch.clientX - basket.offsetWidth / 2;
      basketX = Math.max(0, Math.min(window.innerWidth - basket.offsetWidth, basketX));
      updateBasketPosition();
    }
  }, { passive: false }); // 👈 important!
};

// Hand Gesture Control using MediaPipe Hands
const videoElement = document.getElementById('input_video');
const canvasElement = document.getElementById('output_canvas');
const canvasCtx = canvasElement.getContext('2d');
const loadingText = document.getElementById('loading-text');

let isHandTrackingActive = false;

function onResults(results) {
  // Hide loading text on first successful frame
  if (loadingText && loadingText.style.display !== 'none') {
    loadingText.style.display = 'none';
  }

  isHandTrackingActive = true;
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

  // Draw the image
  canvasCtx.drawImage(
      results.image, 0, 0, canvasElement.width, canvasElement.height);

  if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
    for (const landmarks of results.multiHandLandmarks) {
      drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS,
                     {color: '#00FF00', lineWidth: 2});
      drawLandmarks(canvasCtx, landmarks, {color: '#FF0000', lineWidth: 1});

      // Map index finger x-coordinate to basket position
      if (!isPaused && !gameOver) {
        const indexFingerTip = landmarks[8]; // INDEX_FINGER_TIP is 8
        if (indexFingerTip) {
          // X goes from 0 to 1. Camera is usually mirrored, but we've flipped the canvas in CSS.
          // In MediaPipe, 0 is left, 1 is right. But webcam is mirrored.
          // By default, 0 is right hand side of user, 1 is left hand side.
          // So we mirror it:
          let targetX = (1 - indexFingerTip.x) * window.innerWidth - (basket.offsetWidth / 2);

          basketX = targetX;
          basketX = Math.max(0, Math.min(window.innerWidth - basket.offsetWidth, basketX));
          updateBasketPosition();
        }
      }
    }
  }
  canvasCtx.restore();
}

try {
  const hands = new Hands({locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
  }});
  hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
  });
  hands.onResults(onResults);

  const camera = new Camera(videoElement, {
    onFrame: async () => {
      await hands.send({image: videoElement});
    },
    width: 320,
    height: 240
  });

  // Request camera and start tracking when user starts the game
  document.getElementById("start-btn").addEventListener("click", () => {
     // Initialize game tracking
     studentId = getStudentData();
     gameStartTime = Date.now();
     
     // Initialize GameTracker if available
     if (window.GameTracker) {
       window.GameTracker.setupEggHunt(studentId);
       console.log('🎮 Egg Hunt tracking initialized for student:', studentId);
     }
     
     camera.start().catch((err) => {
        console.warn("Camera access denied or unavailable. Fallback to normal controls.", err);
        document.getElementById('gesture-ui').style.display = 'none';
     });
  });
  
  // Also start camera on retry if it wasn't already started and isn't active
  document.getElementById("retry-btn").addEventListener("click", () => {
     if (!isHandTrackingActive) {
         camera.start().catch((err) => {
            console.warn("Camera access denied or unavailable. Fallback to normal controls.", err);
         });
     }
  });

} catch (error) {
  console.error("MediaPipe initialization failed:", error);
  document.getElementById('gesture-ui').style.display = 'none';
}

