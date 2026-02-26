import Forum from '../models/forum.model.js';
import ForumRepository from '../repository/forum.repository.js';

export const get_forums = async (req, res) => {
  try {
    const forums = await ForumRepository.getForums();
    if (!forums || forums.length === 0) {
      return res.status(404).json({ error: 'No forums found' });
    }
    return res.status(200).json(forums);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
export const get_forum = async (req, res) => {
  try {
    const { id } = req.params;
    const forum = await ForumRepository.getForum(id);
    if (!forum || forum.length === 0) {
      return res.status(404).json({ error: 'Forum not found' });
    }
    return res.status(200).json(forum[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
export const post_forum = async (req, res) => {
  try {
    const { profileId, title, description, isSensitive, isPublic, status } = req.body;
    const result = await ForumRepository.postForum(profileId, title, description, isSensitive, isPublic, status);
    if (result > 0) {
      return res.status(201).json({ message: 'Forum created successfully' });
    }
    return res.status(400).json({ error: 'Failed to create forum' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
export const delete_forum = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await ForumRepository.deleteForum(id);
    if (result !== 1) {
      return res.status(400).json({ error: 'Failed to delete the forum' });
    }
    return res.status(201).json({ message: 'Forum deleted successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
export const put_forum = async (req, res) => {
  try {
    const { id } = req.params;
    const { profileId, title, description, isSensitive, isPublic, status } = req.body;
    const result = await ForumRepository.putForum(id, profileId, title, description, isSensitive, isPublic, status);
    if (result !== 1) {
      return res.status(400).json({ error: 'Failed to update the forum' });
    }
    return res.status(201).json({ message: 'Forum updated successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
export const patch_forum = async (req, res) => {
  try {
    const { id } = req.params;
    const { profileId, title, description, isSensitive, isPublic, status } = req.body;
    const result = await ForumRepository.patchForum(id, profileId, title, description, isSensitive, isPublic, status);
    if (result !== 1) {
      return res.status(400).json({ error: 'Failed to update the forum' });
    }
    return res.status(201).json({ message: 'Forum updated successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
