// frontend/src/pages/ChatAssistant.jsx
import React, { useState } from 'react';
import { sendQuery } from '../api/assistant';

export default function ChatAssistant() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');

  const handleQuery = async () => {
    try {
      const res = await sendQuery(query);
      setResponse(res);
    } catch (e) {
      console.error('Assistant error', e);
    }
  };

  return (
    <div className="p-4 space-y-2">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ask for campaign advice..."
        className="w-full p-2 border rounded"
      />
      <button
        onClick={handleQuery}
        className="px-4 py-2 bg-indigo-600 text-white rounded"
        disabled={!query.trim()}
      >
        Ask
      </button>
      {response && (
        <div className="mt-4 p-2 border rounded bg-gray-100">{response}</div>
      )}
    </div>
  );
}
