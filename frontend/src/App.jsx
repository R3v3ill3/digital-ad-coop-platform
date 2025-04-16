import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Signup from './pages/Signup';
import OnboardingChat from "./pages/OnboardingChat";
import Login from './pages/Login';
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
        <Route path="/demo" element={<div>Demo contact form placeholder</div>} />
        <Route path="/app/dashboard" element={<Dashboard />} />
        <Route path="/app/campaign" element={<CampaignBuilder />} />
        <Route path="/app/onboarding" element={<OnboardingChat />} />
        <Route path="/app/onboarding-summary" element={<OnboardingSummary />} />
        <Route path="/app/ai-assistant" element={<ChatAssistant />} />
      </Routes>
    </Router>
  );
}

export default App;
