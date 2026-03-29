const express = require('express');
const router = express.Router();
const { chatWithAi } = require('../controllers/aiController');

// @route   POST api/ai/chat
// @desc    Chat with Gestura AI (Llama-powered or fallback)
// @access  Private (Teacher/Parent)
router.post('/chat', chatWithAi);

module.exports = router;
