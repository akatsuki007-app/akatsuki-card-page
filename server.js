const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Base64 avatar images ke liye high limit

// MongoDB Connection String (Aapki Apni Mongo URI Yahan Rakhein)
const MONGO_URI = process.env.MONGO_URI || "YOUR_MONGODB_CONNECTION_STRING";

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Atlas Connected Successfully!'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

// Mongoose Schema & Model
const playerSchema = new mongoose.Schema({
  playerName: { type: String, required: true },
  uid: { type: String, required: true, unique: true },
  guildName: { type: String, default: '' },
  region: { type: String, default: '' },
  level: { type: Number, default: 0 },
  elitePass: { type: String, default: '' },
  avatarUrl: { type: String, default: '' }
}, { timestamps: true });

const Player = mongoose.model('Player', playerSchema);

// 1. SAVE / UPDATE PLAYER API
app.post('/api/player/save', async (req, res) => {
  try {
    const { playerName, uid, guildName, region, level, elitePass, avatarUrl } = req.body;

    if (!uid) {
      return res.status(400).json({ success: false, message: 'UID mandatory hai!' });
    }

    // Agar UID pehle se exist karti hai toh update hoga, warna naya create hoga (upsert)
    const updatedPlayer = await Player.findOneAndUpdate(
      { uid: uid },
      { playerName, uid, guildName, region, level, elitePass, avatarUrl },
      { new: true, upsert: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Player data successfully saved!',
      data: updatedPlayer
    });

  } catch (error) {
    console.error('Save Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// 2. FETCH SINGLE PLAYER BY UID API
app.get('/api/player/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const player = await Player.findOne({ uid: uid });

    if (!player) {
      return res.status(404).json({ success: false, message: 'Player data nahi mila!' });
    }

    return res.status(200).json({
      success: true,
      data: player
    });

  } catch (error) {
    console.error('Fetch Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// 3. FETCH ALL PLAYERS API (Admin List ke liye)
app.get('/api/players', async (req, res) => {
  try {
    const players = await Player.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: players
    });

  } catch (error) {
    console.error('Fetch All Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// 4. DELETE PLAYER BY UID API (Naya Added Endpoint)
app.delete('/api/player/delete/:uid', async (req, res) => {
  try {
    const { uid } = req.params;

    const deletedPlayer = await Player.findOneAndDelete({ uid: uid });

    if (!deletedPlayer) {
      return res.status(404).json({
        success: false,
        message: 'Delete karne ke liye ye UID database me nahi mila!'
      });
    }

    return res.status(200).json({
      success: true,
      message: `Player with UID ${uid} deleted successfully!`,
      data: deletedPlayer
    });

  } catch (error) {
    console.error('Delete Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Server Listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
      
