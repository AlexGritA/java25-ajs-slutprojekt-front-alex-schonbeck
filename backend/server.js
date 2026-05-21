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
app.listen(PORT, () => {
  console.log(`Server körs på http://localhost:${PORT}`);
});

