const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../db/database');

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

function adminAuth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.isAdmin) return res.status(403).json({ error: 'Forbidden' });
    next();
  } catch {
    return res.status(401).json({ error: 'Token tidak valid' });
  }
}

// POST /api/admin/login
router.post('/login', (req, res) => {
  const { password } = req.body;
  if (!password || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Password salah' });
  }
  const token = jwt.sign({ isAdmin: true }, process.env.JWT_SECRET, { expiresIn: '8h' });
  return res.json({ token });
});

// GET /api/admin/stats
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const [users, journals, chats, highlights] = await Promise.all([
      db.query('SELECT COUNT(*) AS count FROM users'),
      db.query('SELECT COUNT(*) AS count FROM journals'),
      db.query('SELECT COUNT(*) AS count FROM chats'),
      db.query('SELECT COUNT(*) AS count FROM highlights'),
    ]);
    const today = await db.query(
      "SELECT COUNT(*) AS count FROM users WHERE DATE(created_at) = CURRENT_DATE"
    );
    return res.json({
      users: parseInt(users.rows[0].count),
      journals: parseInt(journals.rows[0].count),
      chats: parseInt(chats.rows[0].count),
      highlights: parseInt(highlights.rows[0].count),
      new_users_today: parseInt(today.rows[0].count),
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/admin/users
router.get('/users', adminAuth, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT u.id, u.name, u.email, u.bio, u.created_at,
              COUNT(DISTINCT j.id) AS journal_count,
              COUNT(DISTINCT c.id) AS chat_count
       FROM users u
       LEFT JOIN journals j ON j.user_id = u.id
       LEFT JOIN chats c ON c.user_id = u.id
       GROUP BY u.id
       ORDER BY u.created_at DESC`
    );
    return res.json({ users: result.rows });
  } catch (err) {
    console.error('Admin users error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
