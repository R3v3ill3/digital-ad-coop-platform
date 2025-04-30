import express from 'express';
import { db } from '../firebase.js';
import { collection, addDoc, updateDoc, doc, query, where, getDocs } from 'firebase/firestore';

const router = express.Router();

router.post('/create', async (req, res) => {
  try {
    const docRef = await addDoc(collection(db, "campaigns"), req.body);
    res.status(201).json({ id: docRef.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/update/:id', async (req, res) => {
  try {
    const campaignRef = doc(db, "campaigns", req.params.id);
    await updateDoc(campaignRef, req.body);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
