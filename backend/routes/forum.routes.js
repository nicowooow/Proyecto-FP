import { Router } from "express";
import {
  get_forums,
  get_forum,
  delete_forum,
  patch_forum,
  post_forum,
  put_forum,
} from "../controllers/forum.controller.js";

import {
  delete_forum_comment,
  get_forum_comment,
  patch_forum_comment,
  post_forum_comment,
  put_forum_comment,
} from "../controllers/forum_comment.controller.js";
const router = new Router();

// rutas que no estaran protegidas por el token
router.get("/forums/", get_forums);
router.get("/forums/:id", get_forum);
router.get("/forum/comments/:id", get_forum_comment);

// rutas que estaran protegidas por el token

router.post("/forum/", post_forum);
router.delete("/forum/:id", delete_forum);
router.put("/forum/:id", put_forum);
router.patch("/forum/:id", patch_forum);

router.post("/forum/comment/", post_forum_comment);
router.put("/forum/comment/:id", put_forum_comment);
router.delete("/forum/comment/:id", delete_forum_comment);
router.patch("/forum/comment/:id", patch_forum_comment);
export default router;
