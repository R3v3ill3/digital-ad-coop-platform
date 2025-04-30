// --- BACKEND FILE: routes/messaging-guide.js ---
import express from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function buildMessagingPrompt(summary) {
  return `You are a campaign messaging expert.\n\nBased on the campaign below, develop a messaging framework with the following:\n1. Core Narrative\n2. Villain/Hero/Values\n3. Tone and Style Suggestions\n4. Slogans or Key Phrases\n5. Call-to-Action Examples\n\nCampaign:\n- Purpose: ${summary.purpose}\n- Problem: ${summary.problem || 'Not specified'}\n- Audience: ${summary.audience}\n- Target: ${summary.target}\n- Intent: ${summary.intent}\n- Location: ${summary.location}\n- Goals: ${summary.goals.join(', ')}\n`;
}

router.post('/', async (req, res) => {
  const summary = req.body;
  const prompt = buildMessagingPrompt(summary);

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'system', content: 'You are a campaign messaging strategist.' }, { role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const message = completion.choices?.[0]?.message?.content?.trim();
    if (!message) return res.status(500).json({ error: 'Empty AI response' });
    return res.json({ messagingGuide: message });
  } catch (err) {
    console.error('Messaging guide generation failed:', err);
    return res.status(500).json({ error: 'AI generation error' });
  }
});

export default router;
