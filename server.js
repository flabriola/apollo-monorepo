require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

// app.use(cors({
//   origin: 'https://dev.dqkt1qfc5m7sa.amplifyapp.com',
// }));

const allowedOrigins = [
  'http://localhost:5173', // Vite default
  'https://your-amplify-app-url',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
}));


const PORT = process.env.PORT;

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
});

db.connect((err) => {
  if (err) {
    console.error('❌ DB connection error:', err.stack);
  } else {
    console.log('✅ Connected to DB');
  }
});

app.get('/', (req, res) => {
  res.send('Apollo Guide backend is live');
});

app.get('/api/restaurants', (req, res) => {
  db.query('SELECT * FROM restaurant', (err, results) => {
    if (err) {
      console.error('DB query failed:', err.message);
      return res.status(500).json({ error: 'DB query failed' });
    }
    res.json({ status: 'success', data: results });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
