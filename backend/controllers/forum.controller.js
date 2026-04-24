import * as forumService from "../services/forum.services.js";

export const get_forums = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    const forums = await forumService.getForums(limit, offset);
    return res.status(200).json(forums);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const get_forum = async (req, res) => {
  try {
    const { id } = req.params;
    const forum = await forumService.getForumById(id);
    return res.status(200).json(forum);
  } catch (error) {
    if (error.message === "FORUM_NOT_FOUND") {
      return res.status(404).json({ error: 'Forum not found' });
    }
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const post_forum = async (req, res) => {
  try {
    await forumService.createForum(req.body);
    return res.status(201).json({ message: 'Forum created successfully' });
  } catch (error) {
    if (error.message === "FORUM_NOT_CREATED") {
      return res.status(400).json({ error: 'Failed to create forum' });
    }
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const delete_forum = async (req, res) => {
  try {
    const { id } = req.params;
    const requestUserId = req.user?.id;

    await forumService.deleteForum(id, requestUserId);
    return res.status(200).json({ message: 'Forum deleted successfully' });
  } catch (error) {
    if (error.message === "FORUM_NOT_FOUND") {
      return res.status(404).json({ error: 'Forum not found' });
    }
    if (error.message === "CREATOR_NOT_FOUND") {
      return res.status(404).json({ error: 'Creator profile not found' });
    }
    if (error.message === "FORBIDDEN") {
      return res.status(403).json({ error: 'Only the creator can delete this forum' });
    }
    if (error.message === "DELETE_FAILED") {
      return res.status(400).json({ error: 'Failed to delete the forum' });
    }
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const put_forum = async (req, res) => {
  try {
    const { id } = req.params;
    await forumService.updateForum(id, req.body);
    return res.status(201).json({ message: 'Forum updated successfully' });
  } catch (error) {
    if (error.message === "UPDATE_FAILED") {
      return res.status(400).json({ error: 'Failed to update the forum' });
    }
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const patch_forum = async (req, res) => {
  try {
    const { id } = req.params;
    await forumService.patchForum(id, req.body);
    return res.status(201).json({ message: 'Forum updated successfully' });
  } catch (error) {
    if (error.message === "UPDATE_FAILED") {
      return res.status(400).json({ error: 'Failed to update the forum' });
    }
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const search_forums = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const searchQuery = req.query.q || '';
    const forums = await forumService.searchForums(searchQuery, limit);
    return res.status(200).json(forums);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};