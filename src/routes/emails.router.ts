// emailRoutes.ts

import express from 'express';
import { getAllEmails, getEmailsByLeadId, sendEmail } from '../controllers/emails.controller'; // Import controller functions

const router = express.Router();

router.get('/', getAllEmails);
router.get('/lead/:leadId', getEmailsByLeadId);
router.post('/send', sendEmail);

export default router;