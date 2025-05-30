const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Serve static files from the correct directory
app.use(express.static(path.join(__dirname, 'guilty-detective-game/public')));

// Serve index.html for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'guilty-detective-game/public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`GUILTY game running on port ${PORT}`);
});
