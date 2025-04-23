import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const user = userCred.user;

      // 🔍 Look up organisation by uid
      const orgRef = collection(db, 'organisations');
      const orgQuery = query(orgRef, where('uid', '==', user.uid));
      const orgSnap = await getDocs(orgQuery);

      if (!orgSnap.empty) {
        const orgDoc = orgSnap.docs[0];
        const orgId = orgDoc.id;

        // 💾 Store organisationId for session use
        sessionStorage.setItem('organisationId', orgId);

        // ✅ Redirect to dashboard
        navigate('/app/dashboard');
      } else {
        // 🚧 No org yet? Send to onboarding
        navigate('/app/onboarding');
      }
    } catch (error) {
      alert("Login failed");
      console.error("Login error:", error);
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
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        type="submit"
      >
        Sign In
      </button>
    </form>
  );
}

export default Login;
