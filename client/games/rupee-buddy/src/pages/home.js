import React from 'react';
import styled, { keyframes } from 'styled-components';

import { useNavigate } from "react-router-dom";

// Animations
const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(10deg); }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const shimmer = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const wave = keyframes`
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(15deg); }
  75% { transform: rotate(-15deg); }
`;

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #ff9933 0%, #ffffff 50%, #138808 100%);
  padding: 40px 20px;
  position: relative;
  overflow: hidden;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const PatternOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 20% 50%, rgba(255, 153, 51, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(19, 136, 8, 0.1) 0%, transparent 50%);
  pointer-events: none;
`;

const CoinDecoration = styled.div`
  position: absolute;
  font-size: 70px;
  color: rgba(255, 153, 51, 0.3);
  animation: ${float} 6s ease-in-out infinite;
  pointer-events: none;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  
  &.coin-1 { top: 8%; left: 8%; animation-delay: 0s; }
  &.coin-2 { top: 15%; right: 12%; animation-delay: 2s; }
  &.coin-3 { bottom: 12%; left: 10%; animation-delay: 4s; }
  &.coin-4 { bottom: 20%; right: 15%; animation-delay: 3s; }
`;

const HeroSection = styled.div`
  text-align: center;
  margin-bottom: 60px;
  position: relative;
  z-index: 1;
`;

const LogoContainer = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  gap: 15px;
`;

const RupeeLogo = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #ff9933 0%, #ff6600 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: white;
  box-shadow: 0 8px 20px rgba(255, 102, 0, 0.4);
  border: 4px solid white;
`;

const Title = styled.h1`
  font-size: clamp(2.5rem, 6vw, 4rem);
  color: #ff6600;
  margin: 0 0 10px 0;
  font-weight: 900;
  text-shadow: 3px 3px 0px rgba(19, 136, 8, 0.3);
  line-height: 1.2;
  letter-spacing: -1px;
`;

const TitleAccent = styled.span`
  color: #138808;
  display: inline-block;
  animation: ${wave} 2s ease-in-out infinite;
  transform-origin: center bottom;
`;

const Subtitle = styled.p`
  font-size: clamp(1.1rem, 3vw, 1.4rem);
  color: #2d5016;
  margin: 0;
  font-weight: 600;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8);
`;

const CardsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative;
  z-index: 1;
`;

const GameCard = styled.div`
  width: 260px;
  height: 300px;
  border-radius: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.2);
  border: 4px solid white;
  
  &:hover {
    transform: translateY(-15px) scale(1.05) rotate(2deg);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
  }
  
  &:active {
    transform: translateY(-10px) scale(1.02);
  }

  &.learn-card {
    background: linear-gradient(135deg, #ffa726 0%, #ff6f00 100%);
  }
  
  &.practice-card {
    background: linear-gradient(135deg, #66bb6a 0%, #2e7d32 100%);
  }
  
  &.test-card {
    background: linear-gradient(135deg, #ffca28 0%, #f57c00 100%);
  }
`;

const CardPattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.1;
  background-image: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 10px,
    rgba(255, 255, 255, 0.5) 10px,
    rgba(255, 255, 255, 0.5) 11px
  );
`;

const CardShine = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transform: translateX(-100%);
  
  ${GameCard}:hover & {
    animation: ${shimmer} 1s ease-in-out;
  }
`;

const CardIcon = styled.div`
  font-size: 5rem;
  margin-bottom: 15px;
  filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.3));
  transition: transform 0.3s ease;
  
  ${GameCard}:hover & {
    transform: scale(1.2) rotate(10deg);
  }
`;

const CardTitle = styled.h2`
  font-size: 2rem;
  margin: 0 0 10px 0;
  color: white;
  font-weight: 800;
  text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.4);
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const CardDescription = styled.p`
  font-size: 1.1rem;
  margin: 0;
  color: rgba(255, 255, 255, 0.95);
  font-weight: 600;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const DecorationCircle = styled.div`
  position: absolute;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 153, 51, 0.2) 0%, transparent 70%);
  
  &.circle-1 { top: 5%; right: 5%; }
  &.circle-2 { bottom: 10%; left: 5%; }
`;

// Main Component
function Home() {
  const navigate = useNavigate();

    const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <Container>
      <PatternOverlay />
      <DecorationCircle className="circle-1" />
      <DecorationCircle className="circle-2" />
      
      <CoinDecoration className="coin-1">₹</CoinDecoration>
      <CoinDecoration className="coin-2">₹</CoinDecoration>
      <CoinDecoration className="coin-3">₹</CoinDecoration>
      <CoinDecoration className="coin-4">₹</CoinDecoration>
      
      <HeroSection>
        <LogoContainer>
          <RupeeLogo>₹</RupeeLogo>
        </LogoContainer>
        
        <Title>
          Rupee <TitleAccent>Buddy</TitleAccent>
        </Title>
        
        <Subtitle>Your friendly guide to Indian currency! 🇮🇳</Subtitle>
      </HeroSection>

      <CardsContainer>
        <GameCard className="learn-card" onClick={() => handleNavigate('/learn')}>
          <CardPattern />
          <CardIcon>📚</CardIcon>
          <CardTitle>Learn</CardTitle>
          <CardDescription>Discover notes & coins</CardDescription>
          <CardShine />
        </GameCard>

        <GameCard className="practice-card" onClick={() => handleNavigate('/practice')}>
          <CardPattern />
          <CardIcon>🎯</CardIcon>
          <CardTitle>Practice</CardTitle>
          <CardDescription>Count like a pro</CardDescription>
          <CardShine />
        </GameCard>
      </CardsContainer>
    </Container>
  );
}

export default Home;