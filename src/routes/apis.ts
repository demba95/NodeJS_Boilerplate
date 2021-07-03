import apiCtrlV1 from '@api/v1/apis';
import { auth } from '@middlewares/auth';
import express from 'express';

const router = express.Router();

router.post('/new', auth, apiCtrlV1.newApi);
router.post('/apis', auth, apiCtrlV1.getApis);
router.put('/:id', auth, apiCtrlV1.updateApi);
router.get('/:id', auth, apiCtrlV1.getApi);
router.delete('/:id', auth, apiCtrlV1.deleteApi);

export default router;
