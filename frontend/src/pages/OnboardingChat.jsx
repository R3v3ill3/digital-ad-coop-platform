import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const onboardingSteps = [
  {
    question: "What's your organisation called, and what type of organisation is it?",
    type: "org-info",
  },
  {
    question: "Is this campaign primarily about building your organisation, or about making change?",
    field: "campaignFocusScore",
    type: "slider",
  },
  {
    question: "What’s the primary goal of this campaign?",
    field: "campaignGoal",
    type: "textarea",
  },
  {
    question: "Who are you trying to reach?",
    field: "audienceProfile",
    type: "textarea",
  },
  {
    question: "What platforms or tools are you already using?",
    field: "platformsUsed",
    type: "checkbox",
    options: ["SMS", "Email", "CRM", "Ad platform", "Website", "None"]
  },
  {
    question: "What capacity do you have for this campaign?",
    field: "capacity",
    type: "textarea",
  },
  {
    question: "How would you like to approach your campaign content?",
    field: "contentPreference",
    type: "radio",
    options: [
      "Ready-made and tested",
      "Suggested content for me to customise",
      "My content optimised by AI",
      "I want full control"
    ]
  },
  {
    question: "Here's what you've told us so far:",
    type: "summary",
  },
];

function OnboardingChat() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    orgName: '',
    orgType: '',
    otherOrgType: '',
  });
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = async () => {
    if (step < onboardingSteps.length - 1) {
      setStep(step + 1);
    } else {
      // Send data to backend
      try {
        await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/onboarding`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        });
        console.log("✅ Onboarding data sent to backend.");
      } catch (err) {
        console.error("❌ Failed to send onboarding data:", err);
      }

      // Also store in session for campaign builder use
      sessionStorage.setItem("campaignDraft", JSON.stringify(formData));

      // Redirect to campaign builder
      navigate("/app/onboarding-summary");
    }
  };

  const stepData = onboardingSteps[step];

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Campaign Onboarding</h2>
      <p className="mb-2">{stepData.question}</p>

      {stepData.type === "org-info" && (
        <>
          <input
            placeholder="Organisation Name"
            className="w-full border p-2 mb-2"
            value={formData.orgName}
            onChange={(e) => handleInputChange("orgName", e.target.value)}
          />
          <select
            className="w-full border p-2 mb-2"
            value={formData.orgType}
            onChange={(e) => handleInputChange("orgType", e.target.value)}
          >
            <option value="">Select Organisation Type</option>
            <option value="Union">Union</option>
            <option value="Community Group">Community Group</option>
            <option value="Social Enterprise">Social Enterprise</option>
            <option value="Environmental Org">Environmental Org</option>
            <option value="Campaign Coalition">Campaign Coalition</option>
            <option value="Other">Other</option>
          </select>
          {formData.orgType === "Other" && (
            <input
              placeholder="Please specify"
              className="w-full border p-2"
              value={formData.otherOrgType}
              onChange={(e) => handleInputChange("otherOrgType", e.target.value)}
            />
          )}
        </>
      )}

      {stepData.type === "slider" && (
        <>
          <input
            type="range"
            min="0"
            max="100"
            value={formData.campaignFocusScore || 50}
            onChange={(e) => handleInputChange("campaignFocusScore", e.target.value)}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>Organisational Growth</span>
            <span>Winning Change</span>
          </div>
        </>
      )}

      {stepData.type === "textarea" && (
        <textarea
          rows="4"
          className="w-full border p-2"
          value={formData[stepData.field] || ''}
          onChange={(e) => handleInputChange(stepData.field, e.target.value)}
        />
      )}

      {stepData.type === "checkbox" && stepData.options.map((option) => (
        <label key={option} className="block">
          <input
            type="checkbox"
            value={option}
            checked={(formData[stepData.field] || []).includes(option)}
            onChange={(e) => {
              const prev = formData[stepData.field] || [];
              const updated = e.target.checked
                ? [...prev, option]
                : prev.filter((o) => o !== option);
              handleInputChange(stepData.field, updated);
            }}
            className="mr-2"
          />
          {option}
        </label>
      ))}

      {stepData.type === "radio" && stepData.options.map((option) => (
        <label key={option} className="block">
          <input
            type="radio"
            name={stepData.field}
            value={option}
            checked={formData[stepData.field] === option}
            onChange={() => handleInputChange(stepData.field, option)}
            className="mr-2"
          />
          {option}
        </label>
      ))}

      {stepData.type === "summary" && (
        <div className="bg-gray-100 p-4 rounded space-y-2 text-sm leading-relaxed">
          {Object.entries(formData).map(([key, value]) => (
            <div key={key}>
              <strong>{key}:</strong> {Array.isArray(value) ? value.join(', ') : value}
            </div>
          ))}
        </div>
      )}

      <button onClick={handleNext} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
        {step === onboardingSteps.length - 1 ? "Continue to Campaign Builder" : "Next"}
      </button>
    </div>
  );
}

export default OnboardingChat;
