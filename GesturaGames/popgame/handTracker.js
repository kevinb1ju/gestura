// ============================================================
//  handTracker.js  –  MediaPipe Hands integration
//  Reads from the #webcam video element.
//  Publishes results to window.HandTracker so App.jsx can poll.
// ============================================================

const HandTracker = (() => {

  // Shared state – App.jsx reads these
  const state = {
    x: null,       // hand x position (viewport pixels, mirrored)
    y: null,       // hand y position (viewport pixels)
    gesture: 'none', // 'open' | 'closed' | 'partial' | 'none'
    ready: false,
    error: '',
  };

  // Detect gesture from MediaPipe landmarks
  function detectGesture(landmarks) {
    if (!landmarks || !landmarks.length) return 'none';

    // Finger tip and MCP landmark indices
    const tips = [8, 12, 16, 20]; // index, middle, ring, pinky tips
    const mcps = [6, 10, 14, 18]; // corresponding MCPs

    let extended = 0;
    for (let i = 0; i < 4; i++) {
      // Tip above MCP means finger is extended (y is flipped in screen space)
      if (landmarks[tips[i]].y < landmarks[mcps[i]].y) extended++;
    }

    // Thumb check (horizontal spread)
    const thumbOpen = Math.abs(landmarks[4].x - landmarks[3].x) > 0.04;
    const total = extended + (thumbOpen ? 1 : 0);

    if (total >= 4) return 'open';
    if (total <= 1) return 'closed';
    return 'partial';
  }

  // Process one frame of MediaPipe results
  function onResults(results) {
    if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
      state.x = null;
      state.y = null;
      state.gesture = 'none';
      return;
    }

    const landmarks = results.multiHandLandmarks[0];
    const palm = landmarks[9]; // Palm center

    // Mirror x because video feed is mirrored
    state.x = (1 - palm.x) * window.innerWidth;
    state.y = palm.y * window.innerHeight;
    state.gesture = detectGesture(landmarks);
  }

  // Start camera and MediaPipe
  async function start() {
    const video = document.getElementById('webcam');

    // 1. Get camera stream
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' }
      });
      video.srcObject = stream;
      await video.play();
    } catch (err) {
      state.error = 'Camera blocked – click balloons with mouse!';
      state.ready = true; // allow game to start anyway
      return;
    }

    // 2. Wait for MediaPipe Hands to load (up to 8 seconds)
    let waited = 0;
    while (!window.Hands && waited < 8000) {
      await new Promise(r => setTimeout(r, 250));
      waited += 250;
    }

    if (!window.Hands) {
      state.error = 'Hand tracking unavailable – use mouse!';
      state.ready = true;
      return;
    }

    // 3. Init MediaPipe Hands
    try {
      const hands = new window.Hands({
        locateFile: f =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915/${f}`
      });

      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 0,
        minDetectionConfidence: 0.6,
        minTrackingConfidence: 0.5,
      });

      hands.onResults(onResults);

      // 4. Send frames continuously
      const loop = async () => {
        if (video.readyState >= 2) {
          try { await hands.send({ image: video }); } catch (e) {}
        }
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);

      state.ready = true;
    } catch (err) {
      state.error = 'Hand tracking error – use mouse!';
      state.ready = true;
    }
  }

  // Start immediately
  start();

  // Expose read-only state to window
  return { state };
})();

window.HandTracker = HandTracker;
