import { auth } from '@auth';
import * as userCtrl from '@user';
import { Router } from 'express';

const router: Router = Router();

router.post('/signup', userCtrl.signUpUser);
router.post('/login', userCtrl.loginUser);
router.post('/email', userCtrl.resendEmailVerification);
router.get('/email/:verifyToken', userCtrl.verifyEmail);
router.post('/password', userCtrl.resetPassword);
router.post('/password/:verifyToken', userCtrl.updatePassword);

router.get('/profile', auth, userCtrl.getUser);
router.put('/profile', auth, userCtrl.updateUser);
router.delete('/profile', auth, userCtrl.deleteUser);

export default router;
