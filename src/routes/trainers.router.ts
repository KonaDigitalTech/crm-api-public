import { Router } from 'express';
import { createTrainer, getTrainerById, getAllTrainers, updateTrainer, deleteTrainers, getAllTrainerStats } from '../controllers/trainers.controller';
import multer from 'multer';

const router = Router();

// Set up multer middleware
const upload = multer({ dest: 'uploads/' });

// Route to create a new trainer
router.post('/', upload.fields([{ name: 'idProof', maxCount: 1 }]), createTrainer);

router.get('/statistics', getAllTrainerStats);

// Route to get a specific trainer by ID
router.get('/:id', getTrainerById);

// Route to get all trainers
router.get('/', getAllTrainers);

// Route to update a trainer by ID
router.put('/:id', updateTrainer);

// Route to delete a trainer by ID
router.delete('/', deleteTrainers);

export default router;