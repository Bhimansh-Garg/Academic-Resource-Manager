require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes');

const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// Main Auth Routes
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const dbResult = await pool.query('SELECT NOW()');
    res.json({ status: 'ok', db_time: dbResult.rows[0].now });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Database connection failed' });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
