/**
 * seed.js — Run once at deploy time to pre-populate MongoDB
 * with the static reviews already shown in the HTML.
 *
 * Called automatically from server.js after DB connects
 * only if the reviews collection is empty.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Review   = require('./models/Review');

const MONGO_URI =
  process.env.MONGO_URL ||
  process.env.MONGODB_URI ||
  'mongodb://localhost:27017/portfolio_reviews';

const SEED_REVIEWS = [
  {
    name: 'Khalid Al-Mansouri',
    role: 'Retail Business Owner',
    location: 'Riyadh, Saudi Arabia',
    project: 'ERP System',
    rating: 5,
    message:
      "Ali built our entire ERP and POS system from scratch. Delivery was fast, the system is rock-solid stable — we've been running daily operations on it for over a year. He doesn't just write code, he thinks through the business logic end-to-end.",
    avatarColor: '#22d3ee',
    approved: true,
  },
  {
    name: 'Sara Al-Ameen',
    role: 'Cafe Owner — Cafe Sundus',
    location: 'Khartoum, Sudan',
    project: 'Cafe Platform',
    rating: 5,
    message:
      'The online ordering platform he built for our cafe is incredibly smooth. Orders come in automatically and the dashboard is simple enough for our whole team to manage with zero training.',
    avatarColor: '#a78bfa',
    approved: true,
  },
  {
    name: 'Rania Abdullah',
    role: 'Beauty Products Entrepreneur',
    location: 'Dubai, UAE',
    project: 'E-Commerce',
    rating: 5,
    message:
      'We needed a full e-commerce store on a tight deadline. Ali delivered exactly what we needed — clean code, great UX, and perfectly on schedule. Very professional.',
    avatarColor: '#22c55e',
    approved: true,
  },
  {
    name: 'Mohammed Hamdan',
    role: 'Security Systems Manager',
    location: 'Kampala, Uganda',
    project: 'AI Security',
    rating: 5,
    message:
      'The AI weapon detection system Ali built truly exceeded expectations. Real-time alerts, accurate detection, and a solid backend integration that just works.',
    avatarColor: '#f59e0b',
    approved: true,
  },
  {
    name: 'Ahmed Omar',
    role: 'IT Company Director',
    location: 'Cairo, Egypt',
    project: 'Corporate Site',
    rating: 5,
    message:
      'Professional, responsive, and technically sharp. Ali built our company website and the result went far beyond what we imagined. His communication throughout the project was outstanding.',
    avatarColor: '#0e75b6',
    approved: true,
  },
];

async function seed(standalone = false) {
  if (standalone) {
    await mongoose.connect(MONGO_URI, { dbName: 'portfolio_reviews' });
    console.log('🌱  Seeder connected to MongoDB → portfolio_reviews');
  }

  const count = await Review.countDocuments();
  if (count > 0) {
    console.log(`✅  Seed skipped — ${count} review(s) already exist in portfolio_reviews.`);
    if (standalone) await mongoose.disconnect();
    return;
  }

  await Review.insertMany(SEED_REVIEWS);
  console.log(`🌱  Seeded ${SEED_REVIEWS.length} reviews into portfolio_reviews.reviews ✅`);

  if (standalone) await mongoose.disconnect();
}

// Allow running directly:  node seed.js
if (require.main === module) {
  seed(true).catch((err) => {
    console.error('❌  Seed error:', err.message);
    process.exit(1);
  });
}

module.exports = seed;
