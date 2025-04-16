import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function OnboardingSummary() {
  const [data, setData] = useState(null);
  const [showPlan, setShowPlan] = useState(false);
  const [aiPlan, setAiPlan] = useState("");
  const [loading, setLoading] = useState(false);
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

const handleGeneratePlan = async () => {
  setShowPlan(true);
  setLoading(true);

  try {
    const res = await fetch("http://localhost:4000/api/suggest-plan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await res.json();
    setAiPlan(result?.result || "⚠️ Failed to generate a campaign suggestion.");
  } catch (err) {
    console.error("❌ Error calling GPT:", err);
    setAiPlan("⚠️ Something went wrong generating your plan.");
  }

  setLoading(false);
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
        Here's what you told us. You can head straight into campaign building,
        or preview a suggested plan based on your goals.
      </p>

      <div className="bg-gray-50 p-4 rounded space-y-2 text-sm leading-relaxed">
        {Object.entries(data).map(([key, value]) => (
          <div key={key}>
            <strong className="capitalize">{key}:</strong>{" "}
            {Array.isArray(value) ? value.join(", ") : value}
          </div>
        ))}
      </div>

      <div className="text-center space-y-4">
        {!showPlan && (
          <button
            onClick={handleGeneratePlan}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded shadow"
          >
            🧠 Generate Suggested Campaign Plan
          </button>
        )}

      {showPlan && (
        <div className="bg-white border p-4 mt-2 rounded text-sm whitespace-pre-line text-gray-800">
          {loading ? (
            <div className="text-center text-gray-500 animate-pulse">
              <span className="inline-block w-4 h-4 mr-2 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></span>
              Generating your campaign plan...
            </div>
         ) : (
            <div className="text-sm text-gray-800 leading-relaxed space-y-2">
              {aiPlan.split('\n').map((line, idx) => (
                <p key={idx} className="break-words">{line}</p>
              ))}
            </div>
          )}
        </div>
      )}
        <button
          onClick={handleContinue}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded shadow mt-4"
        >
          Start Building Your Campaign
        </button>
      </div>
    </div>
  );
}

export default OnboardingSummary;
