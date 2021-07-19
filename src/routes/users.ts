import { auth } from '@auth';
import userCtr from '@users';
import { Router } from 'express';

const router: Router = Router();

router.post('/signup', userCtr.signUpUser);
router.post('/login', userCtr.loginUser);
router.post('/email', userCtr.resendVerifyEmail);
router.get('/email/:verifyToken', userCtr.verifyEmail);
router.post('/password', userCtr.resetPassword);
router.post('/password/:verifyToken', userCtr.updatePassword);

router.get('/profile', auth, userCtr.getUser);
router.put('/profile', auth, userCtr.updateUser);
router.delete('/profile', auth, userCtr.deleteUser);

export default router;
