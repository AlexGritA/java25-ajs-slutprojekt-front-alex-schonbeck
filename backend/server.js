const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = 3000;

// Middleware - regler för hur servern ska hantera requests
app.use(cors());
app.use(express.json());

// Routes
app.use('/tasks', require('./routes/tasks'));

// Start server
// 404 - Route finns inte
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint finns inte' });
});

// Global error handler - fångar oväntade fel
app.use((err, req, res, next) => {
  console.error('Serverfel:', err.message);
  res.status(500).json({ error: 'Något gick fel på servern' });
});

app.listen(PORT, () => {
  console.log(`Server körs på http://localhost:${PORT}`);
});

