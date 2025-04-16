import express from 'express';
const router = express.Router();

router.post('/score', (req, res) => {
  const userData = req.body;

  // Sample scoring logic placeholder
  const score = Math.floor(Math.random() * 100);
  const segment = score > 50 ? 'Engaged Activists' : 'Civic Observers';

  res.json({ segment, score });
});

export default router;
