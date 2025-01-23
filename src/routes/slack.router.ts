import express from 'express';
import {
    handleSlackInteraction
} from '../controllers/slack.controller';
import { authorize } from '../middlewares/authorize';

const router = express.Router();

router.post('/lead-status', handleSlackInteraction);

export default router;