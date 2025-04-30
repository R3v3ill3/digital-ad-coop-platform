import React, { useState } from 'react';
import axios from 'axios';

export default function CampaignPlan() {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generatePlan = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/campaign-plan', {});
      setPlan(response.data.plan);
    } catch (err) {
      console.error('Error generating campaign plan:', err);
      setError('Failed to generate plan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">Campaign Plan</h2>
      <button
        onClick={generatePlan}
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        {loading ? 'Generating...' : 'Generate Campaign Plan'}
      </button>

      {error && <p className="text-red-500">{error}</p>}

      {plan && (
        <div className="bg-gray-100 p-4 rounded mt-4">
          <h3 className="text-xl font-bold mb-2">Generated Plan:</h3>
          <pre className="whitespace-pre-wrap">{plan}</pre>
        </div>
      )}
    </div>
  );
}
