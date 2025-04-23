// frontend/src/pages/CampaignBuilder.jsx

import React, { useEffect, useRef, useState } from 'react';

export default function CampaignBuilder() {
  const [conversation, setConversation] = useState([]);
  const [input, setInput] = useState('');
  const [isDone, setIsDone] = useState(false);
  const scrollRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: 'user', text: input };
    setConversation((prev) => [...prev, userMsg]);
    setInput('');

    try {
      const res = await fetch('/api/campaign-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input,
          history: conversation,
        }),
      });

      const { aiMessage, done } = await res.json();
      const botMsg = { sender: 'bot', text: aiMessage };
      setConversation((prev) => [...prev, botMsg]);
      setIsDone(done);

      if (done) {
        // Trigger next phase: auto-classification (placeholder for now)
        setTimeout(() => {
          setConversation((prev) => [
            ...prev,
            { sender: 'bot', text: '📊 Classifying your campaign type now...' },
          ]);
          // Optionally: POST to /api/classify-campaign with summary
        }, 1000);
      }
    } catch (err) {
      console.error('Assistant error:', err);
      setConversation((prev) => [
        ...prev,
        { sender: 'bot', text: '⚠️ Something went wrong. Please try again.' },
      ]);
    }
  };

  useEffect(() => {
    // Start with opening message if conversation is empty
    if (conversation.length === 0) {
      const intro = {
        sender: 'bot',
        text: '👋 Thanks! Can I ask a couple quick questions to understand your campaign better?',
      };
      setConversation([intro]);
    }
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-2">Campaign Builder Assistant</h2>
      <p className="text-gray-600 mb-4">
        Describe your campaign, and I’ll help you define it clearly.
      </p>

      <div className="flex flex-col space-y-2 mb-4 max-h-[60vh] overflow-auto border rounded p-4 bg-white shadow-sm">
        {conversation.map((msg, i) => (
          <div
            key={i}
            className={`p-2 rounded max-w-[80%] ${
              msg.sender === 'user'
                ? 'bg-blue-100 self-end text-right'
                : 'bg-gray-100 self-start'
            }`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      {!isDone && (
        <div className="flex space-x-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 p-2 border rounded"
            placeholder="Type your response..."
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2 bg-blue-600 text-white rounded"
            disabled={!input.trim()}
          >
            Send
          </button>
        </div>
      )}

      {isDone && (
        <p className="text-green-600 mt-4 font-semibold">
          ✅ Thanks! I’m working on your campaign classification now...
        </p>
      )}
    </div>
  );
}
