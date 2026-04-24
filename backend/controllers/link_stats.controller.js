import * as linkStatsService from "../services/link_stats.services.js";

export const get_links_stats = async (req, res) => {
  try {
    const { profileId } = req.params;
    const rows = await linkStatsService.getLinksStats(profileId);
    return res.status(200).json(rows);
  } catch (error) {
    if (error.message === "STATS_NOT_FOUND") {
      return res.status(404).json({ message: "No link stats found" });
    }
    return res.status(500).json({ message: "Server error : " + error.message });
  }
};

export const get_link_stats = async (req, res) => {
  try {
    const { id } = req.params;
    const rows = await linkStatsService.getLinkStatsById(id);
    return res.status(200).json(rows);
  } catch (error) {
    if (error.message === "STATS_NOT_FOUND") {
      return res.status(404).json({ message: "No link stats found" });
    }
    return res.status(500).json({ message: "Server error : " + error.message });
  }
};

export const post_link_stats = async (req, res) => {
  try {
    const userAgent = req.get("User-Agent");
    const ipAddress = req.headers["x-forwarded-for"] || req.connection.remoteAddress || "Unknown";

    await linkStatsService.createLinkStats(req.body, userAgent, ipAddress);
    
    return res.status(201).json({ message: "Link stats created successfully" });
  } catch (error) {
    if (error.message === "STATS_NOT_CREATED") {
      return res.status(400).json({ message: "Failed to create link stats" });
    }
    return res.status(500).json({ message: "Server error : " + error.message });
  }
};

export const delete_link_stats = async (req, res) => {
  try {
    const { id } = req.params;
    await linkStatsService.deleteLinkStats(id);
    return res.status(200).json({ message: "Link stats deleted successfully" });
  } catch (error) {
    if (error.message === "STATS_NOT_FOUND") {
      return res.status(404).json({ message: "Link stats not found" });
    }
    return res.status(500).json({ message: "Server error : " + error.message });
  }
};

export const put_link_stats = async (req, res) => {
  try {
    const { id } = req.params;
    await linkStatsService.updateLinkStats(id, req.body);
    return res.status(200).json({ message: "Link stats updated successfully" });
  } catch (error) {
    if (error.message === "STATS_NOT_FOUND") {
      return res.status(404).json({ message: "Link stats not found" });
    }
    return res.status(500).json({ message: "Server error : " + error.message });
  }
};

export const patch_link_stats = async (req, res) => {
  try {
    const { id } = req.params;
    await linkStatsService.patchLinkStats(id, req.body);
    return res.status(200).json({ message: "Link stats partially updated successfully" });
  } catch (error) {
    if (error.message === "STATS_NOT_FOUND") {
      return res.status(404).json({ message: "Link stats not found" });
    }
    return res.status(500).json({ message: "Server error : " + error.message });
  }
};