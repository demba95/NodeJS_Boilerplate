import { Router } from 'express';
import apiRoutes from './api';
import deviceRoutes from './device';
import iotDeviceRoutes from './iot-device';
import userRoutes from './user';

const router: Router = Router();

router.use('/api', apiRoutes);
router.use('/device', deviceRoutes);
router.use('/iot-device', iotDeviceRoutes);
router.use('/user', userRoutes);

export default router;
