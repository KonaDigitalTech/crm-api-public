import express from 'express';
import { createCall, create, getCalls, connect, download } from '../controllers/calls.controller';

const router = express.Router();

router.post('/create', createCall);
router.post('/', create);
router.post('/connect', connect);

router.get('/', getCalls);
router.get('/download', download)

export default router;
