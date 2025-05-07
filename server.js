require('dotenv').config();
const express = require('express');

const app = express();
const PORT = process.env.PORT || 4000;

app.get('/', (req, res) => {
    res.send('Apollo Guide Backend is Live with Nodemon!');
});

app.get('/api/test', (req, res) => {
    res.json({ message: 'Hello from Apollo Guide backend!' });
  });
  

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});