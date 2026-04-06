// librerias que necesito
import { Router } from 'express';

//middlewares que se usan
import { prepare_sign_up, hash_password } from '../middlewares/password.middleware.js'


//controladores que necesito
import { sign_in_user, sign_up_user, verifyAccount, resendCode, forgot_password, reset_password } from '../controllers/sign.controller.js';

const router = new Router();
router.post('/sign-in/', sign_in_user);
router.post('/sign-up/', prepare_sign_up, sign_up_user);
router.post('/verify-code', verifyAccount);
router.post('/resend-code', resendCode);
router.post('/forgot-password', forgot_password);
router.post('/reset-password', hash_password, reset_password);

export default router;
