const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../db');
const router = express.Router();

router.get('/', (req, res) => {
  db.all('SELECT * FROM tasks', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

router.post('/',
  [
    body('title').notEmpty().withMessage('Title krävs'),
    body('description').notEmpty().withMessage('Description krävs'),
    body('category').isIn(['ux', 'frontend', 'backend']).withMessage('Ogiltig kategori')
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, category } = req.body;
    const status = 'new';
    const timestamp = new Date().toISOString();
    const assignedTo = undefined;

    const sql = `INSERT INTO tasks (title, description, category, status, assignedTo, timestamp) 
                 VALUES (?, ?, ?, ?, ?, ?)`;

    db.run(sql, [title, description, category, status, assignedTo, timestamp], function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, title, description, category, status, assignedTo, timestamp });
    });
  }
);

router.patch('/:id',
  [
    body('status').optional().isIn(['new', 'doing', 'done']).withMessage('Ogiltig status'),
    body('assignedTo').optional().isString().withMessage('assignedTo måste vara en sträng')
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { status, assignedTo } = req.body;

    const sql = `UPDATE tasks SET status = ?, assignedTo = ? WHERE id = ?`;

    db.run(sql, [status, assignedTo, id], function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Task hittades inte' });
      }
      res.json({ message: 'Task uppdaterad', id });
    });
  }
);

router.delete('/:id', (req, res) => {
  const { id } = req.params;

  const sql = `DELETE FROM tasks WHERE id = ?`;

  db.run(sql, [id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Task hittades inte' });
    }
    res.json({ message: 'Task raderad', id });
  });
});

module.exports = router;