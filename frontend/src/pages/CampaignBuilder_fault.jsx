// frontend/src/pages/CampaignBuilder.jsx
import React, { useState } from 'react';
import { sendQuery } from '../api/assistant';
import { classifyCampaign } from '../api/classify';

export default function CampaignBuilder() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSend = async () => {
    if (!input.trim()) return; // prevent sending empty messages

    setLoading(true);
    setError(null);
    try {
      const newHistory = [...history, { sender: 'user', text: input }];
      setHistory(newHistory);

      const response = await sendQuery(input, history);

      if (response && response.done) {
        if (response.purpose && response.audience && response.target) {
          console.log("🎯 Structured campaign summary captured:", response);
          setSummary(response);
          await classifyCampaign(response);
        } else if (response.aiMessage) {
          console.log("🎯 Natural language final summary captured:", response.aiMessage);
          setSummary({ message: response.aiMessage, incomplete: true });
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

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Campaign Builder</h2>
      <div className="mb-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border p-2 w-full"
          placeholder="Describe your campaign..."
          disabled={loading}
        />
      </div>
      <button
        onClick={handleSend}
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={loading || !input.trim()}
      >
        {loading ? 'Sending...' : 'Send'}
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {summary && (
        <div className="bg-gray-100 p-4 mt-4">
          <h3 className="font-bold mb-2">Campaign Summary</h3>
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
        </div>
      )}

      {history.length > 0 && (
        <div className="bg-white p-4 mt-6 border rounded">
          <h3 className="font-bold mb-2">Conversation History</h3>
          {history.map((entry, idx) => (
            <div key={idx} className="mb-2">
              <span className="font-semibold">{entry.sender === 'user' ? 'You' : 'Assistant'}:</span> {entry.text}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
