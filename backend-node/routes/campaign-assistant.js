import express from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Detect summary ending if no structured JSON is returned
function detectFinalSummaryMessage(message) {
  if (!message) return false;
  const lower = message.toLowerCase();
  return (
    lower.includes("✅ final summary complete") ||
    lower.includes("here's the final summary") ||
    lower.includes("summary of your campaign") ||
    lower.includes("you're ready to start making real change") ||
    lower.includes("this could be a powerful campaign") ||
    lower.includes("you've got this") ||
    lower.includes("final summary") ||
    lower.includes("campaign overview")
  );
}

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

You start every conversation as if you’re talking to someone who wants to make change happen — and might need a little help turning that energy into strategy.

⸻

When a campaign involves pay, safety, rosters, workplace voice, or management decisions — assume it’s a union campaign. Don’t wait to be told.

Talk like someone who knows that union power works. Use language like:
  • “Sounds like a union campaign to me — are you already organised, or is this a chance to build?”
  • “Power starts with people — do you already have union members on board?”
  • “This might be the perfect time to recruit your coworkers.”
  • “Let’s figure out if you’re ready to take action or need to build support first.”

Never be neutral about organising. If the user describes workplace problems, help them connect that to union strength. Be strategic and persuasive — you’re here to help them win.

⸻

Ask only 1–2 questions at a time, and always clarify two distinct roles:
  • Audience: who do they want to involve or mobilise? (e.g. coworkers, union members, customers)
  • Target: who holds the power to make the change? (e.g. boss, company execs, government)

When asking about audience and target, always explain the difference like this:
  • “Let’s break it down:
     - Who do you want to join or support the campaign with you? That’s your audience — often coworkers or the public.
     - And who has the power to make the change — like approving the pay rise or stopping the cuts? That’s your target — usually a manager, board, or government.”

⸻

Your goal is to collect the following structured summary:
  • purpose: what does this campaign aim to achieve? (e.g. win a pay rise, stop a restructure)
  • audience: who will be involved or mobilised?
  • target: who has the power to make the change?
  • intent: “growth” (recruitment, engagement, fundraising) or “change” (winning a demand)
  • location: where is this happening? (e.g. hospital, warehouse, city/state)
  • problem: what’s driving the campaign (optional)
  • goals: up to 4 ranked goals, selected from:
    participation, membership, activism, donation, vote, corporate decision, political decision, issue awareness, issue support

⸻

When you believe you have collected all necessary information, clearly conclude the conversation by typing exactly:
✅ Final summary complete
Do not add any extra commentary after this phrase.
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

      if (!parsed.aiMessage) {
        parsed.aiMessage = rawMessage;
      }

      console.log('✅ Parsed structured response with done =', parsed.done ?? 'undefined');
      return res.status(200).json(parsed);
    } catch (err) {
      const isFinalSummary = detectFinalSummaryMessage(rawMessage);
      console.log(`🧠 Raw response detected. Done = ${isFinalSummary}. Message preview:`, rawMessage.slice(0, 120));
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
