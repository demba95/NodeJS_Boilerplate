import * as apiCtrl from '@api';
import { auth } from '@auth';
import { Router } from 'express';

const router: Router = Router();

router.post('/new', auth, apiCtrl.newApi);
router.put('/:id', auth, apiCtrl.updateApi);
router.get('/:id', auth, apiCtrl.getApi);
router.delete('/:id', auth, apiCtrl.deleteApi);
router.post('/', auth, apiCtrl.getApis);

export default router;
