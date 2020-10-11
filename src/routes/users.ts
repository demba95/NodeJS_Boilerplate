import express from 'express';
import userCtrl from '../controllers/users';

const router = express.Router();

router.post('/signup', userCtrl.signUpUser);
router.post('/login', userCtrl.loginUser);
router.get('/verify-email/:verifyToken', userCtrl.verifyEmail);

export default router;
