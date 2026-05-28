const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const db = require('../db/database');
const authMiddleware = require('../middleware/auth');
const { getAIResponse } = require('../services/ai');

router.use(authMiddleware);

// GET /api/chat/sessions — list of all session dates grouped by day
router.get('/sessions', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT DATE(created_at) AS session_date,
              COUNT(*) AS message_count,
              MIN(message) AS preview,
              MIN(CASE WHEN emotion_result IS NOT NULL AND emotion_result != 'neutral' THEN emotion_result END) AS emotion
       FROM chats WHERE user_id = $1
       GROUP BY DATE(created_at) ORDER BY session_date DESC`,
      [req.user.id]
    );
    return res.status(200).json({ sessions: result.rows });
  } catch (err) {
    console.error('Get sessions error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/chat/history?date=today|YYYY-MM-DD
router.get('/history', async (req, res) => {
  try {
    const { date } = req.query;
    let result;
    if (date === 'today') {
      result = await db.query(
        'SELECT id, user_id, message, emotion_result, coping_strategy, created_at FROM chats WHERE user_id = $1 AND DATE(created_at) = CURRENT_DATE ORDER BY created_at ASC',
        [req.user.id]
      );
    } else if (date) {
      result = await db.query(
        'SELECT id, user_id, message, emotion_result, coping_strategy, created_at FROM chats WHERE user_id = $1 AND DATE(created_at) = $2 ORDER BY created_at ASC',
        [req.user.id, date]
      );
    } else {
      result = await db.query(
        'SELECT id, user_id, message, emotion_result, coping_strategy, created_at FROM chats WHERE user_id = $1 ORDER BY created_at DESC LIMIT 3',
        [req.user.id]
      );
    }
    return res.status(200).json({ chats: result.rows });
  } catch (err) {
    console.error('Get chat history error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/chat
router.post(
  '/',
  [body('message').trim().notEmpty().withMessage('Message is required')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });

    const { message } = req.body;
    const userId = req.user.id;

    try {
      const historyResult = await db.query(
        'SELECT message, coping_strategy FROM chats WHERE user_id = $1 ORDER BY created_at DESC LIMIT 6',
        [userId]
      );
      const history = historyResult.rows.reverse();

      const { emotion, emotionScores, aiReply } = await getAIResponse(message, history);

      const insertResult = await db.query(
        'INSERT INTO chats (user_id, message, emotion_result, coping_strategy) VALUES ($1, $2, $3, $4) RETURNING id',
        [userId, message, emotion, aiReply]
      );
      const newId = insertResult.rows[0].id;

      const chatResult = await db.query(
        'SELECT id, user_id, message, emotion_result, coping_strategy, created_at FROM chats WHERE id = $1',
        [newId]
      );
      return res.status(201).json({ chat: chatResult.rows[0], emotionScores });
    } catch (err) {
      console.error('Chat error:', err);
      const fallback = 'Maaf, aku lagi ada gangguan sebentar. Tapi kamu nggak sendirian ya, aku tetap di sini 💙';
      try {
        const r = await db.query(
          'INSERT INTO chats (user_id, message, emotion_result, coping_strategy) VALUES ($1, $2, $3, $4) RETURNING id',
          [userId, message, 'neutral', fallback]
        );
        const chatResult = await db.query(
          'SELECT id, user_id, message, emotion_result, coping_strategy, created_at FROM chats WHERE id = $1',
          [r.rows[0].id]
        );
        return res.status(201).json({ chat: chatResult.rows[0] });
      } catch {
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
);

module.exports = router;
