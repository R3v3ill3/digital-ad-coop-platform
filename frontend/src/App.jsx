import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import NewCampaign from './pages/NewCampaign';
import Review from './pages/Review';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <NavBar />
      <div className="p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/campaign" element={<NewCampaign />} />
          <Route path="/review" element={<Review />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
