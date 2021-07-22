import { authIoT } from '@auth';
import * as iotDeviceCtrl from '@iotDevices';
import { Router } from 'express';

const router: Router = Router();

router.post('/arduino', authIoT, iotDeviceCtrl.newMessage);

export default router;
