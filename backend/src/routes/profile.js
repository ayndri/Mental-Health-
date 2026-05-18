const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const db = require('../db/database');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

// GET /api/profile
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, name, email, bio, avatar_id, avatar_config, created_at FROM users WHERE id = $1',
      [req.user.id]
    );
    return res.status(200).json({ user: result.rows[0] });
  } catch (err) {
    console.error('Get profile error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/profile — update name, bio, avatar_config
router.put(
  '/',
  [
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('bio').optional().isString().withMessage('Bio must be a string'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const userId = req.user.id;
    const { name, bio, avatar_config } = req.body;

    const fields = [];
    const values = [];
    let paramCount = 1;

    if (name !== undefined) { fields.push(`name = $${paramCount++}`); values.push(name); }
    if (bio !== undefined) { fields.push(`bio = $${paramCount++}`); values.push(bio); }
    if (avatar_config !== undefined) {
      fields.push(`avatar_config = $${paramCount++}`);
      values.push(typeof avatar_config === 'string' ? avatar_config : JSON.stringify(avatar_config));
    }

    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields provided to update' });
    }

    values.push(userId);

    try {
      await db.query(`UPDATE users SET ${fields.join(', ')} WHERE id = $${paramCount}`, values);

      const result = await db.query(
        'SELECT id, name, email, bio, avatar_id, avatar_config, created_at FROM users WHERE id = $1',
        [userId]
      );

      return res.status(200).json({ user: result.rows[0] });
    } catch (err) {
      console.error('Profile update error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// PUT /api/profile/avatar — update avatar_id
router.put(
  '/avatar',
  [
    body('avatarId')
      .notEmpty()
      .withMessage('avatarId is required')
      .isInt({ min: 1, max: 5 })
      .withMessage('avatarId must be an integer between 1 and 5'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const userId = req.user.id;
    const { avatarId } = req.body;

    try {
      await db.query('UPDATE users SET avatar_id = $1 WHERE id = $2', [avatarId, userId]);

      const result = await db.query(
        'SELECT id, name, email, bio, avatar_id, avatar_config, created_at FROM users WHERE id = $1',
        [userId]
      );

      return res.status(200).json({ user: result.rows[0] });
    } catch (err) {
      console.error('Avatar update error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);

module.exports = router;
