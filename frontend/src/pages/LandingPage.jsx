import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => (
  <div className="text-center py-20">
    <h1 className="text-4xl font-bold mb-4">Welcome to the Digital Ad Co-Op</h1>
    <p className="text-lg text-gray-700 mb-6">
      Join a smarter way to campaign, recruit, and raise funds.
    </p>
    <div className="space-x-4">
      <Link to="/signup" className="bg-blue-600 text-white px-4 py-2 rounded">Sign Up</Link>
      <Link to="/login" className="border border-blue-600 text-blue-600 px-4 py-2 rounded">Log In</Link>
    </div>
  </div>
);

export default LandingPage;
