const axios = require('axios');
const Groq = require('groq-sdk');

/**
 * @desc    Chat with Gestura AI
 * @route   POST /api/ai/chat
 */
exports.chatWithAi = async (req, res) => {
  try {
    const { message, context, role } = req.body;
    const apiKey = process.env.GROQ_API_KEY?.trim();

    // 1. Check if we have a real Llama API key (using Groq as a popular fast provider)
    if (apiKey) {
      try {
        const groq = new Groq({ apiKey });
        const sysPrompt = `You are Gestura AI, a compassionate and expert educational assistant for the Gestura platform. Gestura assists students with developmental needs through therapeutic games. 
        Role: ${role}. Context: ${JSON.stringify(context)}.
        Persona: Highly empathetic, professional, and encouraging.
        
        Guidelines:
        - Provide all advice, insights, and steps to improve at home as clear, concise BULLETED POINTS.
        - Ensure your response is structured for easy readability.
        - Reference specific students and context data provided.`;

        const completion = await groq.chat.completions.create({
          messages: [
            { role: "system", content: sysPrompt },
            { role: "user", content: message }
          ],
          model: "llama-3.3-70b-versatile",
          temperature: 0.7,
          max_tokens: 500,
        });

        const aiResponse = completion.choices[0]?.message?.content;

        if (aiResponse) {
          return res.json({
            success: true,
            response: aiResponse,
            model: "Llama-3.3 (Cloud SDK)"
          });
        }
      } catch (err) {
        console.error('Groq SDK Error:', err.message);
      }
    }

    // 2. Intelligent Fallback (Local Llama Simulation)
    // This logic mimics an LLM but works without an API key
    let response = "I'm analyzing the classroom data... ";
    const lowerMsg = message.toLowerCase();

    if (role === 'teacher') {
      const students = context.students || [];
      if (lowerMsg.includes("who") || lowerMsg.includes("struggling")) {
        const struggling = students.filter(s => parseInt(s.level) < 2);
        response = struggling.length > 0
          ? `Analysis of ${students.length} students shows that ${struggling.map(s => s.name).join(', ')} might need additional level 1 support.`
          : "Based on current performance metrics, all students are hitting their developmental milestones!";
      } else if (lowerMsg.includes("progress")) {
        response = `Class overview: Most students are excelling at Level ${Math.max(...students.map(s => parseInt(s.level) || 1))}. I recommend introducing more complex motor games next week.`;
      } else {
        response = "I'm processing your request. As Gestura AI (Llama Simulation), I can help you identify student needs or suggest curriculum adjustments based on game data.";
      }
    } else if (role === 'parent') {
      const student = context.studentData || {};
      const lvlStr = student.level?.toString().toLowerCase().includes('level') ? student.level : `Level ${student.level}`;
      response = `Analysis for ${student.name}: They are currently at ${lvlStr}. Steady progress is observed in ${context.reportData?.analysis?.motor?.level?.description || 'fine motor skills'}.`;
    }

    console.log(`AI Config: Role=${role}, Using Key=${!!apiKey}`);
    res.json({
      success: true,
      response: response,
      model: "Llama-Mock (Fallback)",
      note: "Add GROQ_API_KEY to your .env to enable real Llama-3 intelligence."
    });

  } catch (error) {
    console.error('AI Controller Error:', error);
    res.status(500).json({
      success: false,
      message: 'Gestura AI encountered an error.'
    });
  }
};
