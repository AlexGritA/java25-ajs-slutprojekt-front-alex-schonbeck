const express = require('express');
const db = require('../db');

const router = express.Router();

// GET 
router.get('/', (req, res) => {
  db.all('SELECT * FROM tasks', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// POST
router.post('/', (req, res) => {
  const { title, description, category } = req.body;
  const status = 'new';
  const timestamp = new Date().toISOString();
  const assignedTo = undefined;

  const sql = `INSERT INTO tasks (title, description, category, status, assignedTo, timestamp) 
               VALUES (?, ?, ?, ?, ?, ?)`;
  
  db.run(sql, [title, description, category, status, assignedTo, timestamp], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, title, description, category, status, assignedTo, timestamp });
  });
});

// PATCH 
router.patch('/:id', (req, res) => {
  const { id } = req.params;
  const { status, assignedTo } = req.body;

  const sql = `UPDATE tasks SET status = ?, assignedTo = ? WHERE id = ?`;
  
  db.run(sql, [status, assignedTo, id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Task uppdaterad', id });
  });
});

// DELETE
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  const sql = `DELETE FROM tasks WHERE id = ?`;
  
  db.run(sql, [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Task raderad', id });
  });
});

module.exports = router;