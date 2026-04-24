import linkStatsRepository from "./../repository/link_stats.repository.js";

export const getLinksStats = async (profileId) => {
  const rows = await linkStatsRepository.getLinksStats(profileId);
  if (rows.length === 0) throw new Error("STATS_NOT_FOUND");
  return rows;
};

export const getLinkStatsById = async (id) => {
  const rows = await linkStatsRepository.getLinkStats(id);
  if (rows.length === 0) throw new Error("STATS_NOT_FOUND");
  return rows;
};

export const createLinkStats = async (body, userAgent, ipAddress) => {
  const { LinkId, profileId, referrer } = body;
  const viewedAt = new Date();

  const rowCount = await linkStatsRepository.postLinkStats(
    LinkId,
    profileId,
    viewedAt,
    userAgent,
    ipAddress,
    referrer
  );

  if (rowCount === 0) throw new Error("STATS_NOT_CREATED");
  return rowCount;
};

export const deleteLinkStats = async (id) => {
  const rowCount = await linkStatsRepository.deleteLinkStats(id);
  if (rowCount === 0) throw new Error("STATS_NOT_FOUND");
  return rowCount;
};

export const updateLinkStats = async (id, body) => {
  const { LinkId, profileId, viewedAt, userAgent, ipAddress, referrer } = body;
  const rowCount = await linkStatsRepository.putLinkStats(
    id,
    LinkId,
    profileId,
    viewedAt,
    userAgent,
    ipAddress,
    referrer
  );

  if (rowCount === 0) throw new Error("STATS_NOT_FOUND");
  return rowCount;
};

export const patchLinkStats = async (id, body) => {
  const { LinkId, profileId, viewedAt, userAgent, ipAddress, referrer } = body;
  const rowCount = await linkStatsRepository.patchLinkStats(
    id,
    LinkId,
    profileId,
    viewedAt,
    userAgent,
    ipAddress,
    referrer
  );

  if (rowCount === 0) throw new Error("STATS_NOT_FOUND");
  return rowCount;
};