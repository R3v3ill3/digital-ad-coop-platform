---

## ✅ Fix: Fully Restore the Old Backend Output Format

Here’s the correct full `campaign-assistant.js` you should be using right now:

```js
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
    content: `You are a helpful and conversational campaign design assistant.
Your goal is to help the user describe their campaign in plain English so you can classify its type.
Ask only a few friendly questions at a time, and respond naturally.`,
  },
  ...history,
  {
    role: 'user',
    content: input,
  },
];

try {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages,
    temperature: 0.7,
  });

  const message = completion.choices?.[0]?.message?.content?.trim();

  if (!message) {
    return res.status(500).json({ error: 'AI returned empty response.' });
  }

  // ✅ Return only a plain string
  return res.status(200).json({ response: message });

} catch (err) {
  console.error('/campaign-assistant error:', err);
  return res.status(500).json({ error: 'AI assistant failed.' });
}
});

export default router;
