import ForumRepository from '../repository/forum.repository.js';
import pool from '../db/connection_db.model.js';

export const getForums = async (limit, offset) => {
  return await ForumRepository.getForums(limit, offset);
};

export const getForumById = async (id) => {
  const forum = await ForumRepository.getForum(id);
  if (!forum) throw new Error("FORUM_NOT_FOUND");
  return forum;
};

export const createForum = async (data) => {
  const { profileId, title, description, isSensitive, isPublic, status } = data;
  const result = await ForumRepository.postForum(profileId, title, description, isSensitive, isPublic, status);
  if (result === 0) throw new Error("FORUM_NOT_CREATED");
  return result;
};

export const deleteForum = async (id, requestUserId) => {
  const forum = await ForumRepository.getForum(id);
  if (!forum) throw new Error("FORUM_NOT_FOUND");

  const profileResult = await pool.query(
    'select user_id from profiles where id = $1 limit 1',
    [forum.profile_id]
  );

  if (!profileResult.rows.length) throw new Error("CREATOR_NOT_FOUND");

  const creatorUserId = profileResult.rows[0].user_id;
  if (Number(creatorUserId) !== Number(requestUserId)) throw new Error("FORBIDDEN");

  const result = await ForumRepository.deleteForum(id);
  if (result !== 1) throw new Error("DELETE_FAILED");
  return result;
};

export const updateForum = async (id, data) => {
  const { profileId, title, description, isSensitive, isPublic, status } = data;
  const result = await ForumRepository.putForum(id, profileId, title, description, isSensitive, isPublic, status);
  if (result !== 1) throw new Error("UPDATE_FAILED");
  return result;
};

export const patchForum = async (id, data) => {
  const { profileId, title, description, isSensitive, isPublic, status, likes, shares } = data;
  const result = await ForumRepository.patchForum(id, profileId, title, description, isSensitive, isPublic, status, likes, shares);
  if (result !== 1) throw new Error("UPDATE_FAILED");
  return result;
};

export const searchForums = async (searchQuery, limit) => {
  if (!searchQuery) return [];
  return await ForumRepository.searchForums(searchQuery, limit);
};