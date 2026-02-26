import { Router } from 'express';
import { get_profiles , get_profile , post_profile , delete_profile , put_profile , patch_profile } from '../controllers/profiles.controller.js'

const router = new Router();
router.get('/profiles',get_profiles);
router.get('/profile/:username',get_profile);
router.post('/profiles',post_profile);
router.delete('/profiles',delete_profile);
router.put('/profiles',put_profile);
router.patch('/profiles',patch_profile);


export default router;
