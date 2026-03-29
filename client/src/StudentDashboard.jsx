// Dashboard.jsx
import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { getGamesForLevel, getLevelName, launchGame } from "./levelConfig";

// ---------- Animations ----------
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
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  justify-content: center;
`;

/* const GameCardWrapper = styled.div`
  position: relative;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  cursor: pointer;

  &:hover {
    transform: translateY(-10px) scale(1.02);
  }

  img {
    aspect-ratio: 1/1;
    border-radius: 1rem;
    border: 3px solid ${({ buttonColor }) => buttonColor || "#007bff"};
    margin-bottom: 1rem;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  &:hover img {
    transform: scale(1.1);
  }
`; */

// ---------- React Component ----------
export default function StudentDashboard() {
  const [studentData, setStudentData] = useState(null);
  const [levelUpdateNotification, setLevelUpdateNotification] = useState(null);

  useEffect(() => {
    // Get logged-in student data from localStorage
    const loadStudentData = () => {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.role === 'student') {
        // Also check if there's updated data from teacher
        const teacherStudents = JSON.parse(localStorage.getItem('teacherStudents') || '[]');
        const updatedStudent = teacherStudents.find(s => s.studentId === user.studentId);
        
        if (updatedStudent) {
          // Check if level changed
          if (updatedStudent.level !== user.level) {
            // Update the user data with the new level from teacher
            const updatedUser = { ...user, level: updatedStudent.level };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setStudentData(updatedUser);
            console.log('Student level updated from teacher:', updatedStudent.level);
            
            // Show notification instead of auto-refresh
            setLevelUpdateNotification(`Level updated to ${getLevelName(parseInt(updatedStudent.level.replace('Level ', '')))}! New games loaded.`);
            setTimeout(() => {
              setLevelUpdateNotification(null);
            }, 3000);
            return;
          }
          // Also update other fields that might have changed
          const updatedUser = { 
            ...user, 
            ...updatedStudent,
            role: 'student' // Ensure role stays student
          };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          setStudentData(updatedUser);
        } else {
          setStudentData(user);
        }
      }
    };
    
    loadStudentData();
    
    // Listen for storage changes (when level is updated)
    window.addEventListener('storage', loadStudentData);
    
    // Also check periodically for updates (in case same tab)
    const interval = setInterval(loadStudentData, 500); // Check more frequently
    
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
          {levelUpdateNotification && (
            <div style={{
              background: '#10b981',
              color: 'white',
              padding: '1rem',
              borderRadius: '0.5rem',
              marginBottom: '1rem',
              textAlign: 'center',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              animation: 'fadeIn 0.5s ease-in-out'
            }}>
              🎉 {levelUpdateNotification}
            </div>
          )}
          <h2>Welcome back, {studentData?.name || 'Student'}!</h2>
          <div className="level">
            <span>⭐</span> Current Level: {getLevelName(currentLevel)}
          </div>
        </WelcomeSection>

        <GameGrid>
          {games.map((game, index) => (
            <div 
              key={index} 
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: game.bgColor || '#fff',
                padding: '1.5rem',
                borderRadius: '1.5rem',
                border: '4px solid black',
                boxShadow: '6px 6px 0px 0px 0px',
                transform: 'rotate(-1deg)',
                transition: 'all 0.3s ease-in-out'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'rotate(1deg) scale(1.05)';
                e.currentTarget.style.boxShadow = '9px 9px 0px 0px 0px';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'rotate(-1deg)';
                e.currentTarget.style.boxShadow = '6px 6px 0px 0px 0px';
                e.currentTarget.style.boxShadow = '8px 8px 0px rgba(0,0,0,0.2)';
              }}
            >
              <div 
                style={{
                  width: '200px',
                  height: '200px',
                  aspectRatio: '1/1',
                  borderRadius: '1rem',
                  border: `3px solid ${game.buttonColor || '#007bff'}`,
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '6rem',
                  backgroundColor: '#f8f9fa',
                  transition: 'transform 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                {game.img}
              </div>
              <h3 style={{
                fontSize: '1.2rem',
                fontWeight: 'bold',
                margin: '0.5rem 0',
                color: '#333',
                textAlign: 'center',
                fontFamily: 'Fredoka One, cursive',
                textShadow: '1px 1px 0 #000'
              }}>
                {game.title}
              </h3>
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
                onContextMenu={(e) => {
                  e.preventDefault();
                  // Right-click alternative: open directly
                  const gameUrl = window.location.origin + game.path;
                  window.open(gameUrl, '_blank');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  width: '100%',
                  padding: '0.75rem',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  backgroundColor: game.buttonColor || '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  marginTop: '0.5rem'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = game.buttonColor || '#0056b3';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = game.buttonColor || '#007bff';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
                }}
              >
                ▶ Play Now
              </button>
            </div>
          ))}
        </GameGrid>
      </MainContainer>
    </AppWrapper>
  );
}
