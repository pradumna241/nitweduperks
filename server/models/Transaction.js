const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['earned', 'spent'],
    required: true
  },
  points: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  rewardRequest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RewardRequest'
  },
  originalPrice: {
    type: Number
  },
  discountedPrice: {
    type: Number
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Transaction', TransactionSchema); 