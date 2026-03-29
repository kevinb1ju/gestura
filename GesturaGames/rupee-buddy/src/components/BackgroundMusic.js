import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const MuteButton = styled.button`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 2000;
  background: rgba(255, 255, 255, 0.8);
  border: 2px solid #ff9933;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  font-size: 1.5rem;

  &:hover {
    transform: scale(1.1);
    background: white;
  }
`;

const BackgroundMusic = () => {
  const audioRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);

  // Using a soft, calm, ambient track URL
  const musicUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3";

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.15; // Set low volume as requested

      const playAudio = () => {
        audioRef.current.play().catch(error => {
          console.log("Autoplay prevented. User interaction required to start audio.");
        });
      };

      // Try to play immediately
      playAudio();

      // Fallback for browsers that block autoplay
      document.addEventListener('click', playAudio, { once: true });

      return () => {
        document.removeEventListener('click', playAudio);
      };
    }
  }, []);

  const toggleMute = () => {
    if (audioRef.current) {
      const newMutedState = !isMuted;
      audioRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={musicUrl}
        loop
      />
      <MuteButton onClick={toggleMute} title={isMuted ? "Unmute" : "Mute"}>
        {isMuted ? "🔇" : "🔊"}
      </MuteButton>
    </>
  );
};

export default BackgroundMusic;
