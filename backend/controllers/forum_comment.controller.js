import ForumComment from '../models/forum_comment.model.js';
import forumCommentRepository from '../repository/forum_comment.reposiroty.js';

export const get_forum_comment = async (req, res) => {
  try {
    const { id } = req.params;

    const rows = await forumCommentRepository.getForumComment(id);
    if (rows && rows.length > 0) {
      return res.status(200).json(rows[0]);
    }
    return res.status(404).json({ error: 'Forum comment not found' });
  } catch (error) {
    console.log(error);
  }
};

export const post_forum_comment = async (req, res) => {
  try {
    const { profileId, forumId, content, status } = req.body;
    if (status) {
    }
    const countRows = await forumCommentRepository.postForumComments(forumId, profileId, content, status);
    if (countRows > 0) {
      return res.status(201).json({ message: 'Forum comment created successfully' });
    }
    return res.status(400).json({ error: 'Failed to create forum comment' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const delete_forum_comment = async (req, res) => {
  try {
    const { id } = req.params;
    const countRows = await forumCommentRepository.deleteForumComment(id);
    if (countRows > 0) {
      return res.status(200).json({ message: 'Forum comment deleted successfully' });
    }
    return res.status(404).json({ error: 'Forum comment not found' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const put_forum_comment = async (req, res) => {
  try {
    const { id } = req.params;
    const { profileId, forumId, content, status, likes, shares } = req.body;
    const countRows = await forumCommentRepository.putForumComment(
      forumId,
      profileId,
      content,
      status,
      likes,
      shares,
      id,
    );
    if (countRows > 0) {
      return res.status(200).json({ message: 'Forum comment updated successfully' });
    }
    return res.status(404).json({ error: 'Forum comment not found' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const patch_forum_comment = async (req, res) => {
  try {
    const { id } = req.params;
    const { profileId, forumId, content, status, likes, shares } = req.body;
    const countRows = await forumCommentRepository.patchForumComment(
      forumId,
      profileId,
      content,
      status,
      likes,
      shares,
      id,
    );
    if (countRows > 0) {
      return res.status(200).json({ message: 'Forum comment patched successfully' });
    }
    return res.status(404).json({ error: 'Forum comment not found' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
