import express from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * @openapi
 * /suggest-plan:
 *   post:
 *     summary: Generate a campaign suggestion using OpenAI
 *     tags:
 *       - AI
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: AI-generated campaign plan
 */
router.post('/', async (req, res) => {
  const input = req.body;

  const prompt = `
You are a progressive digital campaign strategist. Based on the following onboarding data, generate a concise but detailed campaign plan that includes:
- Primary goal
- Recommended channels or tools
- Key target segments
- Messaging strategy
- Next steps

Data: ${JSON.stringify(input, null, 2)}
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
    console.error("OpenAI API error:", error?.response?.data || error.message);
    res.status(500).json({ error: "Failed to generate suggestion." });
  }
});

export default router;
