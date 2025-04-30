// src/api/chat.js

export async function sendMessage(input, history = []) {
  const res = await fetch('/api/campaign-assistant', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input, history }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Chat request failed');

  return data.response; // 
}
