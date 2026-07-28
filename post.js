const express = require('express');
const pool = require('./db');
const jwt = require('jsonwebtoken');
const router = express.Router();
const auth = (req, res, next) => { req.user = jwt.verify(req.header('Authorization'), process.env.JWT_SECRET); next(); };

router.post('/', auth, async (req, res) => {
  const { content, image_url } = req.body;
  const result = await pool.query('INSERT INTO posts (user_id, content, image_url) VALUES ($1,$2,$3) RETURNING *', [req.user.id, content, image_url]);
  res.json(result.rows[0]);
});

router.get('/feed', auth, async (req, res) => {
  const result = await pool.query('SELECT p.*, u.username FROM posts p JOIN users u ON p.user_id = u.id ORDER BY p.created_at DESC LIMIT 20');
  res.json(result.rows);
});

module.exports = router;
