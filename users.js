const express = require('express');
const pool = require('./db');
const jwt = require('jsonwebtoken');
const router = express.Router();
const auth = (req, res, next) => { req.user = jwt.verify(req.header('Authorization'), process.env.JWT_SECRET); next(); };

router.post('/follow/:id', auth, async (req, res) => {
  await pool.query('INSERT INTO follows (follower_id, following_id) VALUES ($1,$2)', [req.user.id, req.params.id]);
  res.json('Followed');
});

router.get('/:id', async (req, res) => {
  const result = await pool.query('SELECT id, username, bio FROM users WHERE id=$1', [req.params.id]);
  res.json(result.rows[0]);
});

module.exports = router;
