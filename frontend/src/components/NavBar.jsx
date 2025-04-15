import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => (
  <nav className="bg-white shadow p-4 flex justify-between items-center">
    <div className="text-xl font-bold">Ad Co-Op</div>
    <div className="space-x-4">
      <Link to="/" className="text-gray-700 hover:text-black">Home</Link>
      <Link to="/campaign" className="text-gray-700 hover:text-black">New Campaign</Link>
      <Link to="/dashboard" className="text-gray-700 hover:text-black">Dashboard</Link>
    </div>
  </nav>
);

export default NavBar;
