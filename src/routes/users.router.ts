import { Router } from 'express';
import multer from 'multer';

import { getUsers, getUserById, createUser, deleteUser, updateUser, loginUser, processExcelData } from '../controllers/users.controller';

const router = Router();

router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/register', createUser);
router.post('/login', loginUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

// Set up multer middleware
const upload = multer({ dest: 'uploads/' });
router.post('/bulkupload', upload.single('file'), processExcelData);

export default router;