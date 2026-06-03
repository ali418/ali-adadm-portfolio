const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    role: {
      type: String,
      trim: true,
      maxlength: 100,
      default: '',
    },
    location: {
      type: String,
      trim: true,
      maxlength: 100,
      default: '',
    },
    project: {
      type: String,
      trim: true,
      maxlength: 80,
      default: 'General',
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    message: {
      type: String,
      required: [true, 'Review message is required'],
      trim: true,
      minlength: 10,
      maxlength: 1000,
    },
    approved: {
      type: Boolean,
      default: true, // auto-approve for now; set false to require moderation
    },
    avatarColor: {
      type: String,
      default: '#22d3ee',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Review', reviewSchema);
