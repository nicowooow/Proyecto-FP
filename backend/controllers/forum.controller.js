import Forum from '../models/forum.model.js';
import ForumRepository from '../repository/forum.repository.js';
import pool from '../db/connection_db.model.js';

export const get_forums = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    const forums = await ForumRepository.getForums(limit, offset);
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
    if (!forum) {
      return res.status(404).json({ error: 'Forum not found' });
    }
    return res.status(200).json(forum);
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
    const forum = await ForumRepository.getForum(id);
    if (!forum) {
      return res.status(404).json({ error: 'Forum not found' });
    }

    const profileResult = await pool.query(
      'select user_id from profiles where id = $1 limit 1',
      [forum.profile_id]
    );

    if (!profileResult.rows.length) {
      return res.status(404).json({ error: 'Creator profile not found' });
    }

    const creatorUserId = profileResult.rows[0].user_id;
    const requestUserId = Number(req.user?.id);

    if (Number(creatorUserId) !== requestUserId) {
      return res.status(403).json({ error: 'Only the creator can delete this forum' });
    }

    const result = await ForumRepository.deleteForum(id);
    if (result !== 1) {
      return res.status(400).json({ error: 'Failed to delete the forum' });
    }
    return res.status(200).json({ message: 'Forum deleted successfully' });
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
    const { profileId, title, description, isSensitive, isPublic, status, likes, shares } = req.body;
    const result = await ForumRepository.patchForum(id, profileId, title, description, isSensitive, isPublic, status, likes, shares);
    if (result !== 1) {
      return res.status(400).json({ error: 'Failed to update the forum' });
    }
    return res.status(201).json({ message: 'Forum updated successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const search_forums = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const searchQuery = req.query.q || '';
    
    if (!searchQuery) {
      return res.status(200).json([]);
    }

    const forums = await ForumRepository.searchForums(searchQuery, limit);
    return res.status(200).json(forums);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
