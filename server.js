require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const { getRestaurantId } = require('./restaurants');
const { restaurantData, ingredientsAllergensDiets, updateScreening, insertScreening, getScreenings } = require('./queries');

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
  'http://192.168.1.212:5173',    // Home
  'http://172.16.100.195:5173',   // Studio
  'http://192.168.40.89:5173',    // Genesis
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

// Connection pool for restaurant DB
const restaurantPool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_MAIN_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
});

app.get('/', (req, res) => {
  res.send('Apollo Guide backend is live');
});

// Get all screenings for a user
app.get('/api/screenings/:userId', (req, res) => {
  const userId = req.params.userId;
  const query = getScreenings;

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
  const query = insertScreening;
  
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
  const query = updateScreening;

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

// Upload image to S3
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
  const query = ingredientsAllergensDiets;
  ingredientsPool.query(query, (err, results) => {
    if (err) {
      console.error('Failed to fetch ingredients with allergens and diets:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// Get full restaurant data
app.get('/api/restaurant-data/:route', (req, res) => {
  const route = req.params.route;
  const restaurantId = getRestaurantId(route);
  const query = restaurantData;

  restaurantPool.query(query, [restaurantId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(results);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});