// Updated CampaignBuilder.jsx with clean summary display

import React, { useState } from 'react';
import { sendMessage } from '../api/chat';
import { classifyCampaign } from '../api/classify';

export default function CampaignBuilder() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [summary, setSummary] = useState(null);
  const [classification, setClassification] = useState(null);
  const [step, setStep] = useState('chat');

  const handleSend = async () => {
    const userMsg = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    try {
      const res = await sendMessage(input, messages);
      console.log('Assistant response:', res);

      const botMsg = { sender: 'bot', text: res.aiMessage };
      setMessages((prev) => [...prev, botMsg]);

      if (res.done && res.summary) {
        console.log('Calling classifier with summary:', res.summary);
        setSummary(res.summary);
        setStep('review');
        const cls = await classifyCampaign(res.summary);
        console.log('Classifier result:', cls);
        setClassification(cls);
      }
    } catch (err) {
      console.error('Assistant error:', err);
    }
  };

  return (
    <div className="p-4">
      {step === 'chat' && (
        <div className="space-y-2">
          <div className="overflow-auto max-h-96 border p-2 rounded">
            {messages.map((m, i) => (
              <div key={i} className={`p-2 rounded ${m.sender === 'user' ? 'bg-blue-100' : 'bg-gray-200'}`}>{m.text}</div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 p-2 border rounded"
            />
            <button onClick={handleSend} disabled={!input.trim()} className="bg-blue-600 text-white px-4 py-2 rounded">Send</button>
          </div>
        </div>
      )}

      {step === 'review' && (
        <div className="mt-6 p-4 border rounded bg-white shadow">
          <h2 className="text-xl font-bold mb-2">Campaign Summary</h2>
          {summary && (
            <div className="mb-4 bg-gray-100 p-4 rounded">
              <p><strong>Goal:</strong> {summary.goal}</p>
              <p><strong>Audience:</strong> {summary.audience}</p>
              <p><strong>Focus:</strong> {summary.focus}</p>
              <p><strong>Location:</strong> {summary.location || '—'}</p>
              <p><strong>Timing:</strong> {summary.timing || '—'}</p>
            </div>
          )}

          {classification && (
            <>
              <h3 className="text-lg font-semibold mb-2">Predicted Campaign Type</h3>
              <p><strong>Type:</strong> {classification.match?.type || 'Unknown'}</p>
              <p><strong>Description:</strong> {classification.match?.description || '—'}</p>
              <p><strong>Suggested Actions:</strong> {classification.match?.suggested_actions || '—'}</p>
            </>
          )}

          <div className="mt-4 space-x-4">
            <button
              className="bg-green-600 text-white px-4 py-2 rounded"
              onClick={() => setStep('confirmed')}
            >
              Accept
            </button>
            <button
              className="bg-yellow-500 text-white px-4 py-2 rounded"
              onClick={() => setStep('chat')}
            >
              Revise
            </button>
          </div>
        </div>
      )}

      {step === 'confirmed' && (
        <div className="mt-4 text-green-700">✅ Campaign classification confirmed and saved (coming soon...)</div>
      )}
    </div>
  );
}
