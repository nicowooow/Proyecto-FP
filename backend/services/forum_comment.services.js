import forumCommentRepository from '../repository/forum_comment.reposiroty.js';

export const getCommentById = async (id) => {
  const rows = await forumCommentRepository.getForumComment(id);
  if (!rows || rows.length === 0) {
    throw new Error("COMMENT_NOT_FOUND");
  }
  return rows[0];
};

export const getCommentsByForumId = async (forumId) => {
  return await forumCommentRepository.getForumCommentsByForum(forumId);
};

export const createComment = async (data) => {
  const { profileId, forumId, content, status } = data;
  const countRows = await forumCommentRepository.postForumComments(forumId, profileId, content, status);
  
  if (countRows === 0) {
    throw new Error("COMMENT_NOT_CREATED");
  }
  return countRows;
};

export const deleteComment = async (id) => {
  const countRows = await forumCommentRepository.deleteForumComment(id);
  if (countRows === 0) {
    throw new Error("COMMENT_NOT_FOUND");
  }
  return countRows;
};

export const updateComment = async (id, data) => {
  const { profileId, forumId, content, status, likes, shares } = data;
  const countRows = await forumCommentRepository.putForumComment(
    forumId,
    profileId,
    content,
    status,
    likes,
    shares,
    id
  );

  if (countRows === 0) {
    throw new Error("COMMENT_NOT_FOUND");
  }
  return countRows;
};

export const patchComment = async (id, data) => {
  const { profileId, forumId, content, status, likes, shares } = data;
  const countRows = await forumCommentRepository.patchForumComment(
    forumId,
    profileId,
    content,
    status,
    likes,
    shares,
    id
  );

  if (countRows === 0) {
    throw new Error("COMMENT_NOT_FOUND");
  }
  return countRows;
};