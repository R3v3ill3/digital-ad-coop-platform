// frontend/src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Signup from './pages/Signup';
import Login from './pages/Login';
import OnboardingChat from './pages/OnboardingChat';
import OnboardingSummary from './pages/OnboardingSummary';
import Dashboard from './pages/Dashboard';
import CampaignBuilder from './pages/CampaignBuilder';
import CampaignPlan from './pages/CampaignPlan';
import CampaignMessagingGuide from './pages/CampaignMessagingGuide';

export default function App() {
  return (
    <Routes>
      {/* Public access */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />

      {/* Onboarding */}
      <Route path="/onboarding" element={<OnboardingChat />} />
      <Route path="/onboarding/summary" element={<OnboardingSummary />} />

      {/* Dashboard */}
      <Route path="/dashboard" element={<Dashboard />} />

      {/* Campaign creation flow */}
      <Route path="/app/campaign/new" element={<CampaignBuilder />} />
      <Route path="/app/campaign/plan" element={<CampaignPlan />} />
      <Route path="/app/campaign/message" element={<CampaignMessagingGuide />} />
    </Routes>
  );
}
