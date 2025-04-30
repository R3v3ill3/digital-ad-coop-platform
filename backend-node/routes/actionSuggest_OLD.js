import express from 'express';

const router = express.Router();

router.post('/', async (req, res) => {
  const { campaignType } = req.body;

  const suggestions = {
    "Organisational Growth": ["SMS outreach", "Email welcome series", "Petition signup", "Community event"],
    "Persuasion Campaign": ["Digital advertising", "Phonebank", "Letterboxing", "Messenger scripts"],
    "Electoral Campaign": ["Voter registration", "Door knocking", "Debate night SMS blast"],
    "Corporate Targeting": ["Shareholder petition", "Digital disruption", "Media leak strategy"]
  };

  res.status(200).json({ actions: suggestions[campaignType] || [] });
});

export default router;
