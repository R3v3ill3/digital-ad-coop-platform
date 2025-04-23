// backend-node/routes/campaign-assistant.js

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

  const systemPrompt = `
You are a campaign design assistant helping a progressive organisation plan a campaign.
Your job is to guide the user to clearly describe their campaign goals, target audience, and intent.

Use a friendly, natural tone. Ask just 1–2 questions at a time. Adapt based on previous answers.

Your goal is to gather:
- Campaign goal
- Target audience
- Change vs. growth intent
- Location/timing
- Optional: underlying problem

Once you have enough info, say:
"Great, I think I’ve got what I need. Let me check the campaign type..."
Then stop and return: { "aiMessage": "string", "done": true }

Respond ONLY as JSON:
{ "aiMessage": "string", "done": true/false }
  `;

  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.map(entry => ({
      role: entry.sender === 'user' ? 'user' : 'assistant',
      content: entry.text
    })),
    { role: 'user', content: input }
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

    try {
      const parsed = JSON.parse(message);
      return res.status(200).json(parsed); // <- frontend expects { aiMessage, done }
    } catch (err) {
      console.warn("⚠️ Failed to parse AI response, returning raw:", message);
      return res.status(200).json({
        aiMessage: message,
        done: false
      });
    }

  } catch (err) {
    console.error("/campaign-assistant error:", err);
    return res.status(500).json({ error: "AI assistant failed." });
  }
});

export default router;
