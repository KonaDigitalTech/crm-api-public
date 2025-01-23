import { Router } from 'express';
import multer from 'multer';

import { getLeads, getLeadById, getLeadsStatistics, createLead, deleteLead, updateLead, deleteLeads, processExcelData } from '../controllers/leads.controller';
import { authorize } from '../middlewares/authorize';

const router = Router();

router.get('/statistics', authorize, getLeadsStatistics);
router.get('/', authorize, getLeads);
router.get('/:id', authorize, getLeadById);
router.post('/', createLead);
router.put('/:id', authorize, updateLead);
router.delete('/:id', authorize, deleteLead);
router.delete('/', authorize, deleteLeads);

const upload = multer({ dest: 'uploads/' });
router.post('/bulkupload', upload.single('file'), processExcelData);

export default router;