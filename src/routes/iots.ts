import iotCtrlV1 from '@api/v1/iots';
import { auth } from '@middlewares/auth';
import { Router } from 'express';

const router: Router = Router();

router.post('/new', auth, iotCtrlV1.newIoT);
router.put('/:id', auth, iotCtrlV1.updateIoT);
router.get('/:id', auth, iotCtrlV1.getIoT);
router.delete('/:id', auth, iotCtrlV1.deleteIoT);
router.get('/', auth, iotCtrlV1.getIoTs);

export default router;
