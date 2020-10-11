import express from 'express';
import userCtrl from '../controllers/users';

const router = express.Router();

router.post('/signup', userCtrl.signUpUser);
router.get('/verify-email/:verifyToken', userCtrl.verifyEmail);

export default router;
