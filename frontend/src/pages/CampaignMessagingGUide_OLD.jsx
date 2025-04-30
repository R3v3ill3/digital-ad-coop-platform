import React, { useState } from 'react';
import axios from 'axios';

export default function CampaignMessagingGuide() {
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateGuide = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/messaging-guide', {});
      setGuide(response.data.guide);
    } catch (err) {
      console.error('Error generating messaging guide:', err);
      setError('Failed to generate guide.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">Messaging Guide</h2>
      <button
        onClick={generateGuide}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? 'Generating...' : 'Generate Messaging Guide'}
      </button>

      {error && <p className="text-red-500">{error}</p>}

      {guide && (
        <div className="bg-gray-100 p-4 rounded mt-4">
          <h3 className="text-xl font-bold mb-2">Generated Guide:</h3>
          <pre className="whitespace-pre-wrap">{guide}</pre>
        </div>
      )}
    </div>
  );
}
