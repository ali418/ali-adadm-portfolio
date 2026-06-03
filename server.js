require('dotenv').config();

const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const path     = require('path');

const reviewsRouter = require('./routes/reviews');
const seed          = require('./seed');

const app  = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGO_URL || process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio_reviews';

// ── Middleware ──────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Serve static portfolio files ────────────────────────────
app.use(express.static(path.join(__dirname)));

// ── API Routes ──────────────────────────────────────────────
app.use('/api/reviews', reviewsRouter);

// ── Catch-all: serve index.html for SPA-style navigation ───
app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ── MongoDB + Server startup ────────────────────────────────
async function start() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅  MongoDB connected:', MONGODB_URI);

    // Auto-seed on first deploy (skipped if data already exists)
    await seed();

    app.listen(PORT, () => {
      console.log(`🚀  Portfolio server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌  Failed to connect to MongoDB:', err.message);
    process.exit(1);
  }
}

start();
