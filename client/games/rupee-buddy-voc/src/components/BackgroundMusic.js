import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const MusicControls = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  background: rgba(255, 255, 255, 0.85);
  padding: 12px 18px;
  border-radius: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(8px);
  border: 2px solid #ff9933;
`;

const ControlRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
  }
`;

const Attribution = styled.div`
  font-size: 0.65rem;
  color: #555;
  text-align: right;
  line-height: 1.2;
  font-style: italic;
  max-width: 180px;
  
  a {
    color: #138808;
    text-decoration: none;
    font-weight: bold;
    &:hover { text-decoration: underline; }
  }
`;

const BackgroundMusic = () => {
    const audioRef = useRef(null);
    const [isMuted, setIsMuted] = useState(() => {
        return localStorage.getItem('rupeeBuddyMuted') === 'true';
    });

    const CONSTANT_VOL = 0.15;

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = CONSTANT_VOL;
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('rupeeBuddyMuted', isMuted);
    }, [isMuted]);

    const toggleMute = () => {
        setIsMuted(!isMuted);
        // Explicitly try to play on interaction if not muted, 
        // though autoPlay + muted=false usually works after first click.
        if (isMuted && audioRef.current) {
            audioRef.current.play().catch(err => {
                console.warn("Audio play failed on unmute:", err);
            });
        }
    };

    const handleAudioError = () => {
        console.warn("Background music error encountered. Attempting to reload...");
        if (audioRef.current) {
            audioRef.current.load();
            if (!isMuted) {
                audioRef.current.play().catch(() => { });
            }
        }
    };

    return (
        <>
            <audio
                ref={audioRef}
                src="https://incompetech.com/music/royalty-free/mp3-royaltyfree/Hyperfun.mp3"
                loop
                autoPlay
                muted={isMuted}
                preload="auto"
                onError={handleAudioError}
            />
            <MusicControls>
                <ControlRow>
                    <IconButton onClick={toggleMute} title={isMuted ? "Unmute Music" : "Mute Music"}>
                        {isMuted ? "🔇" : "🔊"}
                    </IconButton>
                </ControlRow>
            </MusicControls>
        </>
    );
};

export default BackgroundMusic;
