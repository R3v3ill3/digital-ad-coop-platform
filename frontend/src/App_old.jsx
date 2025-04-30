// frontend/src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Signup from './pages/Signup';
import Login from './pages/Login';
import OnboardingChat from './pages/OnboardingChat';
import OnboardingSummary from './pages/OnboardingSummary';
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
        <Route path="/app/onboarding" element={<OnboardingChat />} />
        <Route path="/app/onboarding-summary" element={<OnboardingSummary />} />
        <Route path="/app/dashboard" element={<Dashboard />} />
        <Route path="/app/campaign" element={<CampaignBuilder />} />
        <Route path="/app/ai-assistant" element={<ChatAssistant />} />
        <Route path="/app/campaign/new" element={<CampaignBuilder />} />
      </Routes>
    </Router>
  );
}

export default App;
