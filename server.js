require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');

const app = express();
const PORT = process.env.PORT || 4000;

// DB connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
});

db.connect((err) => {
  if (err) {
    console.error('❌ Failed to connect to DB:', err.stack);
  } else {
    console.log('✅ Connected to RDS DB');
    
    // Fetch and print all restaurants to the console
    db.query('SELECT * FROM restaurant', (err, results) => {
      if (err) {
        console.error('❌ Error fetching restaurants:', err.message);
      } else {
        console.log('📦 Restaurant Data:', results);
      }
    });
  }
});

// Optional API to fetch data
app.get('/api/restaurants', (req, res) => {
  db.query('SELECT * FROM restaurant', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ restaurants: results });
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
