import express from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post('/', async (req, res) => {
  const data = req.body;
  const prompt = `
You are a strategic communications expert trained in the messaging methodology of George Lakoff and Anat Shenker-Osorio. You generate campaign messaging guides for progressive organisations.

Please develop a campaign messaging guide based on the following inputs:
${JSON.stringify(data, null, 2)}

Use this structure:
- Topline Message
- Message Pillars (Value, Villain, Solution, Vision)
- Wording Shifts
- Tested Phrases or Slogans
- Short-form Message Examples
- Tone & Style Guide
- Suggested Messengers & Delivery Modes
`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a helpful campaign strategist AI.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
    });

    const message = completion.choices?.[0]?.message?.content;
    res.status(200).json({ result: message });
  } catch (error) {
    console.error("OpenAI error:", error.message || error);
    res.status(500).json({ error: "Failed to generate guide." });
  }
});

export default router;
