// /frontend/src/pages/CampaignBuilder.jsx
import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function CampaignBuilder() {
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('');
  const [campType, setCampType] = useState('');
  const [messageFramework, setMessageFramework] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const docRef = await addDoc(collection(db, 'campaigns'), {
        name,
        goal,
        campType,
        messageFramework,
        createdAt: new Date().toISOString(),
      });
      console.log('Document written with ID: ', docRef.id);
      setName('');
      setGoal('');
      setCampType('');
      setMessageFramework('');
    } catch (e) {
      console.error('Error adding document: ', e);
    }
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Create a New Campaign</h2>
      <input
        type="text"
        placeholder="Campaign Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <textarea
        placeholder="Campaign Goal"
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <select
        value={campType}
        onChange={(e) => setCampType(e.target.value)}
        className="w-full p-2 border rounded"
      >
        <option value="">Select Campaign Type</option>
        <option value="fundraising">Fundraising</option>
        <option value="recruitment">Recruitment</option>
        <option value="public-awareness">Public Awareness</option>
      </select>
      <textarea
        placeholder="Message Framework"
        value={messageFramework}
        onChange={(e) => setMessageFramework(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <button
        type="submit"
        disabled={saving}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        {saving ? 'Saving...' : 'Create Campaign'}
      </button>
    </form>
  );
}
