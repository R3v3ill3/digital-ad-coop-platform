import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/app/dashboard');
    } catch (error) {
      alert("Login failed");
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleLogin} className="max-w-xl mx-auto mt-12 space-y-4">
      <h2 className="text-2xl font-bold mb-2">Login</h2>
      <input
        className="w-full border p-2"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        className="w-full border p-2"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">
        Sign In
      </button>
    </form>
  );
}

export default Login;
