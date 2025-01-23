// Import necessary modules and models
import express from 'express';
import { createNote, fetchAllNotes, updateNote, deleteNoteAndMentions } from '../controllers/notes.controller';

const router = express.Router();

// Define routes
router.post('/', createNote);
router.get('/', fetchAllNotes);
router.put('/:id', updateNote);
router.delete('/:id', deleteNoteAndMentions);

export default router;