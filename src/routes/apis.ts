import apiCtrlV1 from '@api/v1/apis';
import { auth } from '@middlewares/auth';
import { Router } from 'express';

const router: Router = Router();

router.post('/new', auth, apiCtrlV1.newApi);
router.put('/:id', auth, apiCtrlV1.updateApi);
router.get('/:id', auth, apiCtrlV1.getApi);
router.delete('/:id', auth, apiCtrlV1.deleteApi);
router.get('/', auth, apiCtrlV1.getApis);

export default router;
