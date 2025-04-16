import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Digital Ad Co-Op Backend');
});

router.get('/status', (req, res) => {
  res.json({ status: "OK", version: "1.0.0" });
});


export default router;
