import React from 'react';
import { useNavigate } from 'react-router-dom';

const Review = () => {
  const navigate = useNavigate();
  const formData = JSON.parse(sessionStorage.getItem('campaignForm')) || {};

  const handleConfirm = () => {
    // Here you'd send to backend or move to next step
    navigate('/dashboard');
  };

  return (
    <div className="max-w-xl space-y-4">
      <h2 className="text-2xl font-bold mb-4">Review Your Campaign</h2>
      <p><strong>Name:</strong> {formData.name}</p>
      <p><strong>Goal:</strong> {formData.goal}</p>
      <p><strong>Location:</strong> {formData.location}</p>
      <p><strong>Budget:</strong> ${formData.budget}</p>
      <button onClick={handleConfirm} className="bg-green-600 text-white px-4 py-2 rounded">Confirm</button>
    </div>
  );
};

export default Review;
