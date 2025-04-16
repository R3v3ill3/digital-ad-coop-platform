import express from 'express';
import segmentsRouter from './segments.js';
import statusRouter from './status.js';

const router = express.Router();

router.use('/segments', segmentsRouter);
router.use('/', statusRouter);

export default router;
