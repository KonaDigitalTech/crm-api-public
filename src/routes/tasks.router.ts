import express from 'express';
import {
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask,
    getTasksByLeadId,
    getTasksByUserId,
} from '../controllers/tasks.controller';
import { authorize } from '../middlewares/authorize';

const router = express.Router();

router.post('/', authorize, createTask);
router.get('/', authorize, getAllTasks);
router.get('/:id', authorize, getTaskById);
router.put('/:id', authorize, updateTask);
router.delete('/:id', authorize, deleteTask);
router.get('/lead/:leadId', authorize, getTasksByLeadId);
router.get('/user/:userId', authorize, getTasksByUserId);

export default router;