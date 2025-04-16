import express from 'express';
import segmentsRouter from './segments.js';
import statusRouter from './status.js';
import onboarding from './onboarding.js';
import suggest from './suggest.js';

const router = express.Router();

router.use('/segments', segmentsRouter);
router.use('/', statusRouter);
router.use('/onboarding', onboarding);
router.use('/suggest-plan', suggest);

export default router;
