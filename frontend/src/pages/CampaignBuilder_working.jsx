import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function CampaignBuilder() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [forceDone, setForceDone] = useState(false);

  const navigate = useNavigate();

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newHistory = [...history, { role: 'user', content: input }];
    setHistory(newHistory);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/campaign-assistant', {
        input,
        history: newHistory,
      });

      const { aiMessage, done, ...structuredData } = response.data;

      setHistory((prev) => [...prev, { role: 'assistant', content: aiMessage }]);

      if (done || forceDone) {
        console.log('✅ Final summary captured:', response.data);

        if (structuredData.purpose || structuredData.goals) {
          setSummary({ ...structuredData, structured: true });
        } else {
          setSummary({ message: aiMessage, structured: false });
        }
      }
    } catch (err) {
      console.error('Error communicating with assistant:', err);
      setError('Failed to communicate with assistant.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const renderHistory = () => (
    <div className="space-y-4 max-h-[50vh] overflow-y-auto border rounded p-4 mb-4">
      {history.map((msg, index) => (
        <div key={index} className={`p-2 rounded ${msg.role === 'user' ? 'bg-gray-100' : 'bg-blue-50'}`}>
          <strong>{msg.role === 'user' ? 'You' : msg.structured ? '🎯 Assistant' : '🧠 Assistant'}:</strong>
          <div className="whitespace-pre-wrap">{msg.content}</div>
        </div>
      ))}
    </div>
  );

  const renderNextSteps = () => (
    <div className="mt-6 space-x-4">
      <button
        onClick={() => navigate('/campaign/message', { state: { summary } })}
        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
      >
        ✍️ Write Campaign Messaging
      </button>
      <button
        onClick={() => navigate('/campaign/plan', { state: { summary } })}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
      >
        🗺 Build Campaign Plan
      </button>
    </div>
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-2">Campaign Design Assistant</h1>
      <p className="text-gray-600 mb-4">
        What kind of campaign are you working on? Tell me what’s going on at your workplace or in your community.
      </p>

      {renderHistory()}

      <textarea
        className="w-full p-3 border rounded mb-2"
        placeholder="Type your next message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={3}
      />

      <div className="flex space-x-2">
        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          {loading ? 'Sending...' : 'Send'}
        </button>

        {!summary && (
          <button
            onClick={() => setForceDone(true)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
          >
            Force Done
          </button>
        )}
      </div>

      {error && <p className="text-red-600 mt-2">{error}</p>}

      {summary && renderNextSteps()}
    </div>
  );
}
