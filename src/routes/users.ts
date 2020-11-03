import express from 'express';
import userCtrl from '@controllers/users';
import { auth } from '@middlewares/auth';

const router = express.Router();

router.post('/signup', userCtrl.signUpUser);
router.post('/login', userCtrl.loginUser);
router.post('/email', userCtrl.resendVerifyEmail);
router.get('/email/:verifyToken', userCtrl.verifyEmail);
router.post('/password', userCtrl.resetPassword);
router.post('/password/:verifyToken', userCtrl.verifyPassword);

router.get('/profile', auth, userCtrl.getUser);
router.put('/profile', auth, userCtrl.updateUser);
router.delete('/profile', auth, userCtrl.deleteUser);

export default router;
