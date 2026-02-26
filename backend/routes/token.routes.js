import { Router } from "express";
const router =  new Router();
import {token, refreshToken} from "./../controllers/token.controller.js"
import { authenticate } from "./../middlewares/auth.middleware.js";

router.use("/authenticate",authenticate,token)
router.use("/refresh",refreshToken)
export default router;