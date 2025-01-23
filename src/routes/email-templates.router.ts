import express from 'express';
import { createEmailTemplate, getAllEmailTemplates, getEmailTemplateById, updateEmailTemplate, deleteEmailTemplate } from '../controllers/email-templates.controller';

const router = express.Router();

// Create a new email template
router.post('/', createEmailTemplate);

// Get all email templates
router.get('/', getAllEmailTemplates);

// Get email template by ID
router.get('/:id', getEmailTemplateById);

// Update an email template
router.put('/:id', updateEmailTemplate);

// Delete an email template
router.delete('/:id', deleteEmailTemplate);

export default router;
