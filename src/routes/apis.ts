import apiCtrlV1 from '@api/v1/apis';
import { auth } from '@middlewares/auth';
import express from 'express';

const router = express.Router();

router.post('/new-api', auth, apiCtrlV1.newApiKey);
router.get('/api/:id', auth, apiCtrlV1.getApiKey);

export default router;
