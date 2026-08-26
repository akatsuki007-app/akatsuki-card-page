/*const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  playerName: {
    type: String,
    required: true,
    trim: true
  },
  uid: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  guildName: {
    type: String,
    default: ''
  },
  region: {
    type: String,
    default: 'INDIA'
  },
  level: {
    type: Number,
    default: 1
  },
  elitePass: {
    type: String,
    default: 'NONE'
  },
  avatarUrl: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('Player', playerSchema);
