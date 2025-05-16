require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(express.json());

const allowedOrigins = [
  'http://localhost:5173',
  'https://dev.dqkt1qfc5m7sa.amplifyapp.com',
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

// Connection pool for screenings DB
const screeningsPool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
});

// Connection pool for ingredients DB
const ingredientsPool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_MAIN_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 5,
});

app.get('/', (req, res) => {
  res.send('Apollo Guide backend is live');
});

// Get all screenings for a user
app.get('/api/screenings/:userId', (req, res) => {
  const userId = req.params.userId;
  const query = `
    SELECT 
      s.id,
      s.user_id,
      s.title,
      s.last_modified AS lastModified,
      CONCAT(s.first_name, ' ', s.last_name) AS owner,
      s.json_data AS json
    FROM screenings s
    WHERE s.user_id = ?
    ORDER BY s.last_modified DESC
  `;
  screeningsPool.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Failed to fetch screenings:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// Insert a new screening
app.post('/api/screenings', (req, res) => {
  const { user_id, title, json_data, first_name, last_name } = req.body;
  const query = `
    INSERT INTO screenings (user_id, title, json_data, first_name, last_name)
    VALUES (?, ?, CAST(? AS JSON), ?, ?)
  `;
  screeningsPool.query(query, [user_id, title, JSON.stringify(json_data), first_name, last_name], (err, result) => {
    if (err) {
      console.error('Failed to insert screening:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(201).json({ id: result.insertId });
  });
});

// Update an existing screening
app.put('/api/screenings/:id', (req, res) => {
  const screeningId = req.params.id;
  const { title, json_data } = req.body;
  const query = `
    UPDATE screenings
    SET 
      title = ?,
      json_data = CAST(? AS JSON),
      last_modified = CURRENT_TIMESTAMP
    WHERE id = ?
  `;
  screeningsPool.query(query, [title, JSON.stringify(json_data), screeningId], (err) => {
    if (err) {
      console.error('Failed to update screening:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(200).json({ status: 'updated' });
  });
});

// Get all ingredients from the main database in json format
app.get('/api/ingredients', (req, res) => {
  const query = 'SELECT * FROM ingredient';
  ingredientsPool.query(query, (err, results) => {
    if (err) {
      console.error('Failed to fetch ingredients:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
