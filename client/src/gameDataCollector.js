// Game Data Collection System for Performance Tracking

// Game session tracking
export class GameDataCollector {
  constructor() {
    this.currentSession = null;
    this.sessionData = {};
    this.gameMetrics = {};
  }

  // Start a new game session
  startSession(gameName, studentId) {
    this.currentSession = {
      gameName,
      studentId,
      startTime: Date.now(),
      events: [],
      scores: {},
      interactions: {
        clicks: 0,
        keyPresses: 0,
        mouseMovements: 0,
        timeSpent: 0
      }
    };

    // Initialize game-specific metrics
    this.initializeGameMetrics(gameName);
    
    console.log(`Started game session: ${gameName} for student ${studentId}`);
  }

  // Initialize metrics specific to each game type
  initializeGameMetrics(gameName) {
    const baseMetrics = {
      cognitive: {},
      motor: {},
      social: {},
      emotional: {}
    };

    switch (gameName) {
      case 'Egg Hunt':
        this.gameMetrics = {
          ...baseMetrics,
          cognitive: {
            pattern_recognition: 0,
            attention_span: 0,
            problem_solving: 0,
            memory: 0
          },
          motor: {
            hand_eye_coordination: 0,
            fine_motor_control: 0,
            reaction_time: 0
          },
          social: {
            cooperation: 0,
            communication: 0,
            sharing: 0
          },
          emotional: {
            frustration_tolerance: 0,
            persistence: 0,
            confidence: 0,
            emotional_regulation: 0
          }
        };
        break;

      case 'Pop Game':
        this.gameMetrics = {
          ...baseMetrics,
          cognitive: {
            visual_processing: 0,
            attention_to_detail: 0,
            concentration: 0,
            decision_making: 0
          },
          motor: {
            reaction_speed: 0,
            accuracy: 0,
            timing: 0
          },
          social: {
            turn_taking: 0,
            peer_interaction: 0,
            sportsmanship: 0
          },
          emotional: {
            impulse_control: 0,
            patience: 0,
            excitement_management: 0,
            resilience: 0
          }
        };
        break;

      case 'Shape Explorers':
        this.gameMetrics = {
          ...baseMetrics,
          cognitive: {
            shape_recognition: 0,
            spatial_awareness: 0,
            categorization: 0,
            visual_discrimination: 0
          },
          motor: {
            dragging_precision: 0,
            finger_control: 0,
            hand_stability: 0
          },
          social: {
            collaboration: 0,
            verbal_expression: 0,
            listening_skills: 0
          },
          emotional: {
            curiosity: 0,
            task_completion: 0,
            confidence_building: 0,
            frustration_management: 0
          }
        };
        break;

      case 'Color Quest':
        this.gameMetrics = {
          ...baseMetrics,
          cognitive: {
            color_recognition: 0,
            pattern_matching: 0,
            sequencing: 0,
            visual_memory: 0
          },
          motor: {
            coloring_precision: 0,
            tool_control: 0,
            pressure_control: 0
          },
          social: {
            creative_sharing: 0,
            appreciation: 0,
            collaborative_creativity: 0
          },
          emotional: {
            self_expression: 0,
            patience: 0,
            pride_in_work: 0,
            acceptance_of_imperfection: 0
          }
        };
        break;

      case 'Number Adventures':
        this.gameMetrics = {
          ...baseMetrics,
          cognitive: {
            number_recognition: 0,
            counting_skills: 0,
            basic_arithmetic: 0,
            quantitative_reasoning: 0
          },
          motor: {
            number_tracing: 0,
            counting_movements: 0,
            manipulative_skills: 0
          },
          social: {
            mathematical_communication: 0,
            peer_tutoring: 0,
            group_problem_solving: 0
          },
          emotional: {
            math_confidence: 0,
            persistence_with_problems: 0,
            curiosity_about_numbers: 0,
            learning_from_mistakes: 0
          }
        };
        break;

      case 'Bridge Game':
        this.gameMetrics = {
          ...baseMetrics,
          cognitive: {
            strategic_thinking: 0,
            cause_and_effect: 0,
            logical_reasoning: 0,
            adaptability: 0
          },
          motor: {
            construction_skills: 0,
            precision_placement: 0,
            tool_usage: 0
          },
          social: {
            teamwork: 0,
            leadership: 0,
            conflict_resolution: 0
          },
          emotional: {
            goal_orientation: 0,
            patience_with_process: 0,
            sense_of_accomplishment: 0,
            resilience_to_setbacks: 0
          }
        };
        break;

      case 'Rupee Buddy':
        this.gameMetrics = {
          ...baseMetrics,
          cognitive: {
            financial_concepts: 0,
            calculation_skills: 0,
            decision_making: 0,
            planning: 0
          },
          motor: {
            money_handling: 0,
            transaction_skills: 0,
            counting_accuracy: 0
          },
          social: {
            transactional_communication: 0,
            honesty: 0,
            respect_for_property: 0
          },
          emotional: {
            delayed_gratification: 0,
            responsibility: 0,
            financial_confidence: 0,
            value_appreciation: 0
          }
        };
        break;

      case 'Rupee Buddy Vocational':
        this.gameMetrics = {
          ...baseMetrics,
          cognitive: {
            advanced_financial_planning: 0,
            market_understanding: 0,
            business_math: 0,
            risk_assessment: 0
          },
          motor: {
            professional_skills: 0,
            equipment_operation: 0,
            endurance: 0
          },
          social: {
            professional_communication: 0,
            customer_service: 0,
            team_collaboration: 0
          },
          emotional: {
            work_ethic: 0,
            stress_management: 0,
            career_confidence: 0,
            adaptability_to_change: 0
          }
        };
        break;

      default:
        this.gameMetrics = baseMetrics;
    }
  }

  // Record an event during the game
  recordEvent(eventType, data) {
    if (!this.currentSession) return;

    const event = {
      type: eventType,
      timestamp: Date.now(),
      data: data
    };

    this.currentSession.events.push(event);
    this.updateMetrics(eventType, data);
  }

  // Update metrics based on events
  updateMetrics(eventType, data) {
    const { gameMetrics } = this;
    
    switch (eventType) {
      case 'correct_answer':
        this.updateCognitiveMetrics(data);
        this.updateEmotionalMetrics('confidence', 5);
        break;
        
      case 'wrong_answer':
        this.updateCognitiveMetrics(data, -2);
        this.updateEmotionalMetrics('frustration_tolerance', -1);
        break;
        
      case 'successful_interaction':
        this.updateMotorMetrics(data);
        this.updateEmotionalMetrics('confidence', 3);
        break;
        
      case 'failed_interaction':
        this.updateMotorMetrics(data, -1);
        this.updateEmotionalMetrics('persistence', 2);
        break;
        
      case 'time_spent':
        this.updateTimeMetrics(data);
        break;
        
      case 'social_interaction':
        this.updateSocialMetrics(data);
        break;
        
      case 'help_requested':
        this.updateEmotionalMetrics('frustration_tolerance', -2);
        break;
        
      case 'task_completed':
        this.updateEmotionalMetrics('sense_of_accomplishment', 10);
        this.updateEmotionalMetrics('task_completion', 8);
        break;
        
      case 'quick_reaction':
        this.updateMotorMetrics('reaction_speed', data.value);
        break;
        
      case 'accurate_action':
        this.updateMotorMetrics('accuracy', data.value);
        break;
    }

    // Update interaction counters
    if (data.click) this.currentSession.interactions.clicks++;
    if (data.keyPress) this.currentSession.interactions.keyPresses++;
    if (data.mouseMovement) this.currentSession.interactions.mouseMovements++;
  }

  // Update cognitive metrics
  updateCognitiveMetrics(data, adjustment = 0) {
    const { category, metric, value } = data;
    if (this.gameMetrics.cognitive[metric] !== undefined) {
      this.gameMetrics.cognitive[metric] = Math.max(0, Math.min(100, 
        this.gameMetrics.cognitive[metric] + (value || 5) + adjustment
      ));
    }
  }

  // Update motor metrics
  updateMotorMetrics(data, adjustment = 0) {
    const { metric, value } = data;
    if (this.gameMetrics.motor[metric] !== undefined) {
      this.gameMetrics.motor[metric] = Math.max(0, Math.min(100, 
        this.gameMetrics.motor[metric] + (value || 5) + adjustment
      ));
    }
  }

  // Update social metrics
  updateSocialMetrics(data) {
    const { metric, value } = data;
    if (this.gameMetrics.social[metric] !== undefined) {
      this.gameMetrics.social[metric] = Math.max(0, Math.min(100, 
        this.gameMetrics.social[metric] + (value || 5)
      ));
    }
  }

  // Update emotional metrics
  updateEmotionalMetrics(metric, value) {
    if (this.gameMetrics.emotional[metric] !== undefined) {
      this.gameMetrics.emotional[metric] = Math.max(0, Math.min(100, 
        this.gameMetrics.emotional[metric] + value
      ));
    }
  }

  // Update time-based metrics
  updateTimeMetrics(data) {
    const { timeSpent } = data;
    this.currentSession.interactions.timeSpent = timeSpent;
    
    // Update attention span based on time spent
    if (timeSpent > 300) { // 5 minutes
      this.updateCognitiveMetrics({ metric: 'attention_span', value: 10 });
    }
    
    // Update patience for longer sessions
    if (timeSpent > 600) { // 10 minutes
      this.updateEmotionalMetrics('patience', 5);
    }
  }

  // End the current session and save data
  endSession() {
    if (!this.currentSession) return null;

    const endTime = Date.now();
    const sessionData = {
      ...this.currentSession,
      endTime,
      duration: endTime - this.currentSession.startTime,
      metrics: this.gameMetrics,
      performanceScore: this.calculatePerformanceScore()
    };

    // Save to localStorage
    this.saveSessionData(sessionData);

    console.log('Game session ended:', sessionData);
    
    const result = sessionData;
    this.currentSession = null;
    this.gameMetrics = {};
    
    return result;
  }

  // Calculate overall performance score for the session
  calculatePerformanceScore() {
    const metrics = this.gameMetrics;
    if (!metrics || Object.keys(metrics).length === 0) return 0;

    let totalScore = 0;
    let metricCount = 0;

    Object.keys(metrics).forEach(category => {
      if (category === 'cognitive' || category === 'motor' || 
          category === 'social' || category === 'emotional') {
        let categoryTotal = 0;
        let categoryCount = 0;
        
        Object.keys(metrics[category]).forEach(metric => {
          categoryTotal += metrics[category][metric];
          categoryCount++;
        });
        
        totalScore += categoryCount > 0 ? categoryTotal / categoryCount : 0;
        metricCount++;
      }
    });

    return metricCount > 0 ? Math.round(totalScore / metricCount) : 0;
  }

  // Save session data to localStorage
  saveSessionData(sessionData) {
    const key = `student_performance_${sessionData.studentId}`;
    const existingData = localStorage.getItem(key);
    
    let studentData = existingData ? JSON.parse(existingData) : {};
    
    // Update or add game performance
    if (!studentData[sessionData.gameName]) {
      studentData[sessionData.gameName] = {};
    }
    
    // Merge with existing performance data
    const existingGameMetrics = studentData[sessionData.gameName];
    const newMetrics = sessionData.metrics;
    
    studentData[sessionData.gameName] = {
      cognitive: this.mergeMetrics(existingGameMetrics.cognitive, newMetrics.cognitive),
      motor: this.mergeMetrics(existingGameMetrics.motor, newMetrics.motor),
      social: this.mergeMetrics(existingGameMetrics.social, newMetrics.social),
      emotional: this.mergeMetrics(existingGameMetrics.emotional, newMetrics.emotional)
    };
    
    localStorage.setItem(key, JSON.stringify(studentData));
  }

  // Merge new metrics with existing ones (weighted average)
  mergeMetrics(existing, newMetrics) {
    const merged = {};
    
    Object.keys(newMetrics).forEach(metric => {
      if (existing && existing[metric] !== undefined) {
        // Weighted average: give more weight to recent performance
        merged[metric] = Math.round((existing[metric] * 0.7 + newMetrics[metric] * 0.3) * 100) / 100;
      } else {
        merged[metric] = newMetrics[metric];
      }
    });
    
    return merged;
  }

  // Get current session status
  getCurrentSession() {
    return this.currentSession;
  }

  // Get performance data for a student
  getStudentPerformance(studentId) {
    const key = `student_performance_${studentId}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : {};
  }
}

// Global instance for use across the application
export const gameDataCollector = new GameDataCollector();

// Helper functions for games to use
export const GameTracker = {
  // Start tracking a game session
  startGame: (gameName, studentId) => {
    gameDataCollector.startSession(gameName, studentId);
  },

  // Record a correct answer
  recordCorrectAnswer: (category, metric, value = 5) => {
    gameDataCollector.recordEvent('correct_answer', {
      category,
      metric,
      value,
      timestamp: Date.now()
    });
  },

  // Record a wrong answer
  recordWrongAnswer: (category, metric, value = 2) => {
    gameDataCollector.recordEvent('wrong_answer', {
      category,
      metric,
      value,
      timestamp: Date.now()
    });
  },

  // Record successful interaction
  recordSuccess: (metric, value = 5) => {
    gameDataCollector.recordEvent('successful_interaction', {
      metric,
      value,
      timestamp: Date.now()
    });
  },

  // Record failed interaction
  recordFailure: (metric, value = 2) => {
    gameDataCollector.recordEvent('failed_interaction', {
      metric,
      value,
      timestamp: Date.now()
    });
  },

  // Record time spent
  recordTimeSpent: (timeSpent) => {
    gameDataCollector.recordEvent('time_spent', {
      timeSpent,
      timestamp: Date.now()
    });
  },

  // Record social interaction
  recordSocialInteraction: (metric, value = 5) => {
    gameDataCollector.recordEvent('social_interaction', {
      metric,
      value,
      timestamp: Date.now()
    });
  },

  // Record help request
  recordHelpRequest: () => {
    gameDataCollector.recordEvent('help_requested', {
      timestamp: Date.now()
    });
  },

  // Record task completion
  recordTaskCompletion: () => {
    gameDataCollector.recordEvent('task_completed', {
      timestamp: Date.now()
    });
  },

  // Record quick reaction
  recordQuickReaction: (value = 8) => {
    gameDataCollector.recordEvent('quick_reaction', {
      metric: 'reaction_speed',
      value,
      timestamp: Date.now()
    });
  },

  // Record accurate action
  recordAccurateAction: (value = 7) => {
    gameDataCollector.recordEvent('accurate_action', {
      metric: 'accuracy',
      value,
      timestamp: Date.now()
    });
  },

  // End game session
  endGame: () => {
    return gameDataCollector.endSession();
  },

  // Get current session
  getCurrentSession: () => {
    return gameDataCollector.getCurrentSession();
  }
};

// Auto-initialize when games are loaded
window.addEventListener('load', () => {
  console.log('Game Data Collector initialized');
  
  // Add global tracking functions for easy access from games
  window.GameTracker = GameTracker;
});
