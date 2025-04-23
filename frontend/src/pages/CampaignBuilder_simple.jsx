import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

function CampaignBuilder() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    campaignTitle: '',
    campaignGoal: '',
    targetAudiences: '',
    oppositionFrame: '',
    primaryEmotions: '',
    trustedMessengers: '',
    geographicContext: '',
    challenges: '',
    coreValues: '',
    theoryOfChange: '',
    campaignType: '',
    aiClassification: '',
  });
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);
  const navigate = useNavigate();

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAIExtract = async () => {
    setAiLoading(true);
    setAiError(null);

    try {
      const response = await fetch("/api/suggest-plan", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json();

      if (result && result.result) {
        setFormData((prev) => ({
          ...prev,
          aiClassification: result.result,
        }));
        setStep(1); // move to confirmation step
      } else {
        throw new Error("Invalid AI response");
      }
    } catch (err) {
      console.error("AI error:", err);
      setAiError("Failed to classify campaign. Please try again.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");

      await addDoc(collection(db, 'campaigns'), {
        ...formData,
        uid: user.uid,
        createdAt: new Date().toISOString(),
      });
      navigate('/app/dashboard');
    } catch (err) {
      console.error("Error saving campaign:", err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow rounded space-y-6">
      {step === 0 && (
        <>
          <h2 className="text-xl font-bold">🧠 Describe Your Campaign</h2>
          <textarea
            name="campaignGoal"
            value={formData.campaignGoal}
            onChange={handleInput}
            placeholder="What is your campaign trying to achieve?"
            className="w-full border p-2 rounded"
          />
          <button
            onClick={handleAIExtract}
            disabled={aiLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {aiLoading ? "Thinking..." : "Generate Plan with AI"}
          </button>
          {aiError && <p className="text-red-600 mt-2">{aiError}</p>}
        </>
      )}

      {step === 1 && (
        <>
          <h2 className="text-xl font-semibold">✨ Confirm Details</h2>
          <div className="text-sm bg-gray-50 p-4 rounded space-y-2">
            {Object.entries(formData).map(([key, value]) => (
              <div key={key}><strong>{key}:</strong> {value}</div>
            ))}
          </div>
          <div className="flex justify-between mt-4">
            <button onClick={() => setStep(0)} className="text-blue-600">⬅️ Back</button>
            <button
              onClick={handleSubmit}
              className="bg-emerald-600 text-white px-4 py-2 rounded"
            >
              ✅ Save and Go to Dashboard
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default CampaignBuilder;
