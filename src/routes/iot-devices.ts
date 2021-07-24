import { authDevice } from '@auth';
import * as iotDeviceCtrl from '@iotDevices';
import { Router } from 'express';

const router: Router = Router();

router.post('/arduino', authDevice, iotDeviceCtrl.notify);

export default router;
