require('dotenv').config();
const express = require('express');


const app = express();
const PORT = process.env.PORT || 4000;

const mysql = require('mysql2');

const db = mysql.createConnection({
  host: process.env.DB_HOST,       // e.g. 'apollo-db.xxxxxxxxxx.rds.amazonaws.com'
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

db.connect((err) => {
    if (err) {
      console.error('❌ DB connection failed:', err.stack);
    } else {
      console.log('✅ Connected to RDS DB as ID', db.threadId);
    }
  });
  

app.get('/', (req, res) => {
    res.send('Apollo Guide Backend is Live with Nodemon!');
});

app.get('/api/test', (req, res) => {
    res.json({ message: 'Hello from Apollo Guide backend!' });
  });
  

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});