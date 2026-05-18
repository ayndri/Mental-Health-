const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const db = require('../db/database');
const authMiddleware = require('../middleware/auth');
const { getChatResponse, detectEmotion } = require('../services/ai');

router.use(authMiddleware);

// GET /api/chat/history
router.get('/history', (req, res) => {
  try {
    const chats = db
      .prepare('SELECT id, user_id, message, emotion_result, coping_strategy, created_at FROM chats WHERE user_id = ? ORDER BY created_at ASC')
      .all(req.user.id);
    return res.status(200).json({ chats });
  } catch (err) {
    console.error('Get chat history error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/chat — send message, get AI response, save both
router.post(
  '/',
  [body('message').trim().notEmpty().withMessage('Message is required')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });

    const { message } = req.body;
    const userId = req.user.id;

    try {
      // Fetch recent history for context
      const history = db
        .prepare('SELECT message, coping_strategy FROM chats WHERE user_id = ? ORDER BY created_at DESC LIMIT 6')
        .all(userId)
        .reverse();

      const emotion   = detectEmotion(message);
      const aiReply   = await getChatResponse(message, history);

      const result = db
        .prepare('INSERT INTO chats (user_id, message, emotion_result, coping_strategy) VALUES (?, ?, ?, ?)')
        .run(userId, message, emotion, aiReply);

      const chat = db
        .prepare('SELECT id, user_id, message, emotion_result, coping_strategy, created_at FROM chats WHERE id = ?')
        .get(result.lastInsertRowid);

      return res.status(201).json({ chat });
    } catch (err) {
      console.error('Chat error:', err);
      // Graceful fallback
      const fallback = 'Maaf, aku lagi ada gangguan sebentar. Tapi kamu nggak sendirian ya, aku tetap di sini 💙';
      try {
        const r = db.prepare('INSERT INTO chats (user_id, message, emotion_result, coping_strategy) VALUES (?, ?, ?, ?)').run(userId, message, 'neutral', fallback);
        const chat = db.prepare('SELECT id, user_id, message, emotion_result, coping_strategy, created_at FROM chats WHERE id = ?').get(r.lastInsertRowid);
        return res.status(201).json({ chat });
      } catch {
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
);

module.exports = router;
