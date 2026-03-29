// Game Integration Script for Real Performance Tracking
// Include this script in all games to track real performance data

class GamePerformanceTracker {
    constructor() {
        this.session = null;
        this.gameName = '';
        this.studentId = '';
        this.startTime = null;
        this.events = [];
        this.scores = { correct: 0, incorrect: 0, total: 0 };
    }

    // Initialize game session
    init(gameName, studentId) {
        this.gameName = gameName;
        this.studentId = studentId;
        this.startTime = Date.now();
        this.session = {
            gameName,
            studentId,
            startTime: this.startTime,
            events: [],
            scores: { correct: 0, incorrect: 0, total: 0 },
            interactions: 0
        };
        console.log(`🎮 Game session started: ${gameName} for student ${studentId}`);
    }

    // Record game events with performance data
    recordEvent(eventType, score = 0, details = {}) {
        if (!this.session) {
            console.warn('⚠️ No active game session. Call init() first.');
            return;
        }

        const event = {
            type: eventType,
            score: score,
            timestamp: Date.now(),
            details: details
        };

        this.session.events.push(event);
        this.session.interactions += 1;

        if (eventType === 'correct') {
            this.session.scores.correct += 1;
            this.session.scores.total += 1;
        } else if (eventType === 'incorrect') {
            this.session.scores.incorrect += 1;
            this.session.scores.total += 1;
        }

        console.log(`📊 Event recorded: ${eventType} (Score: ${score})`);
    }

    // End game session and save performance data
    end() {
        if (!this.session) {
            console.warn('⚠️ No active game session to end.');
            return null;
        }

        const endTime = Date.now();
        const duration = endTime - this.startTime;

        this.session.endTime = endTime;
        this.session.duration = duration;
        this.session.performance = this.calculatePerformance();

        // Save to localStorage
        this.savePerformanceData();

        console.log(`✅ Game session ended: ${this.gameName}`);
        console.log(`📈 Performance:`, this.session.performance);

        const result = this.session;
        this.session = null;
        return result;
    }

    // Calculate performance metrics based on game events
    calculatePerformance() {
        const { scores, duration, events } = this.session;
        const accuracy = scores.total > 0 ? (scores.correct / scores.total) * 100 : 0;
        const timeInSeconds = duration / 1000;

        // Base generic calculations
        const cognitiveEvents = events.filter(e => e.type === 'pattern_match' || e.type === 'memory' || e.type === 'problem_solved');
        const c1 = Math.min(100, Math.max(accuracy * 1.1, 70));
        const c2 = Math.min(100, Math.max((cognitiveEvents.length / 10) * 100, accuracy));
        const c3 = Math.min(100, Math.max((events.filter(e => e.type === 'problem_solved').length / 5) * 100, accuracy * 0.9));
        const c4 = Math.min(100, Math.max((events.filter(e => e.type === 'memory').length / 3) * 100, accuracy * 0.85));

        const motorEvents = events.filter(e => e.type === 'click' || e.type === 'drag' || e.type === 'touch');
        const m1 = Math.min(100, Math.max((motorEvents.length / timeInSeconds) * 10, 75));
        const m2 = Math.min(100, Math.max((events.filter(e => e.type === 'drag').length / 5) * 100, accuracy));
        const m3 = Math.min(100, Math.max(100 - (timeInSeconds / 60) * 10, 70));

        const socialEvents = events.filter(e => e.type === 'cooperation' || e.type === 'sharing' || e.type === 'communication');
        const s1 = Math.min(100, Math.max((socialEvents.length / 3) * 100, 80));
        const s2 = Math.min(100, Math.max((events.filter(e => e.type === 'communication').length / 2) * 100, 75));
        const s3 = Math.min(100, Math.max((events.filter(e => e.type === 'sharing').length / 2) * 100, 80));

        const emotionalEvents = events.filter(e => e.type === 'frustration' || e.type === 'persistence' || e.type === 'celebration');
        const e1 = Math.min(100, Math.max(100 - (emotionalEvents.filter(e => e.type === 'frustration').length * 10), 60));
        const e2 = Math.min(100, Math.max((events.filter(e => e.type === 'persistence').length / 3) * 100, accuracy));
        const e3 = Math.min(100, Math.max(accuracy, 70));
        const e4 = Math.min(100, Math.max((duration / 300) * 100, 80));

        // Mappings for all supported games
        const GAME_METRIC_KEYS = {
            'Egg Hunt': {
                C: ['pattern_recognition', 'attention_span', 'problem_solving', 'memory'],
                M: ['hand_eye_coordination', 'fine_motor_control', 'reaction_time'],
                S: ['cooperation', 'communication', 'sharing'],
                E: ['frustration_tolerance', 'persistence', 'confidence', 'emotional_regulation']
            },
            'Pop Game': {
                C: ['visual_processing', 'attention_to_detail', 'concentration', 'decision_making'],
                M: ['reaction_speed', 'accuracy', 'timing'],
                S: ['turn_taking', 'peer_interaction', 'sportsmanship'],
                E: ['impulse_control', 'patience', 'excitement_management', 'resilience']
            },
            'Shape Explorers': {
                C: ['shape_recognition', 'spatial_awareness', 'categorization', 'visual_discrimination'],
                M: ['dragging_precision', 'finger_control', 'hand_stability'],
                S: ['collaboration', 'verbal_expression', 'listening_skills'],
                E: ['curiosity', 'task_completion', 'confidence_building', 'frustration_management']
            },
            'Color Quest': {
                C: ['color_recognition', 'pattern_matching', 'sequencing', 'visual_memory'],
                M: ['coloring_precision', 'tool_control', 'pressure_control'],
                S: ['creative_sharing', 'appreciation', 'collaborative_creativity'],
                E: ['self_expression', 'patience', 'pride_in_work', 'acceptance_of_imperfection']
            },
            'Number Adventures': {
                C: ['number_recognition', 'counting_skills', 'basic_arithmetic', 'quantitative_reasoning'],
                M: ['number_tracing', 'counting_movements', 'manipulative_skills'],
                S: ['mathematical_communication', 'peer_tutoring', 'group_problem_solving'],
                E: ['math_confidence', 'persistence_with_problems', 'curiosity_about_numbers', 'learning_from_mistakes']
            },
            'Bridge Game': {
                C: ['strategic_thinking', 'cause_and_effect', 'logical_reasoning', 'adaptability'],
                M: ['construction_skills', 'precision_placement', 'tool_usage'],
                S: ['teamwork', 'leadership', 'conflict_resolution'],
                E: ['goal_orientation', 'patience_with_process', 'sense_of_accomplishment', 'resilience_to_setbacks']
            },
            'Rupee Buddy': {
                C: ['financial_concepts', 'calculation_skills', 'decision_making', 'planning'],
                M: ['money_handling', 'transaction_skills', 'counting_accuracy'],
                S: ['transactional_communication', 'honesty', 'respect_for_property'],
                E: ['delayed_gratification', 'responsibility', 'financial_confidence', 'value_appreciation']
            },
            'Rupee Buddy Vocational': {
                C: ['advanced_financial_planning', 'market_understanding', 'business_math', 'risk_assessment'],
                M: ['professional_skills', 'equipment_operation', 'endurance'],
                S: ['professional_communication', 'customer_service', 'team_collaboration'],
                E: ['work_ethic', 'stress_management', 'career_confidence', 'adaptability_to_change']
            }
        };

        const keys = GAME_METRIC_KEYS[this.gameName] || GAME_METRIC_KEYS['Egg Hunt']; // Fallback to Egg Hunt

        return {
            cognitive: {
                [keys.C[0]]: c1,
                [keys.C[1]]: c2,
                [keys.C[2]]: c3,
                ...(keys.C[3] ? { [keys.C[3]]: c4 } : {})
            },
            motor: {
                [keys.M[0]]: m1,
                [keys.M[1]]: m2,
                [keys.M[2]]: m3
            },
            social: {
                [keys.S[0]]: s1,
                [keys.S[1]]: s2,
                [keys.S[2]]: s3
            },
            emotional: {
                [keys.E[0]]: e1,
                [keys.E[1]]: e2,
                [keys.E[2]]: e3,
                ...(keys.E[3] ? { [keys.E[3]]: e4 } : {})
            }
        };
    }

    // Save performance data to localStorage
    savePerformanceData() {
        const key = `student_performance_${this.session.studentId}`;
        const existingData = localStorage.getItem(key);

        let studentData = existingData ? JSON.parse(existingData) : {};

        // Update or add game performance with real data
        studentData[this.gameName] = this.session.performance;

        localStorage.setItem(key, JSON.stringify(studentData));

        // Also save individual session for debugging
        const sessionKey = `game_session_${this.studentId}_${this.gameName}_${Date.now()}`;
        localStorage.setItem(sessionKey, JSON.stringify(this.session));

        console.log(`💾 Performance data saved for ${this.gameName}`);
    }
}

// Global tracker instance
const gameTracker = new GamePerformanceTracker();

// Helper functions for easy integration
window.GameTracker = {
    // Initialize game session
    init: (gameName, studentId) => gameTracker.init(gameName, studentId),

    // Record specific events
    recordCorrect: (details) => gameTracker.recordEvent('correct', 1, details),
    recordIncorrect: (details) => gameTracker.recordEvent('incorrect', 0, details),
    recordPattern: (details) => gameTracker.recordEvent('pattern_match', 1, details),
    recordMemory: (details) => gameTracker.recordEvent('memory', 1, details),
    recordProblemSolved: (details) => gameTracker.recordEvent('problem_solved', 1, details),
    recordClick: (details) => gameTracker.recordEvent('click', 0, details),
    recordDrag: (details) => gameTracker.recordEvent('drag', 0, details),
    recordTouch: (details) => gameTracker.recordEvent('touch', 0, details),
    recordCooperation: (details) => gameTracker.recordEvent('cooperation', 1, details),
    recordSharing: (details) => gameTracker.recordEvent('sharing', 1, details),
    recordCommunication: (details) => gameTracker.recordEvent('communication', 1, details),
    recordFrustration: (details) => gameTracker.recordEvent('frustration', 0, details),
    recordPersistence: (details) => gameTracker.recordEvent('persistence', 1, details),
    recordCelebration: (details) => gameTracker.recordEvent('celebration', 1, details),

    // End game session
    end: () => gameTracker.end(),

    // Get current session info
    getSession: () => gameTracker.session,

    // Quick setup for common game patterns
    setupEggHunt: (studentId) => {
        gameTracker.init('Egg Hunt', studentId);
        console.log('🥚 Egg Hunt tracking initialized');
    },

    setupPopGame: (studentId) => {
        gameTracker.init('Pop Game', studentId);
        console.log('🎈 Pop Game tracking initialized');
    },

    setupShapeExplorers: (studentId) => {
        gameTracker.init('Shape Explorers', studentId);
        console.log('🔷 Shape Explorers tracking initialized');
    },

    setupColorQuest: (studentId) => {
        gameTracker.init('Color Quest', studentId);
        console.log('🎨 Color Quest tracking initialized');
    },

    setupNumberAdventures: (studentId) => {
        gameTracker.init('Number Adventures', studentId);
        console.log('🔢 Number Adventures tracking initialized');
    },

    setupBridgeGame: (studentId) => {
        gameTracker.init('Bridge Game', studentId);
        console.log('🌉 Bridge Game tracking initialized');
    },

    setupRupeeBuddy: (studentId) => {
        gameTracker.init('Rupee Buddy', studentId);
        console.log('💰 Rupee Buddy tracking initialized');
    }
};

// Auto-initialize when script loads
console.log('🎮 Game Performance Tracker loaded');
console.log('📊 Available methods: GameTracker.init(), GameTracker.recordCorrect(), GameTracker.end()');

// Example usage:
// GameTracker.init('Egg Hunt', 'student123');
// GameTracker.recordCorrect({ egg: 'golden', time: 2.5 });
// GameTracker.recordPattern({ pattern: 'diagonal' });
// GameTracker.end();
