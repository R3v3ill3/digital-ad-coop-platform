// frontend/src/pages/CampaignMessagingGuide.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function CampaignMessagingGuide() {
  const [guide, setGuide] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const summary = JSON.parse(localStorage.getItem('finalSummary'));

    if (!summary) {
      setError('No campaign summary found.');
      setLoading(false);
      return;
    }

    axios.post('/api/messaging-guide', { summary })
      .then((res) => {
        setGuide(res.data.messagingGuide);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to generate messaging guide.');
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-bold">🗣️ Messaging Guide</h1>

      {loading && <p className="text-gray-500">Thinking… writing guide...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && (
        <pre className="whitespace-pre-wrap bg-white shadow p-4 rounded">
          {guide}
        </pre>
      )}
    </div>
  );
}
