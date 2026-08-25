const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Model Import
const Player = require('./models/Player');

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Atlas Connected Successfully'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

// API Endpoint - Save or Update Player Card
app.post('/api/player/save', async (req, res) => {
  try {
    const { playerName, uid, region, level, elitePass, avatarUrl } = req.body;

    // Direct MongoDB Operations (Upsert: Naya UID hai to insert, purana hai to update)
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

// Server Port Setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
