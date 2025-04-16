import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CampaignBuilder from './pages/CampaignBuilder';
import ChatAssistant from './pages/ChatAssistant';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/demo" element={<div>Demo contact form placeholder</div>} />
        <Route path="/app/dashboard" element={<Dashboard />} />
        <Route path="/app/campaign" element={<CampaignBuilder />} />
        <Route path="/app/ai-assistant" element={<ChatAssistant />} />
      </Routes>
    </Router>
  );
}

export default App;
