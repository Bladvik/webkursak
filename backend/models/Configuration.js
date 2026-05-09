// backend/models/Configuration.js
const mongoose = require('mongoose');

const configurationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    default: 'My Custom Build',
    trim: true
  },
  // Schema.Types.Mixed allows us to store the exact JSON structure from our Zustand store
  selectedParts: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  rgbEnabled: { type: Boolean, default: true },
  rgbSync: { type: Boolean, default: false },
  baseSync: { type: Boolean, default: false },
  globalRgbColor: { type: String, default: '#00e5ff' },
  globalBaseColor: { type: String, default: '#ffffff' },
  thumbnailUrl: { type: String, default: null }, 
  updatedAt: { type: Date, default: Date.now },
  partColors: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, { timestamps: true });

// Tell Mongoose that Mixed types might change so it knows to save them properly
configurationSchema.pre('save', async function() {
  this.markModified('selectedParts');
  this.markModified('partColors');

});

module.exports = mongoose.model('Configuration', configurationSchema);