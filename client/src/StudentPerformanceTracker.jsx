import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  analyzeGamePerformance,
  generateRecommendations,
  calculateLevelProgression,
  PERFORMANCE_CATEGORIES,
  PERFORMANCE_LEVELS
} from './gamePerformanceAnalysis';

// Styled Components
const Container = styled.div`
  background: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e5e7eb;
`;

const Title = styled.h2`
  color: #374151;
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
`;

const StudentInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const StudentAvatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
`;

const StudentName = styled.h3`
  color: #1f2937;
  font-size: 1.2rem;
  margin: 0;
`;

const PerformanceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const PerformanceCard = styled.div`
  background: #f9fafb;
  border-radius: 10px;
  padding: 1.5rem;
  border-left: 4px solid ${props => props.color || '#3b82f6'};
`;

const CategoryTitle = styled.h4`
  color: #374151;
  font-size: 1.1rem;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ScoreDisplay = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const ScoreValue = styled.span`
  font-size: 2rem;
  font-weight: bold;
  color: ${props => props.color || '#3b82f6'};
`;

const ScoreLabel = styled.span`
  font-size: 0.9rem;
  color: #6b7280;
  padding: 0.25rem 0.5rem;
  background: ${props => props.color || '#3b82f6'}20;
  border-radius: 5px;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 1rem;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: ${props => props.color || '#3b82f6'};
  border-radius: 4px;
  transition: width 0.3s ease;
`;

const GameSection = styled.div`
  margin-bottom: 2rem;
`;

const GameTitle = styled.h3`
  color: #1f2937;
  font-size: 1.2rem;
  margin-bottom: 1rem;
`;

const GameGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`;

const GameCard = styled.div`
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #3b82f6;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
`;

const GameIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const GameName = styled.div`
  font-weight: bold;
  color: #374151;
  margin-bottom: 0.5rem;
`;

const GameScore = styled.div`
  font-size: 0.9rem;
  color: ${props => props.color || '#6b7280'};
`;

const RecommendationsSection = styled.div`
  background: #fef3c7;
  border: 2px solid #f59e0b;
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const RecommendationsTitle = styled.h3`
  color: #92400e;
  margin: 0 0 1rem 0;
`;

const RecommendationList = styled.ul`
  margin: 0;
  padding-left: 1.5rem;
`;

const RecommendationItem = styled.li`
  margin-bottom: 0.5rem;
  color: #78350f;
  
  &::marker {
    color: #f59e0b;
  }
`;

const PriorityBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 3px;
  font-size: 0.8rem;
  font-weight: bold;
  margin-left: 0.5rem;
  background: ${props =>
    props.priority === 'high' ? '#ef4444' :
      props.priority === 'medium' ? '#f59e0b' : '#10b981'
  };
  color: white;
`;

const LevelProgressionSection = styled.div`
  background: #dbeafe;
  border: 2px solid #3b82f6;
  border-radius: 10px;
  padding: 1.5rem;
  text-align: center;
`;

const LevelProgressionTitle = styled.h3`
  color: #1e40af;
  margin: 0 0 1rem 0;
`;

const LevelProgressionContent = styled.div`
  color: #1e3a8a;
  font-size: 1.1rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const ActionButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${props => props.primary ? `
    background: #3b82f6;
    color: white;
    
    &:hover {
      background: #2563eb;
    }
  ` : `
    background: #e5e7eb;
    color: #374151;
    
    &:hover {
      background: #d1d5db;
    }
  `}
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 15px;
  padding: 2rem;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h3`
  color: #1f2937;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
  
  &:hover {
    color: #374151;
  }
`;

const MetricDetails = styled.div`
  margin-bottom: 1rem;
`;

const MetricName = styled.div`
  font-weight: bold;
  color: #374151;
  margin-bottom: 0.25rem;
`;

const MetricDescription = styled.div`
  font-size: 0.9rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
`;

const MetricScore = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const MetricBar = styled.div`
  flex: 1;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
`;

const MetricFill = styled.div`
  height: 100%;
  background: ${props => props.color || '#3b82f6'};
  border-radius: 3px;
`;

const MetricValue = styled.span`
  font-weight: bold;
  color: ${props => props.color || '#3b82f6'};
  min-width: 50px;
  text-align: right;
`;

export default function StudentPerformanceTracker({ student, onBack }) {
  const [performanceData, setPerformanceData] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [levelProgression, setLevelProgression] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [analyses, setAnalyses] = useState({});

  useEffect(() => {
    // Load performance data for this student
    loadStudentPerformance();
  }, [student]);

  const loadStudentPerformance = () => {
    // Check if student has played any games (this function aggregates all game_sessions to create the single performance entry)
    const gameData = checkForGameData(student.studentId);
    if (gameData) {
      setPerformanceData(gameData);
      analyzePerformance(gameData);
    } else {
      // Show message that no game data is available
      setPerformanceData(null);
      setAnalysis(null);
    }
  };

  const checkForGameData = (studentId) => {
    console.log('🔍 Checking for game data for student:', studentId);

    // First check for aggregated performance data
    const keys = Object.keys(localStorage).filter(key =>
      key.startsWith('student_performance_')
    );

    // Try to find exact match first
    const exactMatch = keys.find(key => key === `student_performance_${studentId}`);
    if (exactMatch) {
      const data = JSON.parse(localStorage.getItem(exactMatch));
      console.log('✅ Found exact performance match:', data);
      return data;
    }

    // Try partial match
    const partialMatch = keys.find(key => key.includes(studentId));
    if (partialMatch) {
      const data = JSON.parse(localStorage.getItem(partialMatch));
      console.log('✅ Found partial performance match:', data);
      return data;
    }

    // Check for individual game sessions and aggregate them
    const gameKeys = Object.keys(localStorage).filter(key =>
      key.includes('game_session') && key.includes(studentId)
    );
    console.log('🎮 Found game session keys:', gameKeys);

    if (gameKeys.length > 0) {
      const aggregatedData = {};
      let sessionCount = 0;

      gameKeys.forEach(key => {
        try {
          const gameSession = JSON.parse(localStorage.getItem(key));
          console.log('📊 Processing game session:', gameSession);

          if (gameSession.gameName && gameSession.performance) {
            // gameSession.performance already contains the detailed { cognitive: {...}, motor: {...}, etc } objects
            // Use this structured object directly so analyzeGamePerformance can read the specific metrics.
            aggregatedData[gameSession.gameName] = gameSession.performance;
            sessionCount++;
          } else if (gameSession.gameName && gameSession.score !== undefined) {
            console.log(`Fallback score used for ${gameSession.gameName}`);
          }
        } catch (e) {
          console.error('❌ Error parsing game session:', key, e);
        }
      });

      console.log('📈 Aggregated data from sessions:', aggregatedData);
      console.log(`🎮 Processed ${sessionCount} game sessions`);

      if (Object.keys(aggregatedData).length > 0) {
        // Save the aggregated data for future use
        localStorage.setItem(`student_performance_${studentId}`, JSON.stringify(aggregatedData));
        return aggregatedData;
      }
    }

    // Check for common test student IDs
    const testIds = ['TEST_STUDENT_001', 'DEMO_STUDENT', 'student123', 'TEST_STUDENT_MULTI'];
    for (const testId of testIds) {
      const testKey = `student_performance_${testId}`;
      const testData = localStorage.getItem(testKey);
      if (testData) {
        console.log(`🧪 Found test data for ${testId}, using it for ${studentId}`);
        return JSON.parse(testData);
      }
    }

    console.log('❌ No game data found for student:', studentId);
    return null;
  };

  const generateSamplePerformanceData = () => {
    return {
      'Egg Hunt': {
        cognitive: {
          pattern_recognition: 85,
          attention_span: 78,
          problem_solving: 82,
          memory: 75
        },
        motor: {
          hand_eye_coordination: 88,
          fine_motor_control: 76,
          reaction_time: 80
        },
        social: {
          cooperation: 90,
          communication: 85,
          sharing: 88
        },
        emotional: {
          frustration_tolerance: 82,
          persistence: 87,
          confidence: 79,
          emotional_regulation: 84
        }
      },
      'Pop Game': {
        cognitive: {
          visual_processing: 92,
          attention_to_detail: 88,
          concentration: 85,
          decision_making: 90
        },
        motor: {
          reaction_speed: 95,
          accuracy: 87,
          timing: 89
        },
        social: {
          turn_taking: 93,
          peer_interaction: 88,
          sportsmanship: 91
        },
        emotional: {
          impulse_control: 86,
          patience: 89,
          excitement_management: 87,
          resilience: 90
        }
      }
    };
  };

  const analyzePerformance = (data) => {
    const analyses = {};
    let overallCognitive = 0;
    let overallMotor = 0;
    let overallSocial = 0;
    let overallEmotional = 0;
    let gameCount = 0;

    // Analyze each game using the comprehensive analyzer
    Object.keys(data).forEach(gameName => {
      try {
        const gameData = data[gameName];

        // Ensure game performance metrics exist for this game name
        const gameAnalysis = analyzeGamePerformance(gameName, gameData);

        analyses[gameName] = gameAnalysis;

        overallCognitive += gameAnalysis.cognitive.score;
        overallMotor += gameAnalysis.motor.score;
        overallSocial += gameAnalysis.social.score;
        overallEmotional += gameAnalysis.emotional.score;
        gameCount++;
      } catch (e) {
        console.warn(`Could not analyze game performance for ${gameName}:`, e);
      }
    });

    // Calculate overall averages
    if (gameCount > 0) {
      const overallAnalysis = {
        cognitive: {
          score: Math.round(overallCognitive / gameCount * 100) / 100,
          level: getPerformanceLevel(overallCognitive / gameCount)
        },
        motor: {
          score: Math.round(overallMotor / gameCount * 100) / 100,
          level: getPerformanceLevel(overallMotor / gameCount)
        },
        social: {
          score: Math.round(overallSocial / gameCount * 100) / 100,
          level: getPerformanceLevel(overallSocial / gameCount)
        },
        emotional: {
          score: Math.round(overallEmotional / gameCount * 100) / 100,
          level: getPerformanceLevel(overallEmotional / gameCount)
        },
        overall: Math.round(
          ((overallCognitive / gameCount) * 0.3 +
            (overallMotor / gameCount) * 0.25 +
            (overallSocial / gameCount) * 0.25 +
            (overallEmotional / gameCount) * 0.2) * 100
        ) / 100
      };

      overallAnalysis.overallLevel = getPerformanceLevel(overallAnalysis.overall);
      setAnalysis(overallAnalysis);

      // Generate recommendations
      const recs = generateRecommendations(overallAnalysis);
      setRecommendations(recs);

      // Calculate level progression
      const currentLevel = student.level ? parseInt(student.level.toString().replace('Level ', '')) || 1 : 1;
      const progression = calculateLevelProgression(overallAnalysis.overall, currentLevel);
      setLevelProgression(progression);
    }

    setAnalyses(analyses);
  };

  const calculateSimpleAverage = (categoryData) => {
    if (!categoryData || typeof categoryData !== 'object') return 0;

    const values = Object.values(categoryData).filter(val => typeof val === 'number');
    return values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
  };

  const getPerformanceLevel = (score) => {
    if (score >= 90) return PERFORMANCE_LEVELS.EXCELLENT;
    if (score >= 75) return PERFORMANCE_LEVELS.GOOD;
    if (score >= 60) return PERFORMANCE_LEVELS.AVERAGE;
    if (score >= 40) return PERFORMANCE_LEVELS.BELOW_AVERAGE;
    return PERFORMANCE_LEVELS.NEEDS_IMPROVEMENT;
  };

  const showGameDetails = (gameName) => {
    setSelectedGame(gameName);
    setShowModal(true);
  };

  const savePerformanceData = () => {
    if (performanceData) {
      localStorage.setItem(`student_performance_${student.studentId}`, JSON.stringify(performanceData));
      alert('Performance data saved successfully!');
    }
  };

  const sendReportToParent = () => {
    const reportData = {
      timestamp: new Date().toISOString(),
      analysis: analysis,
      recommendations: recommendations,
      levelProgression: levelProgression
    };

    // Save report to localStorage for Parent Dashboard to read
    const key = `parent_report_${student.studentId}`;
    localStorage.setItem(key, JSON.stringify(reportData));
    alert('Report sent to parent successfully!');
  };

  if (!analysis) {
    return (
      <Container>
        <Header>
          <Title>Student Performance Analysis</Title>
          <div>
            <h3 style={{ color: '#1f2937', fontSize: '1.2rem', margin: 0 }}>
              {student.name}
            </h3>
          </div>
        </Header>

        <div style={{
          background: '#fef3c7',
          border: '2px solid #f59e0b',
          borderRadius: '10px',
          padding: '2rem',
          textAlign: 'center',
          margin: '2rem 0'
        }}>
          <h3 style={{ color: '#92400e', marginBottom: '1rem' }}>
            🎮 No Game Data Available
          </h3>
          <p style={{ color: '#78350f', marginBottom: '1rem' }}>
            This student hasn't played any games yet. Performance analysis requires game play data.
          </p>
          <p style={{ color: '#78350f', marginBottom: '1.5rem' }}>
            Please have the student play games first, then check back for performance analysis.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <ActionButton primary onClick={() => window.open('/dashboard', '_blank')}>
              🎮 Go to Student Dashboard
            </ActionButton>
            <ActionButton onClick={onBack}>
              ← Back to Student List
            </ActionButton>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Student Performance Analysis</Title>
        <StudentInfo>
          <StudentAvatar src={student.photo || student.avatar} />
          <StudentName>{student.name}</StudentName>
        </StudentInfo>
      </Header>

      <PerformanceGrid>
        <PerformanceCard color={analysis.cognitive.level.color}>
          <CategoryTitle>
            🧠 Cognitive
          </CategoryTitle>
          <ScoreDisplay>
            <ScoreValue color={analysis.cognitive.level.color}>
              {analysis.cognitive.score}
            </ScoreValue>
            <ScoreLabel color={analysis.cognitive.level.color}>
              {analysis.cognitive.level.level}
            </ScoreLabel>
          </ScoreDisplay>
          <ProgressBar>
            <ProgressFill
              color={analysis.cognitive.level.color}
              style={{ width: `${analysis.cognitive.score}%` }}
            />
          </ProgressBar>
        </PerformanceCard>

        <PerformanceCard color={analysis.motor.level.color}>
          <CategoryTitle>
            💪 Motor Skills
          </CategoryTitle>
          <ScoreDisplay>
            <ScoreValue color={analysis.motor.level.color}>
              {analysis.motor.score}
            </ScoreValue>
            <ScoreLabel color={analysis.motor.level.color}>
              {analysis.motor.level.level}
            </ScoreLabel>
          </ScoreDisplay>
          <ProgressBar>
            <ProgressFill
              color={analysis.motor.level.color}
              style={{ width: `${analysis.motor.score}%` }}
            />
          </ProgressBar>
        </PerformanceCard>

        <PerformanceCard color={analysis.social.level.color}>
          <CategoryTitle>
            👥 Social
          </CategoryTitle>
          <ScoreDisplay>
            <ScoreValue color={analysis.social.level.color}>
              {analysis.social.score}
            </ScoreValue>
            <ScoreLabel color={analysis.social.level.color}>
              {analysis.social.level.level}
            </ScoreLabel>
          </ScoreDisplay>
          <ProgressBar>
            <ProgressFill
              color={analysis.social.level.color}
              style={{ width: `${analysis.social.score}%` }}
            />
          </ProgressBar>
        </PerformanceCard>

        <PerformanceCard color={analysis.emotional.level.color}>
          <CategoryTitle>
            ❤️ Emotional
          </CategoryTitle>
          <ScoreDisplay>
            <ScoreValue color={analysis.emotional.level.color}>
              {analysis.emotional.score}
            </ScoreValue>
            <ScoreLabel color={analysis.emotional.level.color}>
              {analysis.emotional.level.level}
            </ScoreLabel>
          </ScoreDisplay>
          <ProgressBar>
            <ProgressFill
              color={analysis.emotional.level.color}
              style={{ width: `${analysis.emotional.score}%` }}
            />
          </ProgressBar>
        </PerformanceCard>

        <PerformanceCard color={analysis.overallLevel.color}>
          <CategoryTitle>
            📊 Overall Progress
          </CategoryTitle>
          <ScoreDisplay>
            <ScoreValue color={analysis.overallLevel.color}>
              {analysis.overall}
            </ScoreValue>
            <ScoreLabel color={analysis.overallLevel.color}>
              {analysis.overallLevel.level}
            </ScoreLabel>
          </ScoreDisplay>
          <ProgressBar>
            <ProgressFill
              color={analysis.overallLevel.color}
              style={{ width: `${analysis.overall}%` }}
            />
          </ProgressBar>
        </PerformanceCard>
      </PerformanceGrid>

      <GameSection>
        <GameTitle>🎮 Game Performance Details</GameTitle>
        <GameGrid>
          {Object.keys(performanceData).map(gameName => (
            <GameCard
              key={gameName}
              onClick={() => showGameDetails(gameName)}
            >
              <GameIcon>{getGameIcon(gameName)}</GameIcon>
              <GameName>{gameName}</GameName>
              <GameScore color={analyses[gameName]?.overallLevel?.color || '#6b7280'}>
                Score: {analyses[gameName]?.overall || 'N/A'}
              </GameScore>
            </GameCard>
          ))}
        </GameGrid>
      </GameSection>

      {recommendations.length > 0 && (
        <RecommendationsSection>
          <RecommendationsTitle>📋 Recommendations</RecommendationsTitle>
          <RecommendationList>
            {recommendations.map((rec, index) => (
              <RecommendationItem key={index}>
                <strong>{rec.category}:</strong> {rec.suggestion}
                <PriorityBadge priority={rec.priority}>
                  {rec.priority.toUpperCase()}
                </PriorityBadge>
              </RecommendationItem>
            ))}
          </RecommendationList>
        </RecommendationsSection>
      )}

      {levelProgression && (
        <LevelProgressionSection>
          <LevelProgressionTitle>🎯 Level Progression</LevelProgressionTitle>
          <LevelProgressionContent>
            {levelProgression.suggestion}
          </LevelProgressionContent>
        </LevelProgressionSection>
      )}

      <ActionButtons>
        <ActionButton primary onClick={savePerformanceData}>
          💾 Save Performance Data
        </ActionButton>
        <ActionButton primary style={{ backgroundColor: '#10b981' }} onClick={sendReportToParent}>
          📤 Send Report to Parent
        </ActionButton>
        <ActionButton onClick={onBack}>
          ← Back to Student List
        </ActionButton>
      </ActionButtons>

      {showModal && selectedGame && (
        <Modal onClick={() => setShowModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>{selectedGame} Performance Details</ModalTitle>
              <CloseButton onClick={() => setShowModal(false)}>×</CloseButton>
            </ModalHeader>

            {analyses[selectedGame] && (
              <div>
                {Object.keys(analyses[selectedGame]).map(category => {
                  if (category === 'overall') return null;
                  const categoryData = analyses[selectedGame][category];
                  return (
                    <div key={category}>
                      <h4 style={{ color: categoryData.level.color, marginBottom: '1rem' }}>
                        {category.charAt(0).toUpperCase() + category.slice(1)} Performance
                      </h4>
                      {Object.keys(categoryData.details).map(metric => (
                        <MetricDetails key={metric}>
                          <MetricName>{metric.replace(/_/g, ' ').toUpperCase()}</MetricName>
                          <MetricDescription>{categoryData.details[metric].description}</MetricDescription>
                          <MetricScore>
                            <MetricBar>
                              <MetricFill
                                color={categoryData.level.color}
                                style={{ width: `${categoryData.details[metric].score}%` }}
                              />
                            </MetricBar>
                            <MetricValue color={categoryData.level.color}>
                              {categoryData.details[metric].score}%
                            </MetricValue>
                          </MetricScore>
                        </MetricDetails>
                      ))}
                    </div>
                  );
                })}
              </div>
            )}
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
}

const getGameIcon = (gameName) => {
  const icons = {
    'Egg Hunt': '🥚',
    'Pop Game': '🎈',
    'Shape Explorers': '🔷',
    'Color Quest': '🎨',
    'Number Adventures': '🔢',
    'Bridge Game': '🌉',
    'Rupee Buddy': '💰',
    'Rupee Buddy Vocational': '💼'
  };
  return icons[gameName] || '🎮';
};
