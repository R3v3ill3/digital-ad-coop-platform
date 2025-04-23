import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatAssistant from './ChatAssistant'; // adjust path if needed
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase"; // adjust path if needed

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = auth.currentUser;
      if (!user) {
        alert("You must be signed in to save your campaign.");
        return;
      }

      const campaignData = {
        ...formData,
        uid: user.uid,
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, "campaigns"), campaignData);

      navigate("/app/dashboard");
    } catch (err) {
      console.error("❌ Error saving campaign:", err);
      alert("Something went wrong while saving your campaign.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      {/* Left: Campaign form */}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-4">Build Your Campaign</h2>

        <div>
          <label className="block font-medium">Campaign Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Goal</label>
          <input
            name="goal"
            value={formData.goal}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Location</label>
          <input
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Budget</label>
          <input
            type="number"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Submit
        </button>
      </form>

      {/* Right: AI Assistant */}
      <div className="bg-white border rounded-lg p-4 shadow-md h-fit">
        <h3 className="text-xl font-semibold mb-3">AI Campaign Assistant</h3>
        <ChatAssistant />
      </div>
    </div>
  );
}

export default CampaignBuilder;
