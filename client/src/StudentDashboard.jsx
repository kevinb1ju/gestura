// Dashboard.jsx
import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { getGamesForLevel, getLevelName, launchGame } from "./levelConfig";

// ---------- Animations ----------
const wobble = keyframes`
  0%, 100% { transform: rotate(-3deg); }
  50% { transform: rotate(3deg); }
`;

const bounce = keyframes`
  0%,20%,50%,80%,100% { transform: translateY(0); }
  40% { transform: translateY(-20px); }
  60% { transform: translateY(-10px); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const sunRays = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const cloudDrift = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100vw); }
`;

const starShine = keyframes`
  0%,100% { transform: scale(1); opacity:1; }
  50% { transform: scale(1.3); opacity:0.7; }
`;

// ---------- Styled Components ----------
const AppWrapper = styled.div`
  font-family: 'Comic Neue', cursive;
  color: #333;
  overflow-x: hidden;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(to bottom, #60a5fa, #bae6fd);
  position: relative;
`;

const BackgroundDecor = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;

  .sun {
    position: absolute;
    top: -4rem;
    right: -4rem;
    width: 12rem;
    height: 12rem;
    background-color: #facc15;
    border-radius: 50%;
    &::after {
      content: '';
      position: absolute;
      inset: 0;
      animation: ${sunRays} 30s linear infinite;
    }
  }

  .cloud {
    position: absolute;
    background-color: rgba(255,255,255,0.6);
    border-radius: 999px;
  }

  .cloud1 { top:25%; left:-5rem; width:12rem; height:6rem; animation: ${cloudDrift} 20s linear infinite; }
  .cloud2 { top:33%; left:-8rem; width:16rem; height:8rem; animation: ${cloudDrift} 20s linear infinite 5s; }
  .cloud3 { top:50%; right:-10rem; width:14rem; height:7rem; animation: ${cloudDrift} 25s linear infinite reverse 2s; }

  .floating-icon {
    position: absolute;
    animation: ${float} 8s ease-in-out infinite;
  }
`;

const HeaderWrapper = styled.header`
  position: sticky;
  top: 0;
  z-index: 20;
  background-color: rgba(189, 189, 189, 0.8);
  backdrop-filter: blur(5px);
  border-bottom: 2px solid black;
`;

const HeaderContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0.5rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.div`
  display: flex;
  font-family: 'Fredoka', cursive;
  font-weight: 700;
  font-size: 2.5rem;
  gap: 0.1rem;
  text-shadow: -1px -1px 0 rgba(255, 255, 255, 0.6),
    1px -1px 0 rgba(255, 255, 255, 0.6), -1px 1px 0 rgba(255, 255, 255, 0.6),
    1px 1px 0 rgba(255, 255, 255, 0.6), 2px 4px 6px rgba(0, 0, 0, 0.3);
`;

const MainContainer = styled.main`
  flex-grow: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  z-index: 10;
`;

const WelcomeSection = styled.div`
  text-align: center;
  margin-bottom: 2rem;

  h2 {
    font-family: 'Fredoka One', cursive;
    font-size: 3rem;
    color: #ff6b6b;
    text-shadow: 2px 2px 0 #000;
  }

  .level {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 1rem;
    background-color: #f9d423;
    color: black;
    font-weight: bold;
    padding: 0.5rem 1rem;
    border-radius: 9999px;
    font-size: 1.125rem;
    transform: rotate(2deg);

    span:first-child {
      font-size: 1.25rem;
      color: #facc15;
      animation: ${starShine} 1.5s ease-in-out infinite;
    }
  }
`;

const GameGrid = styled.div`
  display: flex;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
`;

const GameCardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${({ bgColor }) => bgColor || "#fff"};
  padding: 0.75rem;
  border-radius: 1rem;
  border: 3px solid black;
  box-shadow: 6px 6px 0px 0px black;
  transform: rotate(-1deg);
  transition: all 0.3s ease-in-out;

  &:hover {
    transform: rotate(1deg) scale(1.05);
    box-shadow: 9px 9px 0px 0px black;
  }

  img {
    width: 100%;
    aspect-ratio: 1/1;
    border-radius: 1rem;
    border: 2px solid black;
    margin-bottom: 0.5rem;
  }

  h3 {
    font-family: 'Fredoka One', cursive;
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    text-shadow: 1px 1px 0 #000;
    color: #fff;
  }

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.625rem;
    font-size: 1.25rem;
    font-weight: bold;
    background-color: ${({ buttonColor }) => buttonColor || "#3498db"};
    color: #fff;
    border-radius: 0.75rem;
    border: 3px solid black;
    cursor: pointer;
    transition: all 0.15s ease-in-out;

    &:hover { opacity: 0.9; }
    &:active { transform: translateY(0.5px); }
  }
`;

// ---------- React Component ----------
export default function StudentDashboard() {
  const [studentData, setStudentData] = useState(null);

  useEffect(() => {
    // Get logged-in student data from localStorage
    const loadStudentData = () => {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.role === 'student') {
        setStudentData(user);
      }
    };
    
    loadStudentData();
    
    // Listen for storage changes (when level is updated)
    window.addEventListener('storage', loadStudentData);
    
    // Also check periodically for updates (in case same tab)
    const interval = setInterval(loadStudentData, 1000);
    
    return () => {
      window.removeEventListener('storage', loadStudentData);
      clearInterval(interval);
    };
  }, []);

  // Extract level number from "Level X" format
  const currentLevel = studentData?.level ? 
    (typeof studentData.level === 'string' ? 
      parseInt(studentData.level.replace('Level ', '')) : 
      studentData.level) : 
    3;

  // Get games based on student's current level
  const games = getGamesForLevel(currentLevel);
  console.log('Current level:', currentLevel);
  console.log('Games for this level:', games);

  return (
    <AppWrapper>
      <BackgroundDecor>
        <div className="sun"></div>
        <div className="cloud cloud1"></div>
        <div className="cloud cloud2"></div>
        <div className="cloud cloud3"></div>
        <span className="floating-icon" style={{top:"50%", left:"25%", fontSize:"3rem", color:"#f97316"}}>🎮</span>
        <span className="floating-icon" style={{bottom:"25%", left:"50%", fontSize:"4rem", color:"#22c55e"}}>🧩</span>
        <span className="floating-icon" style={{top:"10%", right:"33%", fontSize:"2.5rem", color:"#6366f1"}}>🎨</span>
      </BackgroundDecor>

      <HeaderWrapper>
        <HeaderContainer>
          <Logo>
            <span style={{color:"#FF0000"}}>G</span>
            <span style={{color:"#FFFF00"}}>e</span>
            <span style={{color:"#008000"}}>s</span>
            <span style={{color:"#0000FF"}}>t</span>
            <span style={{color:"#800080"}}>u</span>
            <span style={{color:"#FFC0CB"}}>r</span>
            <span style={{color:"#FFA500"}}>a</span>
          </Logo>
        </HeaderContainer>
      </HeaderWrapper>

      <MainContainer>
        <WelcomeSection>
          <h2>Welcome back, {studentData?.name || 'Student'}!</h2>
          <div className="level">
            <span>⭐</span> Current Level: {getLevelName(currentLevel)}
          </div>
        </WelcomeSection>

        <GameGrid>
          {games.map((game, index) => (
            <GameCardWrapper key={index} bgColor={game.bgColor} buttonColor={game.buttonColor}>
              <img src={game.img} alt={game.title} />
              <h3>{game.title}</h3>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  console.log('Button clicked for game:', game);
                  try {
                    launchGame(game);
                  } catch (error) {
                    console.error('Error launching game:', error);
                    alert('Error launching game. Please check console for details.');
                  }
                }}
              >
                ▶ Play Now
              </button>
            </GameCardWrapper>
          ))}
        </GameGrid>
      </MainContainer>
    </AppWrapper>
  );
}
