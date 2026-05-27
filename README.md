# Scrum Board - Fullstack Project

Ett fullstack scrum board för att hantera uppgifter i ett projekt.

## Teknologier

**Backend:**
- Node.js
- Express
- SQLite

**Frontend:**
- Vite
- Vanilla JavaScript
- CSS

## Installation

### 1. Klona projektet
```bash
git clone https://github.com/AlexGritA/java25-ajs-slutprojekt-front-alex-schonbeck.git
cd java25-ajs-slutprojekt-front-alex-schonbeck
```

### 2. Installera dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd ../frontend
npm install
```

## Köra projektet

### Development Mode

**Starta backend (Terminal 1):**
```bash
cd backend
npm run dev
```
Backend körs på `http://localhost:3000`

**Starta frontend (Terminal 2):**
```bash
cd frontend
npm run dev
```
Frontend körs på `http://localhost:5173`

Öppna `http://localhost:5173` i browsern.

### Production Mode

**Bygg frontend:**
```bash
cd frontend
npm run build
```

**Starta backend:**
```bash
cd backend
npm start
```

**Servera frontend production-filer:**
```bash
cd frontend
npm run preview
```

Öppna den URL som `npm run preview` visar (vanligtvis `http://localhost:4173`).

## Projektstruktur
project/
├── backend/
│   ├── db.js           # Databas-konfiguration och seed-data
│   ├── server.js       # Express-server
│   ├── routes/
│   │   └── tasks.js    # API-endpoints för tasks
│   └── tasks.db        # SQLite-databas
├── frontend/
│   ├── src/
│   │   ├── main.js     # Huvudlogik
│   │   ├── api.js      # API-anrop
│   │   └── style.css   # Styling
│   └── index.html      # HTML-struktur
└── README.md

## Funktioner

- Skapa nya tasks med titel, beskrivning och kategori
- Tre kolumner: New, Doing, Done
- Flytta tasks mellan kolumner
- Tilldela tasks till personer
- Radera slutförda tasks
- Timestamp för varje task

## API Endpoints

- `GET /tasks` - Hämta alla tasks
- `POST /tasks` - Skapa ny task
- `PATCH /tasks/:id` - Uppdatera task
- `DELETE /tasks/:id` - Radera task

## Databas

Seed-data skapas automatiskt vid första start om databasen är tom (6 exempel-tasks).