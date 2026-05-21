const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./tasks.db', (err) => {
  if (err) {
    console.error('Fel när databasen öppnades:', err.message);
  } else {
    console.log('Ansluten till SQLite-databasen');
  }
});

db.run(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    status TEXT,
    assignedTo TEXT,
    timestamp TEXT
  )
`);

module.exports = db;

// Seed-data
function seedDatabase() {
  const tasks = [
    { title: 'Designa login-sida', description: 'Skapa UI för inloggning', category: 'ux', status: 'new', assignedTo: undefined, timestamp: new Date().toISOString() },
    { title: 'Implementera JWT-auth', description: 'Lägg till JWT-autentisering', category: 'backend', status: 'new', assignedTo: undefined, timestamp: new Date().toISOString() },
    { title: 'Bygg API-endpoints', description: 'Skapa CRUD-endpoints för users', category: 'backend', status: 'doing', assignedTo: 'Alice', timestamp: new Date().toISOString() },
    { title: 'Designa dashboard', description: 'Skapa dashboard-layout', category: 'frontend', status: 'doing', assignedTo: 'Bob', timestamp: new Date().toISOString() },
    { title: 'Testa endpoints', description: 'Testa alla API-endpoints i Postman', category: 'backend', status: 'done', assignedTo: 'Charlie', timestamp: new Date().toISOString() },
    { title: 'Skapa komponenter', description: 'Bygg React-komponenter', category: 'frontend', status: 'new', assignedTo: undefined, timestamp: new Date().toISOString() }
  ];

  tasks.forEach(task => {
    const sql = `INSERT INTO tasks (title, description, category, status, assignedTo, timestamp) 
                 VALUES (?, ?, ?, ?, ?, ?)`;
    db.run(sql, [task.title, task.description, task.category, task.status, task.assignedTo, task.timestamp]);
  });

  console.log('Seed-data inlagd!');
}

// Kör seed endast om tabellen är tom
db.all('SELECT COUNT(*) as count FROM tasks', [], (err, rows) => {
  if (rows[0].count === 0) {
    seedDatabase();
  }
});