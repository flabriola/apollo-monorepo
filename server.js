require('dotenv').config();
const mysql = require('mysql2');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 4000;

// ✅ MySQL Database Connection
const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  port: process.env.DATABASE_PORT,
});

// Handle database connection errors
db.connect(err => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1); // Exit process if DB connection fails
  } else {
    console.log('✅ Connected to MySQL Database!');
  }
});

// Basic API Route
app.get('/', (req, res) => {
  res.send('Apollo Guide Backend is Live with Nodemon!');
});

// Start the Express Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
