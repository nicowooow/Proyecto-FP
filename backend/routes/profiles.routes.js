import { Router } from 'express';
import { get_profiles, get_recent_profiles, get_profile, get_private_profile, post_profile, delete_profile, put_profile, patch_profile } from '../controllers/profiles.controller.js'
import { uploadProfileImage } from '../utils/multer.utils.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = new Router();
router.get('/profiles', get_profiles);
router.get('/profiles/recent', get_recent_profiles);
router.get('/profile/:username', get_profile);
router.get('/profile/private/:username', authenticate, get_private_profile);
router.post('/profiles', post_profile);
router.delete('/profiles', delete_profile);
router.put('/profiles', put_profile);
router.patch('/profile/:username', authenticate, uploadProfileImage.single('profile_photo'), patch_profile);

export default router;
