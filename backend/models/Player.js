const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  playerName: { type: String, required: true, trim: true },
  uid: { type: String, required: true, unique: true },
  region: { type: String, default: 'INDIA' },
  level: { type: Number, required: true },
  elitePass: { type: String, default: 'NONE' },
  avatarUrl: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Player', playerSchema);
