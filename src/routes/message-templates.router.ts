import express from 'express';
import {
    createMessageTemplate,
    getAllMessageTemplates,
    getMessageTemplateById,
    updateMessageTemplate,
    deleteMessageTemplate
} from '../controllers/message-templates.controller';

const router = express.Router();

// Create a new message template
router.post('/', createMessageTemplate);

// Get all message templates
router.get('/', getAllMessageTemplates);

// Get message template by ID
router.get('/:id', getMessageTemplateById);

// Update a message template
router.put('/:id', updateMessageTemplate);

// Delete a message template
router.delete('/:id', deleteMessageTemplate);

export default router;