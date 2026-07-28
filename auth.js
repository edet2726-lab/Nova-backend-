const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('./db');
const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const result = await pool.query('INSERT INTO users (username, email, password_hash) VALUES ($1,$2,$3) RETURNING id, username, email', [username, email, hashed]);
    res.json(result.rows[0]);
  } catch(e) { res.status(500).json(e.message) }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
  if(user.rows.length === 0) return res.status(400).json('User not found');
  const valid = await bcrypt.compare(password, user.rows[0].password_hash);
  if(!valid) return res.status(400).json('Wrong password');
  const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET);
  res.json({ token, user: { id: user.rows[0].id, username: user.rows[0].username } });
});

module.exports = router;
