import express from 'express';
import segmentsRouter from './segments.js';

const router = express.Router();

router.use('/segments', segmentsRouter);

export default router;
