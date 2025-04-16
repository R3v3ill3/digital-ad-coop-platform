import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function OnboardingSummary() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const draft = sessionStorage.getItem("campaignDraft");
    if (draft) {
      setData(JSON.parse(draft));
    }
  }, []);

  const handleContinue = () => {
    navigate("/app/campaign");
  };

  if (!data) {
    return (
      <div className="max-w-xl mx-auto mt-12 text-center">
        <p>Loading your onboarding summary...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 mt-8 bg-white shadow rounded space-y-6">
      <h2 className="text-2xl font-bold text-center mb-2">🎉 You're ready to build!</h2>
      <p className="text-center text-gray-600 mb-4">
        Based on what you've told us, we’re ready to help you create a campaign that works.
        Here's a quick recap of what you shared:
      </p>

      <div className="bg-gray-50 p-4 rounded space-y-2 text-sm leading-relaxed">
        {Object.entries(data).map(([key, value]) => (
          <div key={key}>
            <strong className="capitalize">{key}:</strong>{" "}
            {Array.isArray(value) ? value.join(", ") : value}
          </div>
        ))}
      </div>

      <div className="text-center">
        <button
          onClick={handleContinue}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded shadow mt-6"
        >
          Start Building Your Campaign
        </button>
      </div>
    </div>
  );
}

export default OnboardingSummary;
