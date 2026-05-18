const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const db = require('../db/database');
const authMiddleware = require('../middleware/auth');

const VALID_MOODS = ['happy', 'sad', 'anxious', 'angry', 'neutral'];

// All journal routes require authentication
router.use(authMiddleware);

// GET /api/journal — list all journals for the authenticated user
router.get('/', (req, res) => {
  try {
    const journals = db
      .prepare(
        'SELECT id, user_id, mood, title, content, date, created_at FROM journals WHERE user_id = ? ORDER BY date DESC, created_at DESC'
      )
      .all(req.user.id);

    return res.status(200).json({ journals });
  } catch (err) {
    console.error('Get journals error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/journal — create a new journal entry
router.post(
  '/',
  [
    body('mood')
      .notEmpty()
      .withMessage('Mood is required')
      .isIn(VALID_MOODS)
      .withMessage(`Mood must be one of: ${VALID_MOODS.join(', ')}`),
    body('title').optional().trim(),
    body('content').trim().notEmpty().withMessage('Content is required'),
    body('date')
      .optional()
      .isISO8601()
      .withMessage('Date must be a valid ISO 8601 date (YYYY-MM-DD)'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { mood, title, content, date } = req.body;
    const userId = req.user.id;

    try {
      let result;
      if (date) {
        result = db
          .prepare('INSERT INTO journals (user_id, mood, title, content, date) VALUES (?, ?, ?, ?, ?)')
          .run(userId, mood, title || '', content, date);
      } else {
        result = db
          .prepare('INSERT INTO journals (user_id, mood, title, content) VALUES (?, ?, ?, ?)')
          .run(userId, mood, title || '', content);
      }

      const journal = db
        .prepare('SELECT id, user_id, mood, title, content, date, created_at FROM journals WHERE id = ?')
        .get(result.lastInsertRowid);

      return res.status(201).json({ journal });
    } catch (err) {
      console.error('Create journal error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// PUT /api/journal/:id — update a journal entry
router.put(
  '/:id',
  [
    param('id').isInt({ min: 1 }).withMessage('Invalid journal ID'),
    body('mood')
      .optional()
      .isIn(VALID_MOODS)
      .withMessage(`Mood must be one of: ${VALID_MOODS.join(', ')}`),
    body('title').optional().trim(),
    body('content').optional().trim().notEmpty().withMessage('Content cannot be empty'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const journalId = parseInt(req.params.id, 10);
    const userId = req.user.id;
    const { mood, title, content } = req.body;

    try {
      // Verify the journal exists and belongs to this user
      const existing = db
        .prepare('SELECT id FROM journals WHERE id = ? AND user_id = ?')
        .get(journalId, userId);

      if (!existing) {
        return res.status(404).json({ error: 'Journal entry not found' });
      }

      const fields = [];
      const values = [];

      if (mood !== undefined) {
        fields.push('mood = ?');
        values.push(mood);
      }
      if (title !== undefined) {
        fields.push('title = ?');
        values.push(title);
      }
      if (content !== undefined) {
        fields.push('content = ?');
        values.push(content);
      }

      if (fields.length === 0) {
        return res.status(400).json({ error: 'No fields provided to update' });
      }

      values.push(journalId, userId);

      db.prepare(`UPDATE journals SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`).run(
        ...values
      );

      const journal = db
        .prepare('SELECT id, user_id, mood, title, content, date, created_at FROM journals WHERE id = ?')
        .get(journalId);

      return res.status(200).json({ journal });
    } catch (err) {
      console.error('Update journal error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// DELETE /api/journal/:id — delete a journal entry
router.delete(
  '/:id',
  [param('id').isInt({ min: 1 }).withMessage('Invalid journal ID')],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const journalId = parseInt(req.params.id, 10);
    const userId = req.user.id;

    try {
      const existing = db
        .prepare('SELECT id FROM journals WHERE id = ? AND user_id = ?')
        .get(journalId, userId);

      if (!existing) {
        return res.status(404).json({ error: 'Journal entry not found' });
      }

      db.prepare('DELETE FROM journals WHERE id = ? AND user_id = ?').run(journalId, userId);

      return res.status(200).json({ success: true });
    } catch (err) {
      console.error('Delete journal error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);

module.exports = router;
