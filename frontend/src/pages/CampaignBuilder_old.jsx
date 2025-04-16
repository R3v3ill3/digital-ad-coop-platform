import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CampaignBuilder() {
  const [formData, setFormData] = useState({
    name: '',
    goal: '',
    location: '',
    budget: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sessionStorage.setItem('campaignForm', JSON.stringify(formData));
    navigate('/app/dashboard');
  };

  return (
    <form className="max-w-xl space-y-4 p-6" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold mb-4">Build Your Campaign</h2>
      <div>
        <label className="block font-medium">Campaign Name</label>
        <input name="name" value={formData.name} onChange={handleChange} className="w-full border rounded p-2" required />
      </div>
      <div>
        <label className="block font-medium">Goal</label>
        <input name="goal" value={formData.goal} onChange={handleChange} className="w-full border rounded p-2" required />
      </div>
      <div>
        <label className="block font-medium">Location</label>
        <input name="location" value={formData.location} onChange={handleChange} className="w-full border rounded p-2" required />
      </div>
      <div>
        <label className="block font-medium">Budget</label>
        <input type="number" name="budget" value={formData.budget} onChange={handleChange} className="w-full border rounded p-2" />
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Submit</button>
    </form>
  );
}

export default CampaignBuilder;
