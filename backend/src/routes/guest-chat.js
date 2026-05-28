const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { getAIResponse, generateSummary } = require('../services/ai');

// POST /api/guest-chat
router.post(
  '/',
  [
    body('message').trim().notEmpty().withMessage('Message is required'),
    body('history').optional().isArray(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });

    const { message, history = [] } = req.body;

    try {
      // Convert [{role,content}] pairs → [{message, coping_strategy}] for getAIResponse
      const chatHistory = [];
      for (let i = 0; i < history.length; i += 2) {
        if (history[i]?.role === 'user') {
          chatHistory.push({
            message: history[i].content,
            coping_strategy: history[i + 1]?.content || '',
          });
        }
      }

      const { emotion, aiReply } = await getAIResponse(message, chatHistory);
      return res.json({ reply: aiReply, emotion });
    } catch (err) {
      console.error('Guest chat error:', err);
      return res.json({
        reply: 'Maaf, aku lagi ada gangguan sebentar. Tapi kamu nggak sendirian ya 💙',
        emotion: 'neutral',
      });
    }
  }
);

// POST /api/guest-chat/summary
router.post(
  '/summary',
  [body('history').isArray({ min: 1 }).withMessage('History is required')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });

    const { history } = req.body;
    try {
      const summary = await generateSummary(history);

      // Fetch recommended articles based on dominant emotion
      const db = require('../db/database');
      const emotion = summary.emotion_key || 'neutral';
      let articles = [];
      try {
        const result = await db.query(
          `SELECT slug, title, excerpt, category, read_time, cover_gradient, cover_emoji
           FROM articles WHERE $1 = ANY(emotion_tags)
           ORDER BY published_at DESC LIMIT 3`,
          [emotion]
        );
        articles = result.rows;
        if (articles.length === 0) {
          const fallback = await db.query(
            'SELECT slug, title, excerpt, category, read_time, cover_gradient, cover_emoji FROM articles ORDER BY published_at DESC LIMIT 3'
          );
          articles = fallback.rows;
        }
      } catch (dbErr) {
        console.error('Article fetch error:', dbErr);
      }

      return res.json({ summary, articles });
    } catch (err) {
      console.error('Summary error:', err);
      return res.status(500).json({ error: 'Gagal membuat ringkasan' });
    }
  }
);

module.exports = router;
