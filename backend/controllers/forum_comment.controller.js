import * as forumCommentService from "../services/forum_comment.services.js";

export const get_forum_comment = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await forumCommentService.getCommentById(id);
    return res.status(200).json(comment);
  } catch (error) {
    if (error.message === "COMMENT_NOT_FOUND") {
      return res.status(404).json({ error: 'Forum comment not found' });
    }
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const get_forum_comments_by_forum_id = async (req, res) => {
  try {
    const { id } = req.params;
    const rows = await forumCommentService.getCommentsByForumId(id);
    return res.status(200).json(rows);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const post_forum_comment = async (req, res) => {
  try {
    await forumCommentService.createComment(req.body);
    return res.status(201).json({ message: 'Forum comment created successfully' });
  } catch (error) {
    if (error.message === "COMMENT_NOT_CREATED") {
      return res.status(400).json({ error: 'Failed to create forum comment' });
    }
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const delete_forum_comment = async (req, res) => {
  try {
    const { id } = req.params;
    await forumCommentService.deleteComment(id);
    return res.status(200).json({ message: 'Forum comment deleted successfully' });
  } catch (error) {
    if (error.message === "COMMENT_NOT_FOUND") {
      return res.status(404).json({ error: 'Forum comment not found' });
    }
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const put_forum_comment = async (req, res) => {
  try {
    const { id } = req.params;
    await forumCommentService.updateComment(id, req.body);
    return res.status(200).json({ message: 'Forum comment updated successfully' });
  } catch (error) {
    if (error.message === "COMMENT_NOT_FOUND") {
      return res.status(404).json({ error: 'Forum comment not found' });
    }
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const patch_forum_comment = async (req, res) => {
  try {
    const { id } = req.params;
    await forumCommentService.patchComment(id, req.body);
    return res.status(200).json({ message: 'Forum comment patched successfully' });
  } catch (error) {
    if (error.message === "COMMENT_NOT_FOUND") {
      return res.status(404).json({ error: 'Forum comment not found' });
    }
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};