const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Player = require('./models/Player');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Base64 avatar images ke liye limit Badhayi gayi hai

// MongoDB Atlas Connection String
// (Apna MongoDB URL yahan update karein)
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.mongodb.net/freefire?retryWrites=true&w=majority';

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Atlas Connected Successfully!'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// 1. SAVE / UPDATE PLAYER DATA
app.post('/api/player/save', async (req, res) => {
  try {
    const { playerName, uid, guildName, region, level, elitePass, avatarUrl } = req.body;

    if (!uid || !playerName) {
      return res.status(400).json({
        success: false,
        message: 'Player Name aur UID mandatory hain!'
      });
    }

    // UID se check karein agar player pehle se exist karta hai to Update karein, nahi to Create karein
    const updatedPlayer = await Player.findOneAndUpdate(
      { uid: uid.trim() },
      {
        playerName: playerName.trim(),
        guildName: guildName ? guildName.trim() : '',
        region: region ? region.trim() : 'INDIA',
        level: level || 1,
        elitePass: elitePass ? elitePass.trim() : 'NONE',
        avatarUrl: avatarUrl || ''
      },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: 'Player Data Successfully Saved/Updated!',
      data: updatedPlayer
    });

  } catch (error) {
    console.error('Save Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error: Data save nahi ho paya!',
      error: error.message
    });
  }
});

// 2. FETCH SINGLE PLAYER BY UID
app.get('/api/player/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const player = await Player.findOne({ uid: uid.trim() });

    if (!player) {
      return res.status(404).json({
        success: false,
        message: 'Player nahi mila!'
      });
    }

    res.status(200).json({
      success: true,
      data: player
    });

  } catch (error) {
    console.error('Fetch Single Player Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error: Fetch karne me dikkat aayi!',
      error: error.message
    });
  }
});

// 3. FETCH ALL PLAYERS LIST (For Modal Pop-up)
app.get('/api/players', async (req, res) => {
  try {
    const players = await Player.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: players.length,
      data: players
    });

  } catch (error) {
    console.error('Fetch All Players Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error: Players list load nahi ho saki!',
      error: error.message
    });
  }
});

// Health Check Route
app.get('/', (req, res) => {
  res.send('Free Fire Player Card API is running smoothly!');
});

// Port Listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
