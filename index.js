const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./auth'));
app.use('/api/users', require('./users'));
app.use('/api/posts', require('./posts'));
app.use('/api/messages', require('./messages'));
app.use('/api/notifications', require('./notifications'));

app.get('/', (req, res) => res.json('Nova API is Live'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Nova API running on ${PORT}`));
