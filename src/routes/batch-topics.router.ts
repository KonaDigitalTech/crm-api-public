import { Router } from 'express';
import {
    createBatchTopic,
    getBatchTopics,
    getBatchTopicById,
    updateBatchTopic,
    deleteBatchTopics,
    upsertBatchTopics,
    getBatchTopicsByMonth
} from '../controllers/batch-topics.controller';

const router = Router();

router.post('/upsert', upsertBatchTopics);

// Create a new batch topic
router.post('/', createBatchTopic);

router.get('/monthly', getBatchTopicsByMonth);

// Get all batch topics
router.get('/', getBatchTopics);

// Get a single batch topic by ID
router.get('/:id', getBatchTopicById);

// Update a batch topic by ID
router.put('/:id', updateBatchTopic);

// Delete a batch topic by ID
router.delete('/', deleteBatchTopics);

export default router;