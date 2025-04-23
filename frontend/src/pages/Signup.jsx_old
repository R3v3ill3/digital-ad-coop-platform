import React, { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { extractAddressComponents } from '../lib/addressHelpers';
import { useNavigate } from 'react-router-dom';

const orgTypes = ["Union", "Environmental Group", "Community Activism", "Social Enterprise", "Political Movement"];

function Signup() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    name: '',
    role: '',
    organisation: '',
    orgType: '',
    address: '',
  });

  const [placeObject, setPlaceObject] = useState(null);
  const [emailInUse, setEmailInUse] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!window.google || !window.google.maps || !window.google.maps.places) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        const input = document.getElementById('address');
        const autocomplete = new window.google.maps.places.Autocomplete(input);
        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          setPlaceObject(place);
        });
      };
    } else {
      const input = document.getElementById('address');
      const autocomplete = new window.google.maps.places.Autocomplete(input);
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        setPlaceObject(place);
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailInUse(false); // Reset state on new submit
    try {
      const userCred = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const user = userCred.user;
      const structuredAddress = placeObject ? extractAddressComponents(placeObject) : {};

      await addDoc(collection(db, 'organisations'), {
        uid: user.uid,
        name: form.name,
        role: form.role,
        organisation: form.organisation,
        orgType: form.orgType,
        address: structuredAddress,
        email: form.email
      });

      alert("Signup successful!");
      navigate("/app/campaign");
    } catch (err) {
      console.error("Firebase error:", err);
      if (err.code === 'auth/email-already-in-use') {
        setEmailInUse(true);
      } else {
        alert(err.message);
      }
    }
  };

  return (
    <form className="max-w-xl mx-auto mt-8 space-y-4" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold">Sign Up</h2>
      <input className="w-full border p-2" type="email" name="email" placeholder="Email" onChange={handleChange} required />
      <input className="w-full border p-2" type="password" name="password" placeholder="Password" onChange={handleChange} required />
      <input className="w-full border p-2" type="text" name="name" placeholder="Full Name" onChange={handleChange} required />
      <input className="w-full border p-2" type="text" name="role" placeholder="Your Role" onChange={handleChange} required />
      <input className="w-full border p-2" type="text" name="organisation" placeholder="Organisation Name" onChange={handleChange} required />
      <select className="w-full border p-2" name="orgType" onChange={handleChange} required>
        <option value="">Select Organisation Type</option>
        {orgTypes.map((type) => (
          <option key={type} value={type}>{type}</option>
        ))}
      </select>
      <input className="w-full border p-2" type="text" id="address" name="address" placeholder="Address" />

      <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">Register</button>

      {emailInUse && (
        <div className="mt-4 p-4 border border-red-400 bg-red-100 rounded">
          <p className="text-red-700 mb-2">This email is already registered.</p>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="bg-blue-100 text-blue-700 font-medium px-4 py-2 rounded hover:bg-blue-200 transition"
          >
            Click here to sign in instead
          </button>
        </div>
      )}
    </form>
  );
}

export default Signup;
