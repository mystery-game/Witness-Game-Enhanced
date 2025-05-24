const express = require('express');
const path = require('path');

const app = express();

// Serve static files
app.use(express.static(path.join(__dirname)));

// Main route - redirect to GUILTY game
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'guilty-game-v2.html'));
});

// Add route for GUILTY v3 (cleaned up version)
app.get('/guilty-v3', (req, res) => {
    res.sendFile(path.join(__dirname, 'guilty-game-v3.html'));
});

// Health check endpoint for Render
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`GUILTY game running on port ${PORT}`);
}); 