const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const db = require('../db/database');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

// GET /api/highlights
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, user_id, chat_id, article_id, article_title, text, color, created_at
       FROM highlights
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [req.user.id]
    );
    return res.status(200).json({ highlights: result.rows });
  } catch (err) {
    console.error('Get highlights error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/highlights
router.post(
  '/',
  [
    body('chat_id').optional({ nullable: true }).isInt({ min: 1 }).withMessage('chat_id must be a positive integer'),
    body('article_id').optional({ nullable: true }).isString(),
    body('article_title').optional({ nullable: true }).isString().trim(),
    body('text').trim().notEmpty().withMessage('Text is required'),
    body('color').optional().matches(/^#[0-9A-Fa-f]{3,8}$/).withMessage('Color must be a valid hex color'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });

    const { chat_id, article_id, article_title, text, color } = req.body;
    const userId = req.user.id;

    try {
      if (chat_id) {
        const chatCheck = await db.query(
          'SELECT id FROM chats WHERE id = $1 AND user_id = $2',
          [chat_id, userId]
        );
        if (!chatCheck.rows[0]) return res.status(404).json({ error: 'Chat message not found' });
      }

      const insertResult = await db.query(
        'INSERT INTO highlights (user_id, chat_id, article_id, article_title, text, color) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
        [userId, chat_id || null, article_id || null, article_title || null, text, color || '#A78BFA']
      );
      const newId = insertResult.rows[0].id;

      const result = await db.query(
        'SELECT id, user_id, chat_id, article_id, article_title, text, color, created_at FROM highlights WHERE id = $1',
        [newId]
      );
      return res.status(201).json({ highlight: result.rows[0] });
    } catch (err) {
      console.error('Create highlight error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// DELETE /api/highlights/:id
router.delete(
  '/:id',
  [param('id').isInt({ min: 1 }).withMessage('Invalid highlight ID')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });

    const highlightId = parseInt(req.params.id, 10);
    const userId = req.user.id;

    try {
      const existing = await db.query(
        'SELECT id FROM highlights WHERE id = $1 AND user_id = $2',
        [highlightId, userId]
      );
      if (!existing.rows[0]) return res.status(404).json({ error: 'Highlight not found' });

      await db.query('DELETE FROM highlights WHERE id = $1 AND user_id = $2', [highlightId, userId]);
      return res.status(200).json({ success: true });
    } catch (err) {
      console.error('Delete highlight error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);

module.exports = router;
