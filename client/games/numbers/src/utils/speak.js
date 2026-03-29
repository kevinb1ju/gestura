let isSpeaking = false;

export function speak(text) {
  if (!window.speechSynthesis) return;

  // Cancel anything already queued
  window.speechSynthesis.cancel();

  if (isSpeaking) return;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.9;
  utterance.pitch = 1;

  isSpeaking = true;

  utterance.onend = () => {
    isSpeaking = false;
  };

  utterance.onerror = () => {
    isSpeaking = false;
  };

  window.speechSynthesis.speak(utterance);
}
