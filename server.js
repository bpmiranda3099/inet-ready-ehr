const express = require('express');
const { Pool } = require('pg');
const firebaseAdmin = require('firebase-admin');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;

// Firebase Admin 
const serviceAccount = {
  "type": process.env.FIREBASE_TYPE,
  "project_id": process.env.FIREBASE_PROJECT_ID,
  "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
  "private_key": process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Ensure proper line breaks in the private key
  "client_email": process.env.FIREBASE_CLIENT_EMAIL,
  "client_id": process.env.FIREBASE_CLIENT_ID,
  "auth_uri": process.env.FIREBASE_AUTH_URI,
  "token_uri": process.env.FIREBASE_TOKEN_URI,
  "auth_provider_x509_cert_url": process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  "client_x509_cert_url": process.env.FIREBASE_CLIENT_X509_CERT_URL,
  "universe_domain": process.env.FIREBASE_UNIVERSE_DOMAIN
};

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
});

// PostgreSQL Pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Middleware
app.use(express.json());

const cors = require('cors');
app.use(cors({
  origin: ['https://inet-ready-v2.vercel.app', 'https://inet-ready-v2-git-mapbox-integration-bpmiranda3099s-projects.vercel.app', 'http://localhost:5173/app'],
  credentials: true
}));

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

// 🚀 DELETE /delete-medical-data
app.delete('/delete-medical-data', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      `DELETE FROM medical_data WHERE user_id = $1 RETURNING *`,
      [req.user.uid]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'No entry found to delete' });
    }
    return res.json({ message: 'Entry deleted', deleted: result.rows[0] });
  } catch (err) {
    console.error('Error deleting medical data:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});
