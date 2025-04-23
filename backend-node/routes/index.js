import express from 'express';
import segmentsRouter from './segments.js';
import statusRouter from './status.js';
import onboarding from './onboarding.js';
import suggest from './suggest.js';
import messageGuide from './messageGuide.js';
import campaignRoutes from './campaigns.js';
import actionSuggest from './actionSuggest.js';
import campaignAssistant from './campaign-assistant.js';

const router = express.Router();

router.use('/segments', segmentsRouter);
router.use('/', statusRouter);
router.use('/onboarding', onboarding);
router.use('/suggest-plan', suggest);
router.use('/message-guide', messageGuide);
router.use('/campaigns', campaignRoutes);
router.use('/suggest-actions', actionSuggest);
router.use('/campaign-assistant', campaignAssistant);

export default router;
