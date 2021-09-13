import { Router } from 'express';
import apiRoutes from './api/api';
import deviceRoutes from './api/device';
import iotDeviceRoutes from './api/iot-device';
import userRoutes from './api/user';

const router: Router = Router();

router.use('/api', apiRoutes);
router.use('/device', deviceRoutes);
router.use('/iot-device', iotDeviceRoutes);
router.use('/user', userRoutes);

export default router;
