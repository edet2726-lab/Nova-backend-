const express = require('express');
const pool = require('./db');
const jwt = require('jsonwebtoken');
const router = express.Router();
const auth = (req, res, next) => { req.user = jwt.verify(req.header('Authorization'), process.env.JWT_SECRET); next(); };

router.get('/', auth, async (req, res) => {
  const result = await pool.query('SELECT * FROM notifications WHERE user_id=$1 ORDER BY created_at DESC', [req.user.id]);
  res.json(result.rows);
});

module.exports = router;
