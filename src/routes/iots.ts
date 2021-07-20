import { auth } from '@auth';
import iotCtrl from '@iots';
import { Router } from 'express';

const router: Router = Router();

router.post('/new', auth, iotCtrl.newIoT);
router.put('/:id', auth, iotCtrl.updateIoT);
router.get('/:id', auth, iotCtrl.getIoT);
router.delete('/:id', auth, iotCtrl.deleteIoT);
router.get('/', auth, iotCtrl.getIoTs);

export default router;
