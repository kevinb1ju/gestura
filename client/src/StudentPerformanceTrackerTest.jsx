import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  generateRecommendations, 
  calculateLevelProgression,
  PERFORMANCE_LEVELS 
} from './gamePerformanceAnalysis';

// Simplified test version without the problematic analyzeGamePerformance
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

export default function StudentPerformanceTrackerTest({ student, onBack }) {
  const [analysis, setAnalysis] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [levelProgression, setLevelProgression] = useState(null);

  useEffect(() => {
    // Load and analyze performance data
    analyzeStudentPerformance();
  }, [student]);

  const analyzeStudentPerformance = () => {
    // Get stored performance data
    const storedData = localStorage.getItem(`student_performance_${student.studentId}`);
    
    if (storedData) {
      const data = JSON.parse(storedData);
      const analyzedData = analyzePerformanceData(data);
      setAnalysis(analyzedData.overall);
      
      // Generate recommendations
      const recs = generateRecommendations(analyzedData.overall);
      setRecommendations(recs);

      // Calculate level progression
      const currentLevel = parseInt(student.level.replace('Level ', '')) || 1;
      const progression = calculateLevelProgression(analyzedData.overall.overall, currentLevel);
      setLevelProgression(progression);
    } else {
      // Use sample data for demonstration
      const sampleAnalysis = {
        cognitive: { score: 82, level: PERFORMANCE_LEVELS.GOOD },
        motor: { score: 78, level: PERFORMANCE_LEVELS.GOOD },
        social: { score: 85, level: PERFORMANCE_LEVELS.GOOD },
        emotional: { score: 80, level: PERFORMANCE_LEVELS.GOOD },
        overall: 81,
        overallLevel: PERFORMANCE_LEVELS.GOOD
      };
      
      setAnalysis(sampleAnalysis);
      
      const recs = generateRecommendations(sampleAnalysis);
      setRecommendations(recs);

      const currentLevel = parseInt(student.level.replace('Level ', '')) || 1;
      const progression = calculateLevelProgression(sampleAnalysis.overall, currentLevel);
      setLevelProgression(progression);
    }
  };

  const analyzePerformanceData = (data) => {
    const analyses = {};
    let overallCognitive = 0;
    let overallMotor = 0;
    let overallSocial = 0;
    let overallEmotional = 0;
    let gameCount = 0;

    // Simple analysis without calling analyzeGamePerformance
    Object.keys(data).forEach(gameName => {
      const gameData = data[gameName];
      
      // Calculate simple averages for each category
      const cognitiveScore = calculateSimpleAverage(gameData.cognitive);
      const motorScore = calculateSimpleAverage(gameData.motor);
      const socialScore = calculateSimpleAverage(gameData.social);
      const emotionalScore = calculateSimpleAverage(gameData.emotional);
      
      analyses[gameName] = {
        cognitive: { score: cognitiveScore, level: getPerformanceLevel(cognitiveScore) },
        motor: { score: motorScore, level: getPerformanceLevel(motorScore) },
        social: { score: socialScore, level: getPerformanceLevel(socialScore) },
        emotional: { score: emotionalScore, level: getPerformanceLevel(emotionalScore) },
        overall: (cognitiveScore * 0.3 + motorScore * 0.25 + socialScore * 0.25 + emotionalScore * 0.2)
      };
      
      overallCognitive += cognitiveScore;
      overallMotor += motorScore;
      overallSocial += socialScore;
      overallEmotional += emotionalScore;
      gameCount++;
    });

    // Calculate overall averages
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
      }
    };

    overallAnalysis.overall = Math.round(
      (overallAnalysis.cognitive.score * 0.3 +
       overallAnalysis.motor.score * 0.25 +
       overallAnalysis.social.score * 0.25 +
       overallAnalysis.emotional.score * 0.2) * 100
    ) / 100;

    overallAnalysis.overallLevel = getPerformanceLevel(overallAnalysis.overall);

    return {
      overall: overallAnalysis,
      games: analyses
    };
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

  if (!analysis) {
    return <div>Loading performance data...</div>;
  }

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

      {recommendations.length > 0 && (
        <div style={{
          background: '#fef3c7',
          border: '2px solid #f59e0b',
          borderRadius: '10px',
          padding: '1.5rem',
          marginBottom: '2rem'
        }}>
          <h3 style={{ color: '#92400e', margin: '0 0 1rem 0' }}>
            📋 Recommendations
          </h3>
          <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
            {recommendations.map((rec, index) => (
              <li key={index} style={{ marginBottom: '0.5rem', color: '#78350f' }}>
                <strong>{rec.category}:</strong> {rec.suggestion}
                <span style={{
                  display: 'inline-block',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '3px',
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  marginLeft: '0.5rem',
                  background: rec.priority === 'high' ? '#ef4444' : '#f59e0b',
                  color: 'white'
                }}>
                  {rec.priority.toUpperCase()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {levelProgression && (
        <div style={{
          background: '#dbeafe',
          border: '2px solid #3b82f6',
          borderRadius: '10px',
          padding: '1.5rem',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#1e40af', margin: '0 0 1rem 0' }}>
            🎯 Level Progression
          </h3>
          <div style={{ color: '#1e3a8a', fontSize: '1.1rem' }}>
            {levelProgression.suggestion}
          </div>
        </div>
      )}

      <ActionButtons>
        <ActionButton primary onClick={() => alert('Performance data would be saved here')}>
          💾 Save Performance Data
        </ActionButton>
        <ActionButton onClick={onBack}>
          ← Back to Student List
        </ActionButton>
      </ActionButtons>
    </Container>
  );
}
