const express = require('express');
const pool = require('./db');
const jwt = require('jsonwebtoken');
const router = express.Router();
const auth = (req, res, next) => { req.user = jwt.verify(req.header('Authorization'), process.env.JWT_SECRET); next(); };

router.post('/', auth, async (req, res) => {
  const { receiver_id, content } = req.body;
  const result = await pool.query('INSERT INTO messages (sender_id, receiver_id, content) VALUES ($1,$2,$3) RETURNING *', [req.user.id, receiver_id, content]);
  res.json(result.rows[0]);
});

module.exports = router;
