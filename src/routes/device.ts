import { auth } from '@auth';
import * as deviceCtrl from '@device';
import { Router } from 'express';

const router: Router = Router();

router.post('/new', auth, deviceCtrl.newDevice);
router.put('/:id', auth, deviceCtrl.updateDevice);
router.get('/:id', auth, deviceCtrl.getDevice);
router.delete('/:id', auth, deviceCtrl.deleteDevice);
router.post('/', auth, deviceCtrl.getDevices);

export default router;
