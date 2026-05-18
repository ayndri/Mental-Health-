const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const db = require('../db/database');
const authMiddleware = require('../middleware/auth');

const VALID_MOODS = ['happy', 'sad', 'anxious', 'angry', 'neutral'];

router.use(authMiddleware);

// GET /api/journals
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, user_id, mood, title, content, date, created_at FROM journals WHERE user_id = $1 ORDER BY date DESC, created_at DESC',
      [req.user.id]
    );
    return res.status(200).json({ journals: result.rows });
  } catch (err) {
    console.error('Get journals error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/journals/:id
router.get('/:id', [param('id').isInt({ min: 1 })], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });

  try {
    const result = await db.query(
      'SELECT id, user_id, mood, title, content, date, created_at FROM journals WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Journal entry not found' });
    return res.status(200).json({ journal: result.rows[0] });
  } catch (err) {
    console.error('Get journal error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/journals
router.post(
  '/',
  [
    body('mood').notEmpty().withMessage('Mood is required').isIn(VALID_MOODS).withMessage(`Mood must be one of: ${VALID_MOODS.join(', ')}`),
    body('title').optional().trim(),
    body('content').trim().notEmpty().withMessage('Content is required'),
    body('date').optional().isISO8601().withMessage('Date must be a valid ISO 8601 date'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });

    const { mood, title, content, date } = req.body;
    const userId = req.user.id;

    try {
      let insertResult;
      if (date) {
        insertResult = await db.query(
          'INSERT INTO journals (user_id, mood, title, content, date) VALUES ($1, $2, $3, $4, $5) RETURNING id',
          [userId, mood, title || '', content, date]
        );
      } else {
        insertResult = await db.query(
          'INSERT INTO journals (user_id, mood, title, content) VALUES ($1, $2, $3, $4) RETURNING id',
          [userId, mood, title || '', content]
        );
      }

      const newId = insertResult.rows[0].id;
      const result = await db.query(
        'SELECT id, user_id, mood, title, content, date, created_at FROM journals WHERE id = $1',
        [newId]
      );

      return res.status(201).json({ journal: result.rows[0] });
    } catch (err) {
      console.error('Create journal error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// PUT /api/journals/:id
router.put(
  '/:id',
  [
    param('id').isInt({ min: 1 }).withMessage('Invalid journal ID'),
    body('mood').optional().isIn(VALID_MOODS).withMessage(`Mood must be one of: ${VALID_MOODS.join(', ')}`),
    body('title').optional().trim(),
    body('content').optional().trim().notEmpty().withMessage('Content cannot be empty'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });

    const journalId = parseInt(req.params.id, 10);
    const userId = req.user.id;
    const { mood, title, content } = req.body;

    try {
      const existing = await db.query(
        'SELECT id FROM journals WHERE id = $1 AND user_id = $2',
        [journalId, userId]
      );
      if (!existing.rows[0]) return res.status(404).json({ error: 'Journal entry not found' });

      const fields = [];
      const values = [];
      let paramCount = 1;

      if (mood !== undefined) { fields.push(`mood = $${paramCount++}`); values.push(mood); }
      if (title !== undefined) { fields.push(`title = $${paramCount++}`); values.push(title); }
      if (content !== undefined) { fields.push(`content = $${paramCount++}`); values.push(content); }

      if (fields.length === 0) return res.status(400).json({ error: 'No fields provided to update' });

      values.push(journalId, userId);
      await db.query(
        `UPDATE journals SET ${fields.join(', ')} WHERE id = $${paramCount} AND user_id = $${paramCount + 1}`,
        values
      );

      const result = await db.query(
        'SELECT id, user_id, mood, title, content, date, created_at FROM journals WHERE id = $1',
        [journalId]
      );
      return res.status(200).json({ journal: result.rows[0] });
    } catch (err) {
      console.error('Update journal error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// DELETE /api/journals/:id
router.delete(
  '/:id',
  [param('id').isInt({ min: 1 }).withMessage('Invalid journal ID')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });

    const journalId = parseInt(req.params.id, 10);
    const userId = req.user.id;

    try {
      const existing = await db.query(
        'SELECT id FROM journals WHERE id = $1 AND user_id = $2',
        [journalId, userId]
      );
      if (!existing.rows[0]) return res.status(404).json({ error: 'Journal entry not found' });

      await db.query('DELETE FROM journals WHERE id = $1 AND user_id = $2', [journalId, userId]);
      return res.status(200).json({ success: true });
    } catch (err) {
      console.error('Delete journal error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);

module.exports = router;
