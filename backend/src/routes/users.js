const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Guardar el último mensaje de n8n en memoria (para demo)
let lastN8nMessage = null;

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', async (req, res) => {
  try {
    // TODO: Add authentication middleware
    // TODO: Get user from database

    res.json({
      user: {
        id: 'sample-user-id',
        name: 'Sample User',
        email: 'user@example.com',
        createdAt: new Date()
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', async (req, res) => {
  try {
    const { name, email } = req.body;

    // TODO: Add authentication middleware
    // TODO: Update user in database

    res.json({
      message: 'Profile updated successfully',
      user: { name, email }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/first-user
// @desc    Get first registered user
// @access  Public
router.get('/first-user', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, full_name, date_of_birth, gender, created_at FROM users ORDER BY created_at ASC LIMIT 1'
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No users found' });
    }
    const user = result.rows[0];
    // Calcular edad si date_of_birth existe
    let age = null;
    if (user.date_of_birth) {
      const birthDate = new Date(user.date_of_birth);
      const today = new Date();
      age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
    }
    res.json({ ...user, age });
  } catch (err) {
    console.error('Error fetching first user:', err);
    res.status(500).json({ error: err.message });
  }
});

// @route   POST /api/users/n8n-receive
// @desc    Recibe datos procesados de n8n
// @access  Public
router.post('/n8n-receive', async (req, res) => {
  try {
    const { user_id, mensaje } = req.body;
    if (!user_id || !mensaje) {
      return res.status(400).json({ error: 'user_id y mensaje son requeridos' });
    }
    lastN8nMessage = { user_id, mensaje, timestamp: new Date().toISOString() };
    console.log('Recibido de n8n:', lastN8nMessage);
    res.json({ success: true, received: lastN8nMessage });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Nuevo endpoint para obtener el último mensaje de n8n
router.get('/n8n-last-message', (req, res) => {
  if (lastN8nMessage) {
    res.json(lastN8nMessage);
  } else {
    res.status(404).json({ error: 'No message received yet' });
  }
});

module.exports = router; 