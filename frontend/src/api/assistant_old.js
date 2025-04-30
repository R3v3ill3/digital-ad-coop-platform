// frontend/src/api/assistant.js
export async function sendQuery(query, history = []) {
  const res = await fetch('/api/campaign-assistant', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input: query, history }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Assistant request failed');
  return data.response.aiMessage;
}
