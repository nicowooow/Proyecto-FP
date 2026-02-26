import linkStatsRepository from "./../repository/link_stats.repository.js";

export const get_links_stats = async (req, res) => {
  try {
    let { profileId } = req.params;
    let rows = await linkStatsRepository.getLinksStats(profileId);
    if (rows.length > 0) {
      res.status(200).json(rows);
    } else {
      res.status(404).json({ message: "No link stats found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Server error : " + error });
  }
};

export const get_link_stats = async (req, res) => {
  try {
    let { id } = req.params;
    let rows = await linkStatsRepository.getLinkStats(id);
    if (rows.length > 0) {
      res.status(200).json(rows);
    } else {
      res.status(404).json({ message: "No link stats found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Server error : " + error });
  }
};

export const post_link_stats = async (req, res) => {
  try {
    let { LinkId, profileId, referrer } =
      req.body;
    let viewedAt = new Date();
    let userAgent = req.get("User-Agent");
    let ipAddress = req.headers["x-forwarded-for"] || req.connection.remoteAddress || "Unknown";

    console.log(ipAddress);
    
    return "";

    let rowCount = await linkStatsRepository.postLinkStats(
      LinkId,
      profileId,
      viewedAt,
      userAgent,
      ipAddress,
      referrer
    );
    if (rowCount > 0) {
      res.status(201).json({ message: "Link stats created successfully" });
    } else {
      res.status(400).json({ message: "Failed to create link stats" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Server error : " + error });
  }
};

export const delete_link_stats = async (req, res) => {
  try {
    let { id } = req.params;
    let rowCount = await linkStatsRepository.deleteLinkStats(id);
    if (rowCount > 0) {
      res.status(200).json({ message: "Link stats deleted successfully" });
    } else {
      res.status(404).json({ message: "Link stats not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Server error : " + error });
  }
};

export const put_link_stats = async (req, res) => {
  try {
    let { id } = req.params;
    let { LinkId, profileId, viewedAt, userAgent, ipAddress, referrer } =
      req.body;
    let rowCount = await linkStatsRepository.putLinkStats(
      id,
      LinkId,
      profileId,
      viewedAt,
      userAgent,
      ipAddress,
      referrer
    );
    if (rowCount > 0) {
      res.status(200).json({ message: "Link stats updated successfully" });
    } else {
      res.status(404).json({ message: "Link stats not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Server error : " + error });
  }
};

export const patch_link_stats = async (req, res) => {
  try {
    let { id } = req.params;
    let { LinkId, profileId, viewedAt, userAgent, ipAddress, referrer } =
      req.body;
    let rowCount = await linkStatsRepository.patchLinkStats(
      id,
      LinkId,
      profileId,
      viewedAt,
      userAgent,
      ipAddress,
      referrer
    );
    if (rowCount > 0) {
      res
        .status(200)
        .json({ message: "Link stats partially updated successfully" });
    } else {
      res.status(404).json({ message: "Link stats not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Server error : " + error });
  }
};
