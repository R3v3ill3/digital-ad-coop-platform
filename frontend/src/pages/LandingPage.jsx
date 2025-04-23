// frontend/src/pages/LandingPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <h1 className="text-4xl font-bold mb-6">Welcome to Digital Co-op</h1>
      <div className="space-x-4">
        <Link to="/signup" className="px-4 py-2 bg-green-600 text-white rounded">
          Sign Up
        </Link>
        <Link to="/login" className="px-4 py-2 bg-blue-600 text-white rounded">
          Log In
        </Link>
      </div>
    </div>
  );
}
