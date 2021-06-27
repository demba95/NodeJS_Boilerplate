import userCtrlV1 from '@controllers/api/v1/users';
import { auth } from '@middlewares/auth';
import express from 'express';

const router = express.Router();

router.post('/signup', userCtrlV1.signUpUser);
router.post('/login', userCtrlV1.loginUser);
router.post('/email', userCtrlV1.resendVerifyEmail);
router.get('/email/:verifyToken', userCtrlV1.verifyEmail);
router.post('/password', userCtrlV1.resetPassword);
router.post('/password/:verifyToken', userCtrlV1.updatePassword);

router.get('/profile', auth, userCtrlV1.getUser);
router.put('/profile', auth, userCtrlV1.updateUser);
router.delete('/profile', auth, userCtrlV1.deleteUser);

export default router;
