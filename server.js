const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Same Directory Se Schema Import
const Player = require('./Player');

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Atlas Connected Successfully'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

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
