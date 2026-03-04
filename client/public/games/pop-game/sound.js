// ============================================================
//  sound.js  –  All game sounds using Web Audio API
//  AudioContext is unlocked on first user gesture to avoid
//  browser autoplay restrictions.
// ============================================================

const SoundManager = (() => {
  let ctx = null;
  let bgTimer = null;
  let muted = false;

  // Call this on first button click to unlock audio
  function unlock() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
  }

  function now() { return ctx ? ctx.currentTime : 0; }

  // Core oscillator helper
  function osc(freq, type, vol, dur, when, freqEnd) {
    if (!ctx || muted) return;
    try {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g);
      g.connect(ctx.destination);
      o.type = type;
      o.frequency.setValueAtTime(freq, when);
      if (freqEnd) o.frequency.exponentialRampToValueAtTime(freqEnd, when + dur);
      g.gain.setValueAtTime(vol, when);
      g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
      o.start(when);
      o.stop(when + dur);
    } catch (e) {}
  }

  function toggleMute() {
    muted = !muted;
    if (muted) stopBg();
    else startBg();
    return muted;
  }

  function pop() {
    if (!ctx || muted) return;
    const t = now();
    osc(800, 'square', 0.4, 0.13, t, 60);
    osc(1200, 'sine',  0.15, 0.06, t);
  }

  function miss() {
    if (!ctx || muted) return;
    osc(300, 'sawtooth', 0.25, 0.4, now(), 140);
  }

  function levelUp() {
    if (!ctx || muted) return;
    [523, 659, 784, 1047, 1319].forEach((f, i) =>
      osc(f, 'triangle', 0.28, 0.22, now() + i * 0.1)
    );
  }

  function cheer() {
    if (!ctx || muted) return;
    [523, 659, 784, 1047, 1319, 1568].forEach((f, i) =>
      osc(f, 'triangle', 0.22, 0.5, now() + i * 0.08)
    );
  }

  function startBg() {
    if (!ctx || muted) return;
    if (bgTimer) clearTimeout(bgTimer);
    const notes = [
      [523,.25],[587,.25],[659,.25],[698,.25],
      [784,.5],[784,.25],[698,.25],
      [659,.25],[587,.25],[523,.5],[523,.5],
      [659,.25],[659,.25],[784,.25],[784,.25],[1047,.75],
    ];
    let t = now() + 0.1;
    let total = 0;
    notes.forEach(([f, d]) => { osc(f, 'sine', 0.07, d, t); t += d; total += d; });
    bgTimer = setTimeout(startBg, (total + 0.8) * 1000);
  }

  function stopBg() {
    if (bgTimer) { clearTimeout(bgTimer); bgTimer = null; }
  }

  // Expose public API on window so App.jsx can use it
  return { unlock, toggleMute, pop, miss, levelUp, cheer, startBg, stopBg };
})();

window.SoundManager = SoundManager;
