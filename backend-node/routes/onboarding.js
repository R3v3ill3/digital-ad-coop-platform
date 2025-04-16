import express from 'express';
import fs from 'fs';
const router = express.Router();

/**
 * @openapi
 * /onboarding:
 *   post:
 *     summary: Save onboarding form data
 *     tags:
 *       - Onboarding
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Data successfully received and logged.
 */
router.post('/onboarding', async (req, res) => {
  try {
    const formData = req.body;
    console.log("✅ Received onboarding data:", formData);

    // Simulate saving to local file
    fs.writeFileSync('onboarding-dump.json', JSON.stringify(formData, null, 2));
    
    res.status(200).json({ message: "Onboarding data received" });
  } catch (err) {
    console.error("❌ Failed to process onboarding:", err);
    res.status(500).json({ error: "Failed to process onboarding data" });
  }
});

export default router;
