require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

const allowedOrigins = [
  'http://localhost:3000',
  'https://your-amplify-url.amplifyapp.com', // replace with actual Amplify URL
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.get('/', (req, res) => {
  res.send('Apollo Guide Backend is Live with Nodemon!');
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello from Apollo Guide backend!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
