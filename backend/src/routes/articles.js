const express = require('express');
const router  = express.Router();
const db      = require('../db/database');

// GET /api/articles — list (no content, for archive page)
router.get('/', async (req, res) => {
  try {
    const { category, emotion } = req.query;
    let text   = 'SELECT id, slug, title, excerpt, category, emotion_tags, author, read_time, cover_gradient, cover_emoji, published_at FROM articles';
    const vals = [];

    if (category) {
      vals.push(category);
      text += ` WHERE category = $${vals.length}`;
    } else if (emotion) {
      vals.push(emotion);
      text += ` WHERE $${vals.length} = ANY(emotion_tags)`;
    }

    text += ' ORDER BY published_at DESC';
    const result = await db.query(text, vals);
    return res.json({ articles: result.rows });
  } catch (err) {
    console.error('GET /api/articles error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/articles/recommended?emotion=anxious — for chat summary
router.get('/recommended', async (req, res) => {
  try {
    const { emotion = 'neutral' } = req.query;
    const result = await db.query(
      `SELECT id, slug, title, excerpt, category, read_time, cover_gradient, cover_emoji
       FROM articles
       WHERE $1 = ANY(emotion_tags)
       ORDER BY published_at DESC
       LIMIT 3`,
      [emotion]
    );
    // Fallback: jika tidak ada yang cocok, ambil 3 artikel terbaru
    if (result.rows.length === 0) {
      const fallback = await db.query(
        'SELECT id, slug, title, excerpt, category, read_time, cover_gradient, cover_emoji FROM articles ORDER BY published_at DESC LIMIT 3'
      );
      return res.json({ articles: fallback.rows });
    }
    return res.json({ articles: result.rows });
  } catch (err) {
    console.error('GET /api/articles/recommended error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/articles/:slug — single article with full content
router.get('/:slug', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM articles WHERE slug = $1',
      [req.params.slug]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Article not found' });

    // Parse content JSONB if returned as string
    const article = result.rows[0];
    if (typeof article.content === 'string') {
      try { article.content = JSON.parse(article.content); } catch {}
    }

    // Related articles (same category, excluding self)
    const related = await db.query(
      `SELECT slug, title, excerpt, category, read_time, cover_gradient, cover_emoji
       FROM articles WHERE category = $1 AND slug != $2
       ORDER BY published_at DESC LIMIT 3`,
      [article.category, article.slug]
    );
    return res.json({ article, related: related.rows });
  } catch (err) {
    console.error('GET /api/articles/:slug error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
