const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// CORS & Size Limit Fix (Base64 image ke liye zaroori hai)
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// MongoDB Connection Code...

// 1. SAVE ROUTE
app.post('/api/player/save', async (req, res) => {
  try {
    const playerData = req.body;
    const player = await Player.findOneAndUpdate(
      { uid: playerData.uid },
      playerData,
      { upsert: true, new: true }
    );
    res.status(200).json({ success: true, data: player });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. FETCH ROUTE (Ye missing nahi hona chahiye)
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

app.get('/', (req, res) => {
  res.send('Free Fire Player Card API is Running Successfully!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  }
});
  
// Route: Save or Update Player Card
app.post('/api/player/save', async (req, res) => {
  try {
    const { playerName, uid, region, level, elitePass, avatarUrl } = req.body;

    // Direct Upsert: UID exist hai to update, warna insert
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

// Port Handling
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
