const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const db = require('../db/database');
const authMiddleware = require('../middleware/auth');

// All profile routes require authentication
router.use(authMiddleware);

// PUT /api/profile — update name and bio
router.put(
  '/',
  [
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('bio').optional().isString().withMessage('Bio must be a string'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const userId = req.user.id;
    const { name, bio, avatar_config } = req.body;

    const fields = [];
    const values = [];

    if (name !== undefined) { fields.push('name = ?'); values.push(name); }
    if (bio !== undefined) { fields.push('bio = ?'); values.push(bio); }
    if (avatar_config !== undefined) {
      fields.push('avatar_config = ?');
      values.push(typeof avatar_config === 'string' ? avatar_config : JSON.stringify(avatar_config));
    }

    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields provided to update' });
    }

    values.push(userId);

    try {
      db.prepare(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`).run(...values);

      const user = db
        .prepare('SELECT id, name, email, bio, avatar_id, avatar_config, created_at FROM users WHERE id = ?')
        .get(userId);

      return res.status(200).json({ user });
    } catch (err) {
      console.error('Profile update error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// PUT /api/profile/avatar — update avatar
router.put(
  '/avatar',
  [
    body('avatarId')
      .notEmpty()
      .withMessage('avatarId is required')
      .isInt({ min: 1, max: 5 })
      .withMessage('avatarId must be an integer between 1 and 5'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const userId = req.user.id;
    const { avatarId } = req.body;

    try {
      db.prepare('UPDATE users SET avatar_id = ? WHERE id = ?').run(avatarId, userId);

      const user = db
        .prepare('SELECT id, name, email, bio, avatar_id, created_at FROM users WHERE id = ?')
        .get(userId);

      return res.status(200).json({ user });
    } catch (err) {
      console.error('Avatar update error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);

module.exports = router;
