// backend/models/Part.js
const mongoose = require('mongoose');

const partSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // e.g., 'cpu-intel-14900k'
  name: { type: String, required: true },
  brand: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['CPU', 'GPU', 'Motherboard', 'RAM', 'Case', 'PSU', 'CaseFans', 'SSD'],
    required: true 
  },
  price: { type: Number, required: true },
  affiliateLink: { type: String }, // Your monetization vector
  
  // Performance Analytics (0-100 scale for easy charting)
  performanceScore: { type: Number, required: true, default: 50 },
  powerDraw: { type: Number, required: true, default: 0 }, // in Watts
  
  // The Compatibility Engine Payload
  compatibility: {
    socket: String,       // e.g., 'AM5', 'LGA1700'
    formFactor: String,   // e.g., 'ATX', 'mATX' (for Mobos/Cases)
    ramType: String,      // e.g., 'DDR5'
    lengthMm: Number,     // e.g., 342 (for GPU clearance)
    maxGpuLengthMm: Number, // e.g., 330 (for Case limits)
    wattage: Number       // e.g., 850 (for PSUs)
  },

  // 3D Visual Payload (The specific offsets for the scene)
  transform: {
    position: [Number],
    rotation: [Number],
    scale: [Number]
  }
}, { timestamps: true });

module.exports = mongoose.model('Part', partSchema);