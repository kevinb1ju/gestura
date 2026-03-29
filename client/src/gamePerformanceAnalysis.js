// Game Performance Analysis System for Gestura Educational Platform

// Performance categories and their weights
export const PERFORMANCE_CATEGORIES = {
  COGNITIVE: 'Cognitive',
  MOTOR: 'Motor Skills', 
  SOCIAL: 'Social',
  EMOTIONAL: 'Emotional',
  OVERALL: 'Overall Progress'
};

// Game-specific performance metrics
export const GAME_PERFORMANCE_METRICS = {
  'Egg Hunt': {
    cognitive: {
      'pattern_recognition': { weight: 0.3, description: 'Ability to recognize and match patterns' },
      'attention_span': { weight: 0.25, description: 'Focus and concentration duration' },
      'problem_solving': { weight: 0.25, description: 'Finding solutions to challenges' },
      'memory': { weight: 0.2, description: 'Recall and retention' }
    },
    motor: {
      'hand_eye_coordination': { weight: 0.4, description: 'Coordination between visual input and hand movement' },
      'fine_motor_control': { weight: 0.3, description: 'Precise finger and hand movements' },
      'reaction_time': { weight: 0.3, description: 'Speed of response to stimuli' }
    },
    social: {
      'cooperation': { weight: 0.4, description: 'Working with others to achieve goals' },
      'communication': { weight: 0.3, description: 'Expressing needs and ideas' },
      'sharing': { weight: 0.3, description: 'Taking turns and sharing resources' }
    },
    emotional: {
      'frustration_tolerance': { weight: 0.3, description: 'Handling difficult situations' },
      'persistence': { weight: 0.3, description: 'Continuing effort despite challenges' },
      'confidence': { weight: 0.2, description: 'Self-assurance in abilities' },
      'emotional_regulation': { weight: 0.2, description: 'Managing emotions appropriately' }
    }
  },
  'Pop Game': {
    cognitive: {
      'visual_processing': { weight: 0.3, description: 'Quick visual information processing' },
      'attention_to_detail': { weight: 0.25, description: 'Noticing small details and changes' },
      'concentration': { weight: 0.25, description: 'Sustained focus on task' },
      'decision_making': { weight: 0.2, description: 'Quick and accurate decisions' }
    },
    motor: {
      'reaction_speed': { weight: 0.4, description: 'Speed of physical response' },
      'accuracy': { weight: 0.3, description: 'Precision in movements' },
      'timing': { weight: 0.3, description: 'Rhythmic and coordinated actions' }
    },
    social: {
      'turn_taking': { weight: 0.4, description: 'Waiting for appropriate moments' },
      'peer_interaction': { weight: 0.3, description: 'Positive engagement with others' },
      'sportsmanship': { weight: 0.3, description: 'Graceful winning and losing' }
    },
    emotional: {
      'impulse_control': { weight: 0.3, description: 'Controlling immediate reactions' },
      'patience': { weight: 0.3, description: 'Waiting calmly for opportunities' },
      'excitement_management': { weight: 0.2, description: 'Handling excitement appropriately' },
      'resilience': { weight: 0.2, description: 'Bouncing back from setbacks' }
    }
  },
  'Shape Explorers': {
    cognitive: {
      'shape_recognition': { weight: 0.3, description: 'Identifying different shapes' },
      'spatial_awareness': { weight: 0.25, description: 'Understanding spatial relationships' },
      'categorization': { weight: 0.25, description: 'Grouping similar items' },
      'visual_discrimination': { weight: 0.2, description: 'Noticing differences between shapes' }
    },
    motor: {
      'dragging_precision': { weight: 0.4, description: 'Accurate dragging and dropping' },
      'finger_control': { weight: 0.3, description: 'Fine finger movements' },
      'hand_stability': { weight: 0.3, description: 'Steady hand control' }
    },
    social: {
      'collaboration': { weight: 0.4, description: 'Working together on tasks' },
      'verbal_expression': { weight: 0.3, description: 'Describing shapes and actions' },
      'listening_skills': { weight: 0.3, description: 'Following instructions' }
    },
    emotional: {
      'curiosity': { weight: 0.3, description: 'Interest in exploring new concepts' },
      'task_completion': { weight: 0.3, description: 'Finishing started activities' },
      'confidence_building': { weight: 0.2, description: 'Growing self-assurance' },
      'frustration_management': { weight: 0.2, description: 'Handling difficulties calmly' }
    }
  },
  'Color Quest': {
    cognitive: {
      'color_recognition': { weight: 0.3, description: 'Identifying and naming colors' },
      'pattern_matching': { weight: 0.25, description: 'Matching color patterns' },
      'sequencing': { weight: 0.25, description: 'Following color sequences' },
      'visual_memory': { weight: 0.2, description: 'Remembering color arrangements' }
    },
    motor: {
      'coloring_precision': { weight: 0.4, description: 'Staying within lines' },
      'tool_control': { weight: 0.3, description: 'Using coloring tools effectively' },
      'pressure_control': { weight: 0.3, description: 'Appropriate pressure on surfaces' }
    },
    social: {
      'creative_sharing': { weight: 0.4, description: 'Sharing artistic creations' },
      'appreciation': { weight: 0.3, description: 'Acknowledging others work' },
      'collaborative_creativity': { weight: 0.3, description: 'Creating together' }
    },
    emotional: {
      'self_expression': { weight: 0.3, description: 'Expressing through colors' },
      'patience': { weight: 0.3, description: 'Taking time with artwork' },
      'pride_in_work': { weight: 0.2, description: 'Feeling good about creations' },
      'acceptance_of_imperfection': { weight: 0.2, description: 'Accepting mistakes as learning' }
    }
  },
  'Number Adventures': {
    cognitive: {
      'number_recognition': { weight: 0.3, description: 'Identifying numbers' },
      'counting_skills': { weight: 0.25, description: 'Sequential counting' },
      'basic_arithmetic': { weight: 0.25, description: 'Simple addition/subtraction' },
      'quantitative_reasoning': { weight: 0.2, description: 'Understanding quantities' }
    },
    motor: {
      'number_tracing': { weight: 0.4, description: 'Writing numbers accurately' },
      'counting_movements': { weight: 0.3, description: 'Physical counting actions' },
      'manipulative_skills': { weight: 0.3, description: 'Handling counting objects' }
    },
    social: {
      'mathematical_communication': { weight: 0.4, description: 'Explaining math thinking' },
      'peer_tutoring': { weight: 0.3, description: 'Helping others with numbers' },
      'group_problem_solving': { weight: 0.3, description: 'Working on math together' }
    },
    emotional: {
      'math_confidence': { weight: 0.3, description: 'Belief in math ability' },
      'persistence_with_problems': { weight: 0.3, description: 'Sticking with challenges' },
      'curiosity_about_numbers': { weight: 0.2, description: 'Interest in mathematical concepts' },
      'learning_from_mistakes': { weight: 0.2, description: 'Using errors as learning opportunities' }
    }
  },
  'Bridge Game': {
    cognitive: {
      'strategic_thinking': { weight: 0.3, description: 'Planning ahead' },
      'cause_and_effect': { weight: 0.25, description: 'Understanding action consequences' },
      'logical_reasoning': { weight: 0.25, description: 'Step-by-step thinking' },
      'adaptability': { weight: 0.2, description: 'Adjusting to new situations' }
    },
    motor: {
      'construction_skills': { weight: 0.4, description: 'Building and assembling' },
      'precision_placement': { weight: 0.3, description: 'Accurate positioning' },
      'tool_usage': { weight: 0.3, description: 'Using construction tools' }
    },
    social: {
      'teamwork': { weight: 0.4, description: 'Collaborative building' },
      'leadership': { weight: 0.3, description: 'Guiding group efforts' },
      'conflict_resolution': { weight: 0.3, description: 'Solving disagreements' }
    },
    emotional: {
      'goal_orientation': { weight: 0.3, description: 'Working toward objectives' },
      'patience_with_process': { weight: 0.3, description: 'Understanding complex tasks take time' },
      'sense_of_accomplishment': { weight: 0.2, description: 'Pride in completed work' },
      'resilience_to_setbacks': { weight: 0.2, description: 'Recovering from failures' }
    }
  },
  'Rupee Buddy': {
    cognitive: {
      'financial_concepts': { weight: 0.3, description: 'Understanding money value' },
      'calculation_skills': { weight: 0.25, description: 'Basic financial math' },
      'decision_making': { weight: 0.25, description: 'Making spending choices' },
      'planning': { weight: 0.2, description: 'Budgeting and saving' }
    },
    motor: {
      'money_handling': { weight: 0.4, description: 'Physical manipulation of currency' },
      'transaction_skills': { weight: 0.3, description: 'Making purchases' },
      'counting_accuracy': { weight: 0.3, description: 'Precise money counting' }
    },
    social: {
      'transactional_communication': { weight: 0.4, description: 'Clear exchange communication' },
      'honesty': { weight: 0.3, description: 'Truthful in transactions' },
      'respect_for_property': { weight: 0.3, description: 'Valuing others belongings' }
    },
    emotional: {
      'delayed_gratification': { weight: 0.3, description: 'Saving for future goals' },
      'responsibility': { weight: 0.3, description: 'Taking care of money' },
      'financial_confidence': { weight: 0.2, description: 'Comfort with money matters' },
      'value_appreciation': { weight: 0.2, description: 'Understanding worth of items' }
    }
  },
  'Rupee Buddy Vocational': {
    cognitive: {
      'advanced_financial_planning': { weight: 0.3, description: 'Complex budgeting strategies' },
      'market_understanding': { weight: 0.25, description: 'Supply and demand concepts' },
      'business_math': { weight: 0.25, description: 'Business calculations' },
      'risk_assessment': { weight: 0.2, description: 'Evaluating financial risks' }
    },
    motor: {
      'professional_skills': { weight: 0.4, description: 'Work-related motor abilities' },
      'equipment_operation': { weight: 0.3, description: 'Using work tools' },
      'endurance': { weight: 0.3, description: 'Sustained work performance' }
    },
    social: {
      'professional_communication': { weight: 0.4, description: 'Workplace interaction' },
      'customer_service': { weight: 0.3, description: 'Helping others effectively' },
      'team_collaboration': { weight: 0.3, description: 'Working in professional teams' }
    },
    emotional: {
      'work_ethic': { weight: 0.3, description: 'Professional attitude' },
      'stress_management': { weight: 0.3, description: 'Handling work pressure' },
      'career_confidence': { weight: 0.2, description: 'Belief in professional abilities' },
      'adaptability_to_change': { weight: 0.2, description: 'Handling workplace changes' }
    }
  }
};

// Performance level thresholds
export const PERFORMANCE_THRESHOLDS = {
  EXCELLENT: 90,
  GOOD: 75,
  AVERAGE: 60,
  BELOW_AVERAGE: 40,
  NEEDS_IMPROVEMENT: 0
};

// Performance level descriptions
export const PERFORMANCE_LEVELS = {
  EXCELLENT: { 
    level: 'Excellent', 
    color: '#10b981', 
    description: 'Outstanding performance, exceeds expectations' 
  },
  GOOD: { 
    level: 'Good', 
    color: '#3b82f6', 
    description: 'Strong performance, meets and often exceeds expectations' 
  },
  AVERAGE: { 
    level: 'Average', 
    color: '#f59e0b', 
    description: 'Meets basic expectations, room for improvement' 
  },
  BELOW_AVERAGE: { 
    level: 'Below Average', 
    color: '#f97316', 
    description: 'Struggling to meet expectations, needs support' 
  },
  NEEDS_IMPROVEMENT: { 
    level: 'Needs Improvement', 
    color: '#ef4444', 
    description: 'Significant challenges, requires intervention' 
  }
};

// Analyze game performance data
export const analyzeGamePerformance = (gameName, gameData) => {
  const metrics = GAME_PERFORMANCE_METRICS[gameName];
  if (!metrics) {
    throw new Error(`No performance metrics defined for game: ${gameName}`);
  }

  const analysis = {
    cognitive: calculateCategoryScore(metrics.cognitive, gameData.cognitive || {}),
    motor: calculateCategoryScore(metrics.motor, gameData.motor || {}),
    social: calculateCategoryScore(metrics.social, gameData.social || {}),
    emotional: calculateCategoryScore(metrics.emotional, gameData.emotional || {}),
    overall: 0
  };

  // Calculate overall score (weighted average)
  analysis.overall = (
    analysis.cognitive.score * 0.3 +
    analysis.motor.score * 0.25 +
    analysis.social.score * 0.25 +
    analysis.emotional.score * 0.2
  );

  // Add performance levels
  Object.keys(analysis).forEach(category => {
    if (category !== 'overall') {
      analysis[category].level = getPerformanceLevel(analysis[category].score);
    }
  });
  analysis.overallLevel = getPerformanceLevel(analysis.overall);

  return analysis;
};

// Calculate score for a performance category
const calculateCategoryScore = (categoryMetrics, categoryData) => {
  let totalScore = 0;
  let totalWeight = 0;
  const details = {};

  Object.keys(categoryMetrics).forEach(metric => {
    const weight = categoryMetrics[metric].weight;
    const score = categoryData[metric] || 0; // Default to 0 if not provided
    
    totalScore += score * weight;
    totalWeight += weight;
    
    details[metric] = {
      score: score,
      weight: weight,
      weightedScore: score * weight,
      description: categoryMetrics[metric].description
    };
  });

  const finalScore = totalWeight > 0 ? totalScore / totalWeight : 0;

  return {
    score: Math.round(finalScore * 100) / 100, // Round to 2 decimal places
    details: details,
    level: getPerformanceLevel(finalScore)
  };
};

// Get performance level based on score
const getPerformanceLevel = (score) => {
  if (score >= PERFORMANCE_THRESHOLDS.EXCELLENT) return PERFORMANCE_LEVELS.EXCELLENT;
  if (score >= PERFORMANCE_THRESHOLDS.GOOD) return PERFORMANCE_LEVELS.GOOD;
  if (score >= PERFORMANCE_THRESHOLDS.AVERAGE) return PERFORMANCE_LEVELS.AVERAGE;
  if (score >= PERFORMANCE_THRESHOLDS.BELOW_AVERAGE) return PERFORMANCE_LEVELS.BELOW_AVERAGE;
  return PERFORMANCE_LEVELS.NEEDS_IMPROVEMENT;
};

// Generate performance recommendations
export const generateRecommendations = (analysis) => {
  const recommendations = [];

  // Cognitive recommendations
  if (analysis.cognitive.score < 60) {
    recommendations.push({
      category: 'Cognitive',
      priority: 'high',
      suggestion: 'Focus on pattern recognition and memory exercises. Consider simpler games with clear objectives.'
    });
  } else if (analysis.cognitive.score < 75) {
    recommendations.push({
      category: 'Cognitive',
      priority: 'medium',
      suggestion: 'Introduce more complex problem-solving activities to build confidence.'
    });
  }

  // Motor skills recommendations
  if (analysis.motor.score < 60) {
    recommendations.push({
      category: 'Motor Skills',
      priority: 'high',
      suggestion: 'Practice fine motor activities like drawing, cutting, and manipulation exercises.'
    });
  } else if (analysis.motor.score < 75) {
    recommendations.push({
      category: 'Motor Skills',
      priority: 'medium',
      suggestion: 'Introduce more challenging motor tasks to improve coordination.'
    });
  }

  // Social recommendations
  if (analysis.social.score < 60) {
    recommendations.push({
      category: 'Social',
      priority: 'high',
      suggestion: 'Encourage group activities and peer interaction. Practice turn-taking and sharing.'
    });
  } else if (analysis.social.score < 75) {
    recommendations.push({
      category: 'Social',
      priority: 'medium',
      suggestion: 'Provide opportunities for leadership roles in group activities.'
    });
  }

  // Emotional recommendations
  if (analysis.emotional.score < 60) {
    recommendations.push({
      category: 'Emotional',
      priority: 'high',
      suggestion: 'Focus on emotional regulation activities. Provide positive reinforcement and coping strategies.'
    });
  } else if (analysis.emotional.score < 75) {
    recommendations.push({
      category: 'Emotional',
      priority: 'medium',
      suggestion: 'Introduce more challenging situations to build resilience and confidence.'
    });
  }

  return recommendations;
};

// Calculate level progression recommendations
export const calculateLevelProgression = (overallScore, currentLevel) => {
  if (overallScore >= PERFORMANCE_THRESHOLDS.EXCELLENT && currentLevel < 5) {
    return {
      ready: true,
      suggestion: `Student shows excellent performance and may be ready for Level ${currentLevel + 1}`,
      confidence: 'high'
    };
  } else if (overallScore >= PERFORMANCE_THRESHOLDS.GOOD && currentLevel < 5) {
    return {
      ready: false,
      suggestion: `Student is performing well. Continue with current level to build stronger foundation.`,
      confidence: 'medium'
    };
  } else {
    return {
      ready: false,
      suggestion: `Student needs more practice at current level before advancing.`,
      confidence: 'low'
    };
  }
};
