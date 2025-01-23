import express from 'express';
import { askAI } from '../controllers/ask-ai.controller';

const router = express.Router();

router.post('/', askAI);

export default router;
