// chat.js
export async function sendMessage(input, history = []) {
  const messages = [
    {
      role: 'system',
      content: `You are a campaign design assistant helping a progressive organisation plan a campaign.
Your job is to guide the user to clearly describe their campaign goals, target audience, and intent.
Use a friendly, natural tone. Ask just 1–2 questions at a time. Adapt based on previous answers.
Your goal is to gather:
- Campaign goal
- Target audience
- Change vs. growth intent
- Location/timing
- Optional: underlying problem
Once you have enough info, say: "Great, I think I’ve got what I need. Let me check the campaign type..." Then stop and return: { "done": true }`,
    },
    ...history.map((msg) => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text,
    })),
    { role: 'user', content: input },
  ];

  const res = await fetch('/api/campaign-assistant', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Chat request failed');
  return data.response;
}
