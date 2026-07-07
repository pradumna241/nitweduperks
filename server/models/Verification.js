const mongoose = require('mongoose');

const VerificationSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  role: { type: String, default: 'student' },
  otp: { type: String },
  expiresAt: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('Verification', VerificationSchema);
