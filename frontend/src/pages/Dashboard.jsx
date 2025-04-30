// frontend/src/pages/Dashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  console.log("✅ Dashboard component mounted");

  // TEMPORARY: use fallback values until real data is passed via context or props
  const onboardingSummary = null;
  const campaigns = [];

  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p>Welcome to your dashboard. Manage your organisation and campaigns here.</p>

      <button
        onClick={() => navigate('/app/campaign/new')}
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
      >
        Start a New Campaign
      </button>

      {/* Onboarding Summary Section */}
      {onboardingSummary && (
        <div className="bg-white shadow p-6 rounded-lg mt-6">
          <h2 className="text-2xl font-semibold mb-4">Organisation Overview</h2>
          <pre className="whitespace-pre-wrap">{JSON.stringify(onboardingSummary, null, 2)}</pre>
        </div>
      )}

      {/* Campaign List Section */}
      {campaigns && campaigns.length > 0 && (
        <div className="bg-white shadow p-6 rounded-lg mt-6">
          <h2 className="text-2xl font-semibold mb-4">Your Campaigns</h2>
          <ul className="list-disc list-inside">
            {campaigns.map((campaign) => (
              <li key={campaign.id} className="mb-2">
                {campaign.name} — {campaign.status}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
