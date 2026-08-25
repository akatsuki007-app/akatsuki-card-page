const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const Player = require('./models/Player');

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

app.post('/api/player/save', async (req, res) => {
  try {
    const { playerName, uid, region, level, elitePass, avatarUrl } = req.body;
    const player = await Player.findOneAndUpdate(
      { uid: uid },
      { playerName, region, level, elitePass, avatarUrl },
      { upsert: true, new: true }
    );
    res.status(200).json({ success: true, data: player });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
