// librerias que necesito
import { Router } from 'express';

//middlewares que se usan
import {prepare_sign_up} from '../middlewares/password.middleware.js'


//controladores que necesito
import {sign_in_user} from '../controllers/sign.controller.js';
import {sign_up_user} from '../controllers/sign.controller.js';

const router = new Router();
router.post('/sign-in/',sign_in_user);
router.post('/sign-up/',prepare_sign_up,sign_up_user);

export default router;
