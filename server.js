require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Set up AWS configuration
AWS.config.update({
  region: process.env.AWS_REGION || 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const s3 = new AWS.S3();
const BUCKET_NAME = 'ag-screening';

// Configure multer for memory storage
const upload = multer({
  limits: {
    fileSize: 6 * 1024 * 1024, // 5MB limit
  }
});

const allowedOrigins = [
  // Local Main App
  'http://localhost:5173',
  'http://192.168.1.212:5173',
  // Local Screening app
  'http://127.0.0.1:5173',
  // Screening app
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

// NEW API: Upload image to S3
app.post('/api/upload-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Get user ID if available (optional)
    const userId = req.body.userId || 'anonymous';

    // Generate unique filename to prevent overwriting
    const fileExtension = req.file.originalname.split('.').pop();
    const fileName = `${userId}/${uuidv4()}.${fileExtension}`;

    // Upload to S3
    const params = {
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };

    const uploadResult = await s3.upload(params).promise();

    // Return success response with the URL
    res.status(201).json({
      url: uploadResult.Location,
      fileName: fileName,
      originalName: req.file.originalname,
      fileSize: req.file.size,
      mimeType: req.file.mimetype
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Get all ingredients and matching allergens and diets
app.get('/api/ingredients-allergens-diets', (req, res) => {
  const query = `
    SELECT 
    i.name AS ingredient_name,
    GROUP_CONCAT(DISTINCT a.name SEPARATOR ', ') AS allergens,
    GROUP_CONCAT(DISTINCT d.name SEPARATOR ', ') AS diets
    FROM ingredient i
    LEFT JOIN ingredient_allergen ia ON i.id = ia.ingredient_id
    LEFT JOIN allergen a ON ia.allergen_id = a.id
    LEFT JOIN ingredient_diet id ON i.id = id.ingredient_id
    LEFT JOIN diet d ON id.diet_id = d.id
    GROUP BY i.name
    ORDER BY i.name;
  `;
  ingredientsPool.query(query, (err, results) => {
    if (err) {
      console.error('Failed to fetch ingredients with allergens and diets:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});