import {authenticate,verifyAccount} from "./../middlewares/auth.middleware.js";
import {get_users,get_user,post_user,delete_user,put_user,patch_user} from '../controllers/users.controller.js'
import {hash_password} from '../middlewares/password.middleware.js'
import { Router } from 'express';

const router = new Router();
router.get('/users',get_users);
router.get('/user/:username',authenticate,get_user);
router.post('/user',hash_password,verifyAccount,post_user);
router.delete('/user/:id',authenticate,delete_user); 
router.put('/user/:id',authenticate,hash_password,put_user);
router.patch('/user/:id',authenticate,hash_password,patch_user);

export default router;