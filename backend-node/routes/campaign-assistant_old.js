import express from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post('/', async (req, res) => {

  console.log("🛠️ Incoming request to /campaign-assistant with body:", req.body);
  const { input, history = [] } = req.body;

  const messages = [
    {
      role: 'system',
      content: `You are an expert digital campaign assistant. Your goal is to guide users to clarify their campaign goals, target audience, and key challenges so their campaign can be classified. Respond with only one question at a time.`,
    },
    ...history,
    {
      role: 'user',
      content: input
    }
  ];

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages,
      temperature: 0.7
    });

    const message = completion.choices?.[0]?.message?.content?.trim();

    if (!message) {
      return res.status(500).json({ error: "AI returned empty response." });
    }

    return res.status(200).json({
      response: {
        aiMessage: message,
        done: false
      }
    });

  } catch (err) {
    console.error("/campaign-assistant error:", err);
    return res.status(500).json({ error: "AI assistant failed." });
  }
});

export default router;
