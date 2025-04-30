import express from 'express';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const actionsPath = path.resolve('./data/campaign_actions.json');
const actionsData = JSON.parse(fs.readFileSync(actionsPath, 'utf-8'));

function buildPrompt(summary) {
  return `You are a senior digital campaign strategist.\n\nBased on the campaign details below, recommend 3–5 phased campaign actions using this taxonomy:\n\n- Action Types: petition, event, survey, phonebank, etc.\n- Channels: web, SMS, email, social media, phone, physical\n- Platforms: Action Network, Facebook, Yabbr, etc.\n- Delivery Modes: online, offline, volunteer-led, automated\n- Automation: only include automatable actions unless noted\n- Match the campaign’s goals, audience, and scale.\n\nFor each recommended action, return:\n- Action Name\n- Why it fits this campaign\n- Key steps to prepare\n- Platform suggestions\n- Resource effort (low/med/high)\n- Prompt type (for content gen)\n\nCampaign:\n- Purpose: ${summary.purpose}\n- Problem: ${summary.problem || 'Not specified'}\n- Audience: ${summary.audience}\n- Target: ${summary.target}\n- Intent: ${summary.intent}\n- Location: ${summary.location}\n- Goals: ${summary.goals.join(', ')}\n`;
}

router.post('/', async (req, res) => {
  const summary = req.body;
  const prompt = buildPrompt(summary);

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'system', content: 'You are a campaign planning assistant.' }, { role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const message = completion.choices?.[0]?.message?.content?.trim();
    if (!message) return res.status(500).json({ error: 'Empty AI response' });
    return res.json({ plan: message });
  } catch (err) {
    console.error('Campaign plan generation failed:', err);
    return res.status(500).json({ error: 'AI generation error' });
  }
});

export default router
