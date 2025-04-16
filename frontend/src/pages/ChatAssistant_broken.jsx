import React, { useState } from 'react';

function ChatAssistant() {
  const [userInput, setUserInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse('');
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content:
                'You are a helpful campaign design assistant. When the user describes their organisation and goals, help classify it by goal type (e.g. fundraising, recruitment, volunteering), organisation type (e.g. union, environmental group), and suggest one or more campaign actions they can take.',
            },
            {
              role: 'user',
              content: userInput,
            },
          ],
          temperature: 0.7,
        }),
      });

      const data = await res.json();
      const message = data.choices?.[0]?.message?.content;
      setResponse(message || 'No response received.');
    } catch (err) {
      console.error(err);
      setResponse('Error fetching response.');
    }
    setLoading(false);
  };

return (
  <div className="max-w-xl mx-auto mt-8">
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold">Campaign Design Assistant</h2>

      <textarea
        rows="5"
        className="w-full border p-2"
        placeholder="Describe your organisation and campaign goals..."
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        required
      />

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? 'Thinking...' : 'Submit'}
      </button>
    </form>

    {response && (
      <div className="mt-4 p-4 bg-gray-100 border rounded">
        <h3 className="font-semibold mb-2">Response:</h3>
        <div className="text-sm text-gray-800 leading-relaxed space-y-2">
          {response.split('\n').map((line, idx) => (
            <p key={idx} className="break-words">{line}</p>
          ))}
        </div>
      </div>
    )}
  </div>
);

export default ChatAssistant;
