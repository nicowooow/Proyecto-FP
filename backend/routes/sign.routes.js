// librerias que necesito
import { Router } from 'express';

//middlewares que se usan
import {prepare_sign_up} from '../middlewares/password.middleware.js'
import {verifyAccount, authenticate} from './../middlewares/auth.middleware.js'

//controladores que necesito
import {sign_in_user, sign_up_user,log_out_user} from '../controllers/sign.controller.js';

const router = new Router();
router.post('/sign-in/',sign_in_user);
router.post('/sign-up/',prepare_sign_up,verifyAccount,sign_up_user);
router.get('/logout/',authenticate,log_out_user);

export default router;
