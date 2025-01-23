import express from 'express';
import {
    createBatch,
    getBatchById,
    getBatchesByLead,
    updateBatch,
    deleteBatches
} from '../controllers/batches.controller';
import { authorize } from '../middlewares/authorize';

const router = express.Router();

// Route to create a new batch
router.post('/', authorize, createBatch);

// Route to get a batch by its ID
router.get('/:id', authorize, getBatchById);

// Route to get batches by optional leadId query parameter
router.get('/', authorize, getBatchesByLead);

// Route to update a batch by its ID
router.put('/:id', authorize, updateBatch);

// Route to delete a batch by its ID
router.delete('/', authorize, deleteBatches);

export default router;