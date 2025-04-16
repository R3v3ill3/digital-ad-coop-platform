import React from 'react';

function Dashboard() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Your Dashboard</h1>
      <p className="text-gray-600 mb-6">Welcome back! Your campaign analytics will appear here soon.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 border rounded shadow-sm">
          <h2 className="font-semibold text-lg">Campaigns</h2>
          <p className="text-sm text-gray-500">0 campaigns created (yet!)</p>
        </div>
        <div className="p-4 border rounded shadow-sm">
          <h2 className="font-semibold text-lg">Messages Sent</h2>
          <p className="text-sm text-gray-500">0 SMS / Email interactions</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
