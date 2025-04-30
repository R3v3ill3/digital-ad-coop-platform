// frontend/src/pages/Signup.jsx
import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/onboarding');
    } catch (e) {
      if (e.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please log in instead.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignup} className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Sign Up</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 border rounded"
      />

      {error && <p className="text-red-600">{error}</p>}

      <button
        type="submit"
        className="px-4 py-2 bg-green-600 text-white rounded w-full"
        disabled={loading}
      >
        {loading ? 'Creating account...' : 'Continue'}
      </button>

      <div className="text-center text-sm mt-2">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-600 underline">
          Log in
        </Link>
      </div>
    </form>
  );
}
