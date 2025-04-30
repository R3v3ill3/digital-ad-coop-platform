// frontend/src/pages/CampaignBuilder.jsx
import React, { useState } from 'react';
import { sendQuery } from '../api/assistant';
import { classifyCampaign } from '../api/classify';
import { useNavigate } from 'react-router-dom'; // ✅ Now safe to use!

console.log(" CamapignBuilder loaded");

export default function CampaignBuilder() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [forceDone, setForceDone] = useState(false);

  const navigate = useNavigate(); // ✅ Hook to navigate pages

  const handleSend = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const newHistory = [...history, { sender: 'user', text: input }];
      setHistory(newHistory);

      const response = await sendQuery(input, history);

      if (response && response.done) {
        if (response.purpose && response.audience && response.target) {
          console.log("🎯 Structured campaign summary captured:", response);
          setSummary({ ...response, structured: true });
          await classifyCampaign(response);
        } else if (response.aiMessage) {
          console.log("🧠 Natural language final summary captured:", response.aiMessage);
          setSummary({ message: response.aiMessage, structured: false });
        } else {
          console.warn("⚠️ Done but unknown format:", response);
        }
      } else if (response && response.aiMessage) {
        setHistory([...newHistory, { sender: 'assistant', text: response.aiMessage }]);
      } else {
        console.error("⚠️ Invalid or empty response from assistant:", response);
        setError('Assistant returned an unexpected response.');
      }
    } catch (err) {
      console.error("Assistant error:", err);
      setError('Failed to communicate with assistant');
    } finally {
      setLoading(false);
      setInput('');
    }
  };

  const handleForceContinue = () => {
    setForceDone(true);
  };

  const isConversationLong = history.length >= 6;

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold mb-4">Campaign Builder</h2>

      {/* Conversation history */}
      {history.length > 0 && (
        <div className="bg-white p-4 border rounded">
          <h3 className="font-bold mb-2">Conversation History</h3>
          {history.map((entry, idx) => (
            <div key={idx} className={`mb-2 p-2 rounded ${entry.sender === 'user' ? 'bg-blue-100 text-right' : 'bg-gray-100 text-left'}`}>
              <span className="font-semibold">{entry.sender === 'user' ? 'You' : 'Assistant'}:</span> {entry.text}
            </div>
          ))}
          {loading && (
            <div className="italic text-gray-500">Thinking…</div>
          )}
        </div>
      )}

      {/* Input box */}
      <div className="flex space-x-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border p-2 flex-1"
          placeholder="Describe your campaign..."
          disabled={loading}
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={loading || !input.trim()}
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {/* Final summary */}
      {summary && (
        <div className="bg-gray-100 p-4 mt-4 rounded">
          <h3 className="font-bold mb-2">
            Campaign Summary {summary.structured ? "🎯" : "🧠"}
          </h3>
          {summary.message ? (
            <p>{summary.message}</p>
          ) : (
            <ul className="list-disc pl-5">
              <li><strong>Purpose:</strong> {summary.purpose}</li>
              <li><strong>Audience:</strong> {summary.audience}</li>
              <li><strong>Target:</strong> {summary.target}</li>
              <li><strong>Intent:</strong> {summary.intent}</li>
              <li><strong>Location:</strong> {summary.location}</li>
              <li><strong>Goals:</strong> {summary.goals?.join(', ')}</li>
            </ul>
          )}

          {/* Proceed buttons */}
          <div className="flex justify-center space-x-4 mt-6">
            <button
              onClick={() => navigate('/app/campaign/plan')}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
            >
              🎯 Start Campaign Plan
            </button>
            <button
              onClick={() => navigate('/app/campaign/message')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
            >
              🧠 Develop Messaging Guide
            </button>
          </div>
        </div>
      )}

      {/* Manual continue fallback */}
      {!summary && isConversationLong && (
        <div className="text-center">
          <button
            onClick={handleForceContinue}
            className="mt-4 bg-green-600 text-white px-6 py-2 rounded"
          >
            Continue to Campaign Setup
          </button>
        </div>
      )}

      {/* Forced summary if manually continuing */}
      {forceDone && !summary && (
        <div className="bg-yellow-100 p-4 mt-4 rounded">
          <h3 className="font-bold mb-2">Proceeding to Campaign Setup 🧠</h3>
          <p>You chose to continue manually. Please summarise your campaign when ready.</p>
        </div>
      )}
    </div>
  );
}
