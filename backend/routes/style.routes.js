import { Router } from "express";
import {
  get_styles,
  get_style,
  post_style,
  delete_style,
  put_style,
  patch_style,
} from "../controllers/style.controller.js";

const router = new Router();
router.get("/styles/", get_styles);
router.get("/style/:id", get_style);
router.post("/style", post_style);
router.delete("/style/:id", delete_style);
router.put("/style/:id", put_style);
router.patch("/style/:id", patch_style);



export default router;
