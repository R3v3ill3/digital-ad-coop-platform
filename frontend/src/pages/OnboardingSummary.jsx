// frontend/src/pages/OnboardingSummary.jsx
import React from 'react';

export default function OnboardingSummary({ summary }) {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Onboarding Summary</h2>
      <p>{summary}</p>
    </div>
  );
}
