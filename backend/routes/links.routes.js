import { Router } from "express";
import {
  get_link,
  get_links,
  post_link,
  delete_link,
  put_link,
  patch_link,
} from "./../controllers/links.controller.js";
import {
  get_links_stats,
  get_link_stats,
  post_link_stats,
  delete_link_stats,
  put_link_stats,
  patch_link_stats,
} from "../controllers/link_stats.controller.js";

const router = new Router();
router.get("/links/:profileId",get_links);
router.get("/link/:id",get_link);
router.post("/link/",post_link);
router.delete("/link/:id",delete_link);
router.put("/link/:id",put_link);
router.patch("/link/:id",patch_link);

router.get("/links/stats/:profileId", get_links_stats);
router.get("/link/stats/:id", get_link_stats);
router.post("/link/stats/", post_link_stats);
router.delete("/link/stats/:id", delete_link_stats);
router.put("/link/stats/:id", put_link_stats);
router.patch("/link/stats/:id", patch_link_stats);

export default router;
