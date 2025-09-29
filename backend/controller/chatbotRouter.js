const express = require('express');
const chatbotRouter = express.Router();
const axios = require('axios');

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY; 

chatbotRouter.get('/recommendations',async (req, res) => {
    try {
        const { interests, budget } = req.query;
        const recommendations = [
            { destination: 'Paris', type: 'Culture', budget: 'High' },
            { destination: 'Goa', type: 'Adventure', budget: 'Low' },
        ].filter(rec => rec.type === interests && rec.budget === budget);

        if (recommendations.length === 0) {
            return res.status(404).send({ message: "No recommendations found" });
        }

        res.status(200).send(recommendations);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Something went wrong" });
    }
});


chatbotRouter.post('/chat', async (req, res) => {
  const { message } = req.body;
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: "openai/gpt-3.5-turbo", // or "deepseek-coder" if you want code answers
        messages: [
          {
            role: "system",
            content: "You are a helpful travel assistant. Always respond in English only."
          },
          { role: "user", content: message }
        ],
        max_tokens: 4096,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    const choice = response.data.choices[0];
    let reply = (choice.message.content || "").trim();

    // Fallback to reasoning if content is empty
    if (!reply && choice.message.reasoning) {
      reply = choice.message.reasoning.trim();
    }
    if (!reply) {
      reply = "Sorry, I couldn't get a response from the AI.";
    }

    res.json({ reply });
  } catch (error) {
    console.error("OpenRouter error:", error?.response?.data || error.message);
    res.status(500).json({ error: "AI service error" });
  }
});


module.exports = chatbotRouter;