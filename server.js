// server.js
const express = require('express');
const { Pool } = require('pg');
const firebaseAdmin = require('firebase-admin');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;

// Firebase Admin SDK
const serviceAccount = require(process.env.FIREBASE_ADMIN_SDK);
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
});

// PostgreSQL Pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Middleware
app.use(express.json());

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Missing token' });

  try {
    const decoded = await firebaseAdmin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// 🚀 GET /get-medical-data
app.get('/get-medical-data', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT data FROM medical_data WHERE user_id = $1 LIMIT 1`,
      [req.user.uid]
    );
    if (result.rows.length === 0) return res.json(null);
    return res.json(result.rows);
  } catch (err) {
    console.error('Error fetching medical data:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// 🚀 POST /store-medical-data (acts as create or update)
app.post('/store-medical-data', verifyToken, async (req, res) => {
  const { medicalData } = req.body;
  if (!medicalData) return res.status(400).json({ error: 'Missing medical data' });

  try {
    const upsertQuery = `
      INSERT INTO medical_data (user_id, data)
      VALUES ($1, $2)
      ON CONFLICT (user_id)
      DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()
      RETURNING *;
    `;
    const result = await pool.query(upsertQuery, [req.user.uid, medicalData]);
    return res.json(result.rows[0]);
  } catch (err) {
    console.error('Error saving medical data:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

app.listen(port, () => {
  console.log(`✅ Medical backend listening on port ${port}`);
});
