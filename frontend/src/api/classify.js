// src/api/classify.js

export async function classifyCampaign(summary) {
  const res = await fetch('/api/classify-campaign-type', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ summary })
  });

  if (!res.ok) {
    throw new Error('Failed to classify campaign');
  }

  return await res.json();
}
