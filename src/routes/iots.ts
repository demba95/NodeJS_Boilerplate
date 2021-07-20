import { auth } from '@auth';
import * as iotCtrl from '@iots';
import { Router } from 'express';

const router: Router = Router();

router.post('/new', auth, iotCtrl.newIoT);
router.put('/:id', auth, iotCtrl.updateIoT);
router.get('/:id', auth, iotCtrl.getIoT);
router.delete('/:id', auth, iotCtrl.deleteIoT);
router.post('/', auth, iotCtrl.getIoTs);

export default router;
