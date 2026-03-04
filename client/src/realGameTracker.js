// Real Game Data Collection System

export class RealGameTracker {
  constructor() {
    this.gameSessions = {};
    this.currentSession = null;
  }

  // Start tracking a game session
  startGameSession(gameName, studentId) {
    this.currentSession = {
      gameName,
      studentId,
      startTime: Date.now(),
      events: [],
      scores: {
        correct: 0,
        incorrect: 0,
        total: 0
      },
      timeSpent: 0,
      interactions: 0
    };
  }

  // Record game events with actual scores
  recordGameEvent(eventType, score = 0, details = {}) {
    if (!this.currentSession) return;

    const event = {
      type: eventType,
      score: score,
      timestamp: Date.now(),
      details: details
    };

    this.currentSession.events.push(event);
    this.currentSession.scores.total += 1;
    
    if (eventType === 'correct') {
      this.currentSession.scores.correct += 1;
    } else if (eventType === 'incorrect') {
      this.currentSession.scores.incorrect += 1;
    }
    
    this.currentSession.interactions += 1;
  }

  // End session and calculate real performance metrics
  endGameSession() {
    if (!this.currentSession) return null;

    const endTime = Date.now();
    const sessionData = {
      ...this.currentSession,
      endTime,
      duration: endTime - this.currentSession.startTime,
      performance: this.calculateRealPerformance()
    };

    // Save to localStorage
    this.saveRealPerformanceData(sessionData);
    
    const result = sessionData;
    this.currentSession = null;
    return result;
  }

  // Calculate real performance metrics from game data
  calculateRealPerformance() {
    if (!this.currentSession) return null;

    const { scores, duration, events } = this.currentSession;
    const accuracy = scores.total > 0 ? (scores.correct / scores.total) * 100 : 0;
    const timeInSeconds = duration / 1000;
    
    return {
      cognitive: this.calculateCognitiveScores(accuracy, events),
      motor: this.calculateMotorScores(timeInSeconds, events),
      social: this.calculateSocialScores(events),
      emotional: this.calculateEmotionalScores(accuracy, duration, events)
    };
  }

  calculateCognitiveScores(accuracy, events) {
    const cognitiveEvents = events.filter(e => 
      e.type === 'pattern_match' || e.type === 'memory' || e.type === 'problem_solved'
    );
    
    return {
      pattern_recognition: Math.min(100, accuracy * 1.1),
      attention_span: Math.min(100, (cognitiveEvents.length / 10) * 100),
      problem_solving: Math.min(100, (events.filter(e => e.type === 'problem_solved').length / 5) * 100),
      memory: Math.min(100, (events.filter(e => e.type === 'memory').length / 3) * 100)
    };
  }

  calculateMotorScores(timeInSeconds, events) {
    const motorEvents = events.filter(e => 
      e.type === 'click' || e.type === 'drag' || e.type === 'touch'
    );
    
    return {
      hand_eye_coordination: Math.min(100, (motorEvents.length / timeInSeconds) * 10),
      fine_motor_control: Math.min(100, (events.filter(e => e.type === 'drag').length / 5) * 100),
      reaction_time: Math.min(100, 100 - (timeInSeconds / 60) * 10)
    };
  }

  calculateSocialScores(events) {
    const socialEvents = events.filter(e => 
      e.type === 'cooperation' || e.type === 'sharing' || e.type === 'communication'
    );
    
    return {
      cooperation: Math.min(100, (socialEvents.length / 3) * 100),
      communication: Math.min(100, (events.filter(e => e.type === 'communication').length / 2) * 100),
      sharing: Math.min(100, (events.filter(e => e.type === 'sharing').length / 2) * 100)
    };
  }

  calculateEmotionalScores(accuracy, duration, events) {
    const emotionalEvents = events.filter(e => 
      e.type === 'frustration' || e.type === 'persistence' || e.type === 'celebration'
    );
    
    return {
      frustration_tolerance: Math.min(100, 100 - (emotionalEvents.filter(e => e.type === 'frustration').length * 10)),
      persistence: Math.min(100, (events.filter(e => e.type === 'persistence').length / 3) * 100),
      confidence: Math.min(100, accuracy),
      emotional_regulation: Math.min(100, (duration / 300) * 100)
    };
  }

  // Save real performance data to localStorage
  saveRealPerformanceData(sessionData) {
    const key = `student_performance_${sessionData.studentId}`;
    const existingData = localStorage.getItem(key);
    
    let studentData = existingData ? JSON.parse(existingData) : {};
    
    // Update or add game performance with real data
    studentData[sessionData.gameName] = sessionData.performance;
    
    localStorage.setItem(key, JSON.stringify(studentData));
  }

  // Get real performance data for a student
  getRealPerformanceData(studentId) {
    const key = `student_performance_${studentId}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }
}

// Global instance
export const realGameTracker = new RealGameTracker();

// Integration functions for games
window.GameTracker = {
  startGame: (gameName, studentId) => realGameTracker.startGameSession(gameName, studentId),
  recordEvent: (eventType, score, details) => realGameTracker.recordGameEvent(eventType, score, details),
  endGame: () => realGameTracker.endGameSession(),
  recordCorrect: (details) => realGameTracker.recordGameEvent('correct', 1, details),
  recordIncorrect: (details) => realGameTracker.recordGameEvent('incorrect', 0, details),
  recordPattern: (details) => realGameTracker.recordGameEvent('pattern_match', 1, details),
  recordMemory: (details) => realGameTracker.recordGameEvent('memory', 1, details),
  recordProblemSolved: (details) => realGameTracker.recordGameEvent('problem_solved', 1, details),
  recordClick: (details) => realGameTracker.recordGameEvent('click', 0, details),
  recordDrag: (details) => realGameTracker.recordGameEvent('drag', 0, details),
  recordCooperation: (details) => realGameTracker.recordGameEvent('cooperation', 1, details),
  recordSharing: (details) => realGameTracker.recordGameEvent('sharing', 1, details),
  recordCommunication: (details) => realGameTracker.recordGameEvent('communication', 1, details),
  recordFrustration: (details) => realGameTracker.recordGameEvent('frustration', 0, details),
  recordPersistence: (details) => realGameTracker.recordGameEvent('persistence', 1, details),
  recordCelebration: (details) => realGameTracker.recordGameEvent('celebration', 1, details)
};
