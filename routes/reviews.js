const express = require('express');
const router  = express.Router();
const Review  = require('../models/Review');

// Accent colour palette — cycles per review
const COLORS = [
  '#22d3ee', // cyan
  '#a78bfa', // purple
  '#22c55e', // green
  '#f59e0b', // amber
  '#0e75b6', // blue
  '#f97316', // orange
  '#ec4899', // pink
];

// ─────────────────────────────────────────────────────────────
// GET /api/reviews  – return all approved reviews, newest last
// ─────────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find({ approved: true })
      .sort({ createdAt: 1 })
      .lean();
    res.json({ success: true, data: reviews });
  } catch (err) {
    console.error('GET /reviews error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// ─────────────────────────────────────────────────────────────
// POST /api/reviews  – submit a new review
// ─────────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const { name, role, location, project, rating, message } = req.body;

    // basic validation
    if (!name || !message) {
      return res.status(400).json({ success: false, error: 'Name and message are required.' });
    }
    if (message.length < 10) {
      return res.status(400).json({ success: false, error: 'Message must be at least 10 characters.' });
    }

    // pick an accent colour deterministically (hash of name)
    const colorIdx = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % COLORS.length;
    const avatarColor = COLORS[colorIdx];

    const review = await Review.create({
      name: name.trim(),
      role: (role || '').trim(),
      location: (location || '').trim(),
      project: (project || 'General').trim(),
      rating: Number(rating) || 5,
      message: message.trim(),
      avatarColor,
    });

    res.status(201).json({ success: true, data: review });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ success: false, error: err.message });
    }
    console.error('POST /reviews error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;
