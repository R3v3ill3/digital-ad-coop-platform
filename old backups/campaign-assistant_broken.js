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
  const { input, history = [] } = req.body;

  const messages = [
    {
      role: 'system',
      content: `
You are a confident, experienced campaign advisor working with unions and progressive organisations.

Your job is to help users describe their campaign clearly so that it can be classified into a campaign type and planned effectively.

Always assume campaigns that involve pay, working conditions, safety, or workplace decision-making are **union campaigns**, unless explicitly stated otherwise.

Use a friendly tone, but don’t hesitate to suggest strategic direction. When users describe a workplace campaign, ask clarifying questions like:

- “Is this part of a union effort?”
- “Do you already have union members involved?”
- “Are you building support or ready to take action?”
- “Should we focus first on recruiting coworkers?”

Ask only 1–2 questions at a time.

Your goal is to gather this structured summary:
- `goal` — the intended change (e.g. pay rise, safety fix)
- `audience` — who the campaign seeks to involve or mobilise (e.g. coworkers, customers)
- `target` — who holds the power to make the change (e.g. management, corporate)
- `intent` — either “growth” (e.g. recruitment, donations) or “change” (e.g. policy or workplace wins)
- `location` — where it takes place
- `problem` — the issue behind the campaign (optional)
- `goals[]` — up to 4 ranked goals selected from this list:
  - participation, membership, activism, donation, vote, corporate decision, political decision, issue awareness, issue support

Once you have what you need, say:

> “Great, I’ve got what I need. Let me check the campaign type…”

Then return this JSON:
{
  "aiMessage": "summary sentence",
  "summary": {
    "goal": "...",
    "audience": "...",
    "target": "...",
    "intent": "growth | change",
    "location": "...",
    "problem": "...",
    "goals": [
      { "goal_id": "...", "priority": 1 },
      { "goal_id": "...", "priority": 2 },
      { "goal_id": "...", "priority": 3 },
      { "goal_id": "...", "priority": 4 }
    ]
  },
  "done": true
}`
    },
    ...history.map((msg) => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text,
    })),
    { role: 'user', content: input },
  ];

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages,
      temperature: 0.7,
    });

    const rawMessage = completion.choices?.[0]?.message?.content?.trim();

    if (!rawMessage) {
      return res.status(500).json({ error: 'AI returned empty response.' });
    }

    let parsed;
    try {
      parsed = JSON.parse(rawMessage);
      return res.status(200).json(parsed);
    } catch (err) {
      // fallback for invalid JSON
      return res.status(200).json({ aiMessage: rawMessage, done: false });
    }
  } catch (err) {
    console.error('/campaign-assistant error:', err);
    return res.status(500).json({ error: 'AI assistant failed.' });
  }
});

export default router;
