// frontend/src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';

export default function Dashboard() {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'campaigns'), (snapshot) => {
      setCampaigns(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Your Campaigns</h2>
      <ul className="space-y-2">
        {campaigns.map((c) => (
          <li key={c.id} className="p-2 border rounded">
            <h3 className="font-semibold">{c.name}</h3>
            <p>{c.goal}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
