// backend-node/routes/campaign-assistant.js
import express from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ✅ Helper function to detect if AI conversation is final
function detectFinalSummaryMessage(message) {
  if (!message) return false;
  const lower = message.toLowerCase();
  return (
    lower.includes("✅ final summary complete") ||
    lower.includes("here's the final summary") ||
    lower.includes("this could be a powerful campaign") ||
    lower.includes("best of luck with your campaign") ||
    lower.includes("you've got this") ||
    lower.includes("you're ready to start making real change") ||
    lower.includes("together we can make your workplace better")
  );
}

// ✅ Main campaign assistant route
router.post('/', async (req, res) => {
  try {
    const { input, history = [] } = req.body;

    if (!input) {
      console.error('❌ Missing input');
      return res.status(400).json({ error: 'Missing input' });
    }

    const messages = [
      {
        role: 'system',
        content: `
You are a sharp, confident, and experienced campaign strategist who works with unions and progressive organisations. You speak in a natural, conversational tone — like an organiser who’s been there before and knows what it takes to win.

Your job is to guide users through a quick conversation to understand their campaign, classify it, and prepare it for planning.

(📜 SYSTEM PROMPT SHORTENED — FULL TEXT AVAILABLE IF NEEDED)
        `.trim(),
      },
      ...history.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: 'user', content: input },
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
      temperature: 0.7,
    });

    const rawMessage = completion.choices?.[0]?.message?.content?.trim();

    if (!rawMessage) {
      console.error('❌ OpenAI returned empty message');
      return res.status(500).json({ error: 'AI returned empty response.' });
    }

    let parsed;
    try {
      parsed = JSON.parse(rawMessage);
      return res.status(200).json(parsed);
    } catch (err) {
      // Fallback to natural language detection
      const isFinalSummary = detectFinalSummaryMessage(rawMessage);
      return res.status(200).json({
        aiMessage: rawMessage,
        done: isFinalSummary,
      });
    }
  } catch (err) {
    console.error('❌ Error in /campaign-assistant:', err);
    return res.status(500).json({ error: 'AI assistant failed.' });
  }
});

export default router;
