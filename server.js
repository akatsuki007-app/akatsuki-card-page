const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// 1. CORS & Size Limit Fix (Base64 image ke liye mandatory hai)
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// 2. MongoDB Atlas Connection
const MONGO_URI = process.env.MONGO_URI || 'YOUR_MONGODB_ATLAS_CONNECTION_STRING_HERE';

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Atlas Connected Successfully!'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

// 3. Mongoose Player Schema & Model Definition
const playerSchema = new mongoose.Schema({
  playerName: String,
  uid: { type: String, required: true, unique: true },
  region: String,
  level: Number,
  elitePass: String,
  avatarUrl: String
}, { timestamps: true });

const Player = mongoose.model('Player', playerSchema);

// 4. Test Route
app.get('/', (req, res) => {
  res.send('Free Fire Player Card API is Running Successfully!');
});

// 5. Save or Update Player Route
app.post('/api/player/save', async (req, res) => {
  try {
    const { playerName, uid, region, level, elitePass, avatarUrl } = req.body;

    if (!uid) {
      return res.status(400).json({ success: false, error: 'UID required hai!' });
    }

    const updatedPlayer = await Player.findOneAndUpdate(
      { uid: uid },
      { playerName, region, level, elitePass, avatarUrl },
      { upsert: true, new: true }
    );

    res.status(200).json({ success: true, data: updatedPlayer });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 6. Fetch Single Player Data by UID Route
app.get('/api/player/:uid', async (req, res) => {
  try {
    const player = await Player.findOne({ uid: req.params.uid });
    
    if (!player) {
      return res.status(404).json({ success: false, message: 'Player NOT found!' });
    }

    res.status(200).json({ success: true, data: player });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ===== 6.5 ADDED: Fetch All Players Route (Yeh missing tha) =====
app.get('/api/players', async (req, res) => {
  try {
    const players = await Player.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: players });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 7. Port Handling
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
