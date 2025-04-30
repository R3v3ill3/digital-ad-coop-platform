// backend-node/routes/classify-campaign-type.js

import express from 'express';
import XLSX from 'xlsx';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Load spreadsheet once
const spreadsheetPath = path.join(
  process.cwd(),
  'data',
  'Campaign_Type_Mapping__Long_Format_.xlsx'
);

let campaignTypes = [];

if (fs.existsSync(spreadsheetPath)) {
  const workbook = XLSX.readFile(spreadsheetPath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  campaignTypes = XLSX.utils.sheet_to_json(sheet);
} else {
  console.error('[⚠️] Could not load Campaign Type Mapping spreadsheet');
}

function classifyCampaign(summary) {
  const goal = summary.goal?.toLowerCase() || '';
  const audience = summary.audience?.toLowerCase() || '';
  const focus = summary.focus?.toLowerCase() || '';

  const matches = campaignTypes.filter((row) => {
    const keywords = `${row.Goal} ${row.Audience} ${row.Focus}`.toLowerCase();
    return (
      goal && keywords.includes(goal) ||
      audience && keywords.includes(audience) ||
      focus && keywords.includes(focus)
    );
  });

  const best = matches[0] || null;

  return best ? {
    type: best['Campaign Type'],
    description: best['Type Description'],
    suggested_actions: best['Suggested Actions'] || '',
    confidence: matches.length > 0 ? 1.0 : 0.0
  } : null;
}

router.post('/', (req, res) => {
  const { summary } = req.body;
  if (!summary || typeof summary !== 'object') {
    return res.status(400).json({ error: 'Missing or invalid summary object' });
  }

  const result = classifyCampaign(summary);

  if (!result) {
    return res.status(200).json({
      match: null,
      confidence: 0.0,
      message: 'Could not classify campaign type. Please review and clarify.'
    });
  }

  return res.status(200).json({
    match: result,
    message: 'Campaign type classification successful.'
  });
});

export default router;
