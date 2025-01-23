import express from 'express';
import { sendMessage, getAllMessages, createWhatsappMsg } from '../controllers/messages.controller';

const router = express.Router();

router.post('/send', sendMessage);
router.post('/create', createWhatsappMsg);
router.get('/', getAllMessages);

export default router;