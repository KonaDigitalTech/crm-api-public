import express from 'express';
import {
    createAttendance,
    getAllAttendance,
    getAttendanceByUserId,
    getAttendanceById,
    updateAttendance,
    deleteAttendance,
    deleteAttendances
} from '../controllers/attendances.controller';
import { authorize } from '../middlewares/authorize';

const router = express.Router();

router.post('/', authorize, createAttendance);
router.get('/', authorize, getAllAttendance);
router.get('/:id', authorize, getAttendanceById);
router.get('/user/:userId', authorize, getAttendanceByUserId);
router.put('/:id', authorize, updateAttendance);
router.delete('/:id', authorize, deleteAttendance);
router.delete('/', authorize, deleteAttendances);

export default router;
