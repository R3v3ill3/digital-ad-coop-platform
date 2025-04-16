import express from 'express';
const router = express.Router();

/**
 * @swagger
 * /segments/score:
 *   post:
 *     summary: Score a campaign profile
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               orgType:
 *                 type: string
 *               goal:
 *                 type: string
 *     responses:
 *       200:
 *         description: Score and matched segment
 */
router.post('/score', (req, res) => {
  const userData = req.body;
  const score = Math.floor(Math.random() * 100);
  const segment = score > 50 ? 'Engaged Activists' : 'Civic Observers';
  res.json({ segment, score });
});

export default router;
