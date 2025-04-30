import express from 'express';
import segmentsRouter from './segments.js';
import statusRouter from './status.js';
import onboarding from './onboarding.js';
import suggest from './suggest.js';
import campaignRoutes from './campaigns.js';
import campaignAssistant from './campaign-assistant.js';
import classifyCampaign from './classify-campaign-type.js';
import campaignPlanRouter from './campaign-plan.js';
import messagingGuideRouter from './messaging-guide.js';

const router = express.Router();

router.use('/segments', segmentsRouter);
router.use('/', statusRouter);
router.use('/onboarding', onboarding);
router.use('/suggest-plan', suggest);
router.use('/campaigns', campaignRoutes);
router.use('/campaign-assistant', campaignAssistant);
router.use('/classify-campaign-type', classifyCampaign);
router.use('/campaign-plan', campaignPlanRouter);
router.use('/messaging-guide', messagingGuideRouter);

export default router;
