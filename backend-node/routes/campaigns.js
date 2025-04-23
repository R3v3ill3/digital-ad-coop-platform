import express from 'express';
import { db } from '../firebase.js';
import { FieldValue } from 'firebase-admin/firestore';

const router = express.Router();

// Create a new campaign
router.post('/create', async (req, res) => {
  try {
    const docRef = await db.collection('campaigns').add({
      ...req.body,
      createdAt: FieldValue.serverTimestamp()
    });
    res.status(201).json({ id: docRef.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update an existing campaign
router.put('/update/:id', async (req, res) => {
  try {
    const campaignRef = db.collection('campaigns').doc(req.params.id);
    await campaignRef.update(req.body);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
