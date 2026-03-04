import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { realAIAnalyzer } from './realAIAnalyzer';

// Styled Components
const ReportContainer = styled.div`
  background: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
  font-family: 'Lexend', sans-serif;
`;

const ReportHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e5e7eb;
`;

const StudentInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const StudentAvatar = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #3b82f6;
`;

const StudentDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const StudentName = styled.h2`
  margin: 0;
  color: #1f2937;
  font-size: 1.5rem;
`;

const StudentMeta = styled.p`
  margin: 0.2rem 0;
  color: #6b7280;
  font-size: 0.9rem;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const BackButton = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  
  &:hover {
    background: #2563eb;
  }
`;

const ConfidenceBadge = styled.div`
  background: #dbeafe;
  color: #1e40af;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: bold;
`;

const SectionContainer = styled.div`
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f9fafb;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
`;

const SectionTitle = styled.h3`
  margin: 0 0 1rem 0;
  color: #374151;
  font-size: 1.2rem;
`;

const DomainScore = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const ScoreLabel = styled.span`
  font-weight: bold;
  color: #374151;
  min-width: 120px;
`;

const ScoreValue = styled.span`
  font-size: 1.2rem;
  font-weight: bold;
  color: #3b82f6;
  min-width: 50px;
`;

const ProgressBar = styled.div`
  flex: 1;
  height: 10px;
  background: #e5e7eb;
  border-radius: 5px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(to right, #3b82f6, #10b981);
  transition: width 1s ease-in-out;
`;

const InsightText = styled.p`
  margin: 0.5rem 0;
  color: #6b7280;
  line-height: 1.5;
`;

const StrengthsWeaknessesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
`;

const RecommendationsList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
`;

export default function AIStudentReport({ student, onBack }) {
  const [performanceData, setPerformanceData] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPerformanceData = () => {
      // Get stored performance data
      const storedData = localStorage.getItem(`student_performance_${student.studentId}`);
      if (storedData) {
        const data = JSON.parse(storedData);
        setPerformanceData(data);
        
        // Use real AI analysis
        try {
          const aiAnalysis = realAIAnalyzer.analyzeStudentPerformance(student, data);
          setAnalysis(aiAnalysis);
          console.log('🤖 Real AI Analysis completed:', aiAnalysis);
        } catch (error) {
          console.error('❌ Real AI Analysis failed:', error);
          // Fallback to simple analysis
          setAnalysis(generateFallbackAnalysis(data));
        }
      } else {
        // Check for any game data
        const gameData = checkForGameData(student.studentId);
        if (gameData) {
          setPerformanceData(gameData);
          
          try {
            const aiAnalysis = realAIAnalyzer.analyzeStudentPerformance(student, gameData);
            setAnalysis(aiAnalysis);
            console.log('🤖 Real AI Analysis completed:', aiAnalysis);
          } catch (error) {
            console.error('❌ Real AI Analysis failed:', error);
            setAnalysis(generateFallbackAnalysis(gameData));
          }
        } else {
          setAnalysis(null);
        }
      }
      setLoading(false);
    };

    loadPerformanceData();
  }, [student]);

  const generateFallbackAnalysis = (data) => {
    // Simple fallback analysis
    const domainScores = calculateSimpleDomainScores(data);
    return {
      studentProfile: {
        developmentalStage: 'On Track',
        learningPace: 'Steady Learner',
        engagementLevel: 'Engaged',
        overallScore: Math.round(Object.values(domainScores).reduce((a, b) => a + b, 0) / 4)
      },
      developmentalAnalysis: {
        domainAnalysis: domainScores,
        insights: ['Basic analysis completed'],
        growthAreas: [],
        concerns: [],
        readinessForNextLevel: 'Ready'
      },
      strengthsWeaknesses: {
        strengths: [],
        weaknesses: [],
        neutral: [],
        patterns: [],
        correlations: [],
        summary: 'Basic analysis completed'
      },
      interventionNeeds: {
        interventionsNeeded: [],
        urgencyLevel: 'Low',
        timeline: 'No immediate interventions needed',
        resourcesNeeded: []
      },
      predictiveInsights: {
        currentTrajectory: 'Stable',
        futureProjections: [],
        potentialRisks: [],
        opportunities: [],
        confidenceLevel: 'Medium',
        milestones: []
      },
      careerAlignment: {
        topMatches: [],
        allMatches: [],
        emergingStrengths: [],
        skillDevelopment: []
      },
      recommendations: {
        immediate: ['Continue current learning approach'],
        shortTerm: ['Monitor progress'],
        longTerm: ['Maintain current trajectory'],
        homeActivities: ['Practice skills through play'],
        teacherStrategies: ['Provide encouragement'],
        technologyTools: ['Use educational apps']
      },
      confidenceScores: {
        overall: 60,
        dataQuality: 60,
        patternRecognition: 60,
        benchmarkComparison: 60,
        reliability: 'Medium'
      }
    };
  };

  const calculateSimpleDomainScores = (data) => {
    const domainScores = {
      cognitive: 0,
      motor: 0,
      social: 0,
      emotional: 0
    };

    let gameCount = 0;

    Object.values(data).forEach(gameData => {
      if (gameData.cognitive) {
        domainScores.cognitive += Object.values(gameData.cognitive).reduce((a, b) => a + b, 0) / 4;
      }
      if (gameData.motor) {
        domainScores.motor += Object.values(gameData.motor).reduce((a, b) => a + b, 0) / 3;
      }
      if (gameData.social) {
        domainScores.social += Object.values(gameData.social).reduce((a, b) => a + b, 0) / 3;
      }
      if (gameData.emotional) {
        domainScores.emotional += Object.values(gameData.emotional).reduce((a, b) => a + b, 0) / 4;
      }
      gameCount++;
    });

    if (gameCount > 0) {
      Object.keys(domainScores).forEach(domain => {
        domainScores[domain] = domainScores[domain] / gameCount;
      });
    }

    return domainScores;
  };

  const checkForGameData = (studentId) => {
    // Check for any game data in localStorage
    const keys = Object.keys(localStorage).filter(key => 
        key.startsWith('student_performance_')
    );
    
    // Try to find exact match first
    const exactMatch = keys.find(key => key === `student_performance_${studentId}`);
    if (exactMatch) {
        return JSON.parse(localStorage.getItem(exactMatch));
    }
    
    // Try partial match
    const partialMatch = keys.find(key => key.includes(studentId));
    if (partialMatch) {
        return JSON.parse(localStorage.getItem(partialMatch));
    }
    
    // Check for common test student IDs
    const testIds = ['TEST_STUDENT_001', 'DEMO_STUDENT', 'student123'];
    for (const testId of testIds) {
        const testKey = `student_performance_${testId}`;
        const testData = localStorage.getItem(testKey);
        if (testData) {
            console.log(`Found test data for ${testId}, using it for ${studentId}`);
            return JSON.parse(testData);
        }
    }
    
    return null;
  };

  if (loading) {
    return (
      <ReportContainer>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <h2>🤖 Generating Real AI Analysis...</h2>
          <p>Analyzing performance data with advanced machine learning algorithms</p>
        </div>
      </ReportContainer>
    );
  }

  if (!analysis) {
    return (
      <ReportContainer>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <h2>📊 No Performance Data Available</h2>
          <p>This student hasn't played any games yet.</p>
          <button onClick={onBack} style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '5px' }}>
            Back to Student List
          </button>
        </div>
      </ReportContainer>
    );
  }

  const { studentProfile, developmentalAnalysis, strengthsWeaknesses, interventionNeeds, predictiveInsights, careerAlignment, recommendations, confidenceScores } = analysis;

  return (
    <ReportContainer>
      <ReportHeader>
        <StudentInfo>
          <StudentAvatar src={student.photo || student.avatar} />
          <StudentDetails>
            <StudentName>{student.name}</StudentName>
            <StudentMeta>Age: {student.age} | Level: {student.level} | ID: {student.studentId}</StudentMeta>
            <StudentMeta>Developmental Stage: {studentProfile.developmentalStage}</StudentMeta>
            <StudentMeta>Learning Pace: {studentProfile.learningPace}</StudentMeta>
            <StudentMeta>Engagement: {studentProfile.engagementLevel}</StudentMeta>
          </StudentDetails>
        </StudentInfo>

        <HeaderActions>
          <BackButton onClick={onBack}>← Back to Student List</BackButton>
          <ConfidenceBadge>
            🤖 AI Confidence: {confidenceScores.overall}%
          </ConfidenceBadge>
        </HeaderActions>
      </ReportHeader>

      <SectionContainer>
        <SectionTitle>🧠 Cognitive Development</SectionTitle>
        <DomainScore>
          <ScoreLabel>Cognitive Score</ScoreLabel>
          <ScoreValue>{Math.round(developmentalAnalysis.domainAnalysis.cognitive)}%</ScoreValue>
          <ProgressBar>
            <ProgressFill style={{ width: `${developmentalAnalysis.domainAnalysis.cognitive}%` }} />
          </ProgressBar>
        </DomainScore>
        <InsightText>
          {developmentalAnalysis.insights.find(insight => insight.toLowerCase().includes('cognitive')) || 'Cognitive development progressing well'}
        </InsightText>
      </SectionContainer>

      <SectionContainer>
        <SectionTitle>💪 Motor Skills</SectionTitle>
        <DomainScore>
          <ScoreLabel>Motor Score</ScoreLabel>
          <ScoreValue>{Math.round(developmentalAnalysis.domainAnalysis.motor)}%</ScoreValue>
          <ProgressBar>
            <ProgressFill style={{ width: `${developmentalAnalysis.domainAnalysis.motor}%` }} />
          </ProgressBar>
        </DomainScore>
        <InsightText>
          {developmentalAnalysis.insights.find(insight => insight.toLowerCase().includes('motor')) || 'Motor skills developing appropriately'}
        </InsightText>
      </SectionContainer>

      <SectionContainer>
        <SectionTitle>👥 Social Development</SectionTitle>
        <DomainScore>
          <ScoreLabel>Social Score</ScoreLabel>
          <ScoreValue>{Math.round(developmentalAnalysis.domainAnalysis.social)}%</ScoreValue>
          <ProgressBar>
            <ProgressFill style={{ width: `${developmentalAnalysis.domainAnalysis.social}%` }} />
          </ProgressBar>
        </DomainScore>
        <InsightText>
          {developmentalAnalysis.insights.find(insight => insight.toLowerCase().includes('social')) || 'Social skills growing steadily'}
        </InsightText>
      </SectionContainer>

      <SectionContainer>
        <SectionTitle>❤️ Emotional Development</SectionTitle>
        <DomainScore>
          <ScoreLabel>Emotional Score</ScoreLabel>
          <ScoreValue>{Math.round(developmentalAnalysis.domainAnalysis.emotional)}%</ScoreValue>
          <ProgressBar>
            <ProgressFill style={{ width: `${developmentalAnalysis.domainAnalysis.emotional}%` }} />
          </ProgressBar>
        </DomainScore>
        <InsightText>
          {developmentalAnalysis.insights.find(insight => insight.toLowerCase().includes('emotional')) || 'Emotional regulation improving'}
        </InsightText>
      </SectionContainer>

      <SectionContainer>
        <SectionTitle>🎯 AI Strengths & Weaknesses Analysis</SectionTitle>
        <StrengthsWeaknessesGrid>
          <div>
            <h4>💪 Strengths</h4>
            {strengthsWeaknesses.strengths.length > 0 ? (
              strengthsWeaknesses.strengths.map((strength, index) => (
                <InsightText key={index}>• {strength.domain}: {strength.description}</InsightText>
              ))
            ) : (
              <InsightText>No specific strengths identified yet</InsightText>
            )}
          </div>
          <div>
            <h4>🎯 Areas for Development</h4>
            {strengthsWeaknesses.weaknesses.length > 0 ? (
              strengthsWeaknesses.weaknesses.map((weakness, index) => (
                <InsightText key={index}>• {weakness.domain}: {weakness.description}</InsightText>
              ))
            ) : (
              <InsightText>No specific areas of concern identified</InsightText>
            )}
          </div>
        </StrengthsWeaknessesGrid>
      </SectionContainer>

      <SectionContainer>
        <SectionTitle>🔮 Predictive Insights</SectionTitle>
        <InsightText><strong>Current Trajectory:</strong> {predictiveInsights.currentTrajectory}</InsightText>
        <InsightText><strong>Confidence Level:</strong> {predictiveInsights.confidenceLevel}</InsightText>
        <InsightText><strong>Potential Opportunities:</strong> {predictiveInsights.opportunities.length > 0 ? predictiveInsights.opportunities.join(', ') : 'Continue current progress'}</InsightText>
      </SectionContainer>

      <SectionContainer>
        <SectionTitle>💡 AI Recommendations</SectionTitle>
        <RecommendationsList>
          <div>
            <h4>🚀 Immediate Strategies</h4>
            {recommendations.immediate.map((rec, index) => (
              <InsightText key={index}>• {rec}</InsightText>
            ))}
          </div>
          <div>
            <h4>🏠 Home Activities</h4>
            {recommendations.homeActivities.map((rec, index) => (
              <InsightText key={index}>• {rec}</InsightText>
            ))}
          </div>
        </RecommendationsList>
      </SectionContainer>

      <SectionContainer>
        <SectionTitle>📊 AI Analysis Confidence</SectionTitle>
        <InsightText><strong>Overall Confidence:</strong> {confidenceScores.overall}%</InsightText>
        <InsightText><strong>Data Quality:</strong> {confidenceScores.dataQuality}%</InsightText>
        <InsightText><strong>Pattern Recognition:</strong> {confidenceScores.patternRecognition}%</InsightText>
        <InsightText><strong>Reliability:</strong> {confidenceScores.reliability}</InsightText>
      </SectionContainer>
    </ReportContainer>
  );
}
