// backend/models/OTP.js
const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  code: { type: String, required: true },
  createdAt: { 
    type: Date, 
    default: Date.now, 
    expires: 600 // Магія MongoDB: цей запис АВТОМАТИЧНО видалиться через 600 секунд (10 хвилин)
  }
});

module.exports = mongoose.model('OTP', otpSchema);