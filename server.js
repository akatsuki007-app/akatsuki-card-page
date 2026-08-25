const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middlewares
// Express middleware size limit increase karein
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// server.js me app.use(cors()); ke neeche ye add karein:

app.get('/', (req, res) => {
  res.send('Free Fire Player Card API is Running Successfully!');
});

// Same Directory Se Schema Import
const Player = require('./Player');

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Atlas Connected Successfully'))
  .catch((err) => console.error('MongoDB Connection Error:', err));
// NEW ROUTE: Fetch Player Data by UID
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
