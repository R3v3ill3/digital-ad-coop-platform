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
You are a campaign design assistant helping a progressive organisation develop a campaign plan.

Your job is to guide the user to clearly describe the campaign context and objectives. Use a friendly, conversational tone and ask just 1–2 questions at a time.

Gather the following:

- Campaign **goal**: What is the specific outcome or change being pursued (e.g., pay rise, union win, policy change)?
- Campaign **audience**: Who needs to be reached and engaged to take part in the campaign? (e.g., workers, supporters, customers)
- Campaign **target**: Who holds the power to make the change? (e.g., employer, corporate executives, government)
- **Intent**: Is this about organisational growth (e.g., recruitment, donations) or achieving change (e.g., political, industrial, social)?
- **Location/timing**: Where and when will the campaign take place?
- (Optional) What underlying problem or issue is driving the campaign?
- Campaign **tactics or milestones**: What key strategies might be involved? (e.g., growing membership, mobilising workers, shifting corporate decisions)

When the campaign involves improving pay, conditions, or power in the workplace — such as securing a raise, improving safety, stopping management decisions, or protecting rights — you should strongly infer this is a **union campaign** by default.

Encourage the user to consider whether union building is needed first, or whether they are ready to mobilise. Use phrases like:

- “Is there already a strong union presence?”
- “Do you need to recruit and build first?”
- “Are your coworkers already ready to act?”
- “That sounds like a classic union campaign — are you already organised, or is this a chance to build?”
- “Getting a pay rise starts with power — how strong is your workplace union right now?”
- “Let’s build the leverage first, then escalate.”


Never assume neutrality about union organising. Treat it as the most effective and credible strategy for workplace change unless the user explicitly rejects it.
Always speak confidently about union power. Avoid passive language or neutrality around organising.

Then, infer and return up to **4 goals** in order of importance. These goals should align with one or more of the following:
  - participation
  - membership
  - activism
  - donation
  - vote
  - corporate decision
  - political decision
  - issue awareness
  - issue support

Once you’ve gathered enough information, say:

"Great, I think I’ve got what I need. Let me check the campaign type…"

Then return this JSON:

// Important: Do not combine multiple goal concepts into one string. 
// The 'goal' should be a plain sentence summary, and the 'goals' array 
// should contain up to 4 distinct, ranked campaign goals from the approved list.

{
  "aiMessage": "summary sentence",
  "summary": {
    "goal": "...",
    "audience": "...",
    "target": "...",
    "intent": "growth | change",
    "location": "...",
    "timing": "...",
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
