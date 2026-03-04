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
        this.session.scores.total += 1;
        this.session.interactions += 1;

        if (eventType === 'correct') {
            this.session.scores.correct += 1;
        } else if (eventType === 'incorrect') {
            this.session.scores.incorrect += 1;
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
