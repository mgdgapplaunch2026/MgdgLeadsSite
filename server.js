require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Database Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});



// Middleware
// Middleware
app.use(express.json()); // Essential for reading the form data
app.use(express.static(path.join(__dirname, 'public'))); // Tells Express where your files are
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Basic Route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route to handle Waitlist Signups
app.post('/api/signup', async (req, res) => {
  const { name, email, interest } = req.body;

  try {
    const queryText = 'INSERT INTO waitlist(name, email, interest) VALUES($1, $2, $3) RETURNING *';
    const values = [name, email, interest];
    
    const result = await pool.query(queryText, values);
    
    console.log('New signup:', result.rows[0]);
    res.status(200).json({ message: 'Success! Welcome to MGDG.' });
  } catch (err) {
    console.error('Database error:', err);
    // Handle duplicate emails if you set the column to UNIQUE
    if (err.code === '23505') {
      return res.status(400).json({ error: 'This email is already on the waitlist.' });
    }
    res.status(500).json({ error: 'Internal server error.' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Project running at http://localhost:${PORT}`);
});