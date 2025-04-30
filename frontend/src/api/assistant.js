// frontend/src/api/assistant.js
export async function sendQuery(input, history = []) {
  try {
    const res = await fetch('/api/campaign-assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input, history }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error('Assistant backend error:', errorData);
      return null;
    }

    const data = await res.json();
    return data;  // ⬅️ Return entire object { aiMessage, done } or { purpose, audience, ... }
  } catch (error) {
    console.error('Assistant fetch error:', error);
    return null;
  }
}
