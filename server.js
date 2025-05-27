const express = require('express');
const path = require('path');
const app = express();
<<<<<<< HEAD
const port = process.env.PORT || 3000;

// Serve static files from the current directory
app.use(express.static(__dirname));

// Serve index.html for all routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`GUILTY game server running on port ${port}`);
}); 
=======
const PORT = process.env.PORT || 3000;

// Middleware to serve static files
app.use(express.static('.'));

// Serve index.html for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle 404s
app.use((req, res) => {
  res.status(404).send('Page not found');
});

// Start the server
app.listen(PORT, () => {
  console.log(`GUILTY Game server is running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to play the game`);
});
>>>>>>> 2f46c56355087bd0c2a7404a4ab773cd1b7ba079
