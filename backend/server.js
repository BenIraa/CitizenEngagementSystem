import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Import the refactored route setup functions
import userRoutesSetup from './src/routes/userRoutes.js';
import complaintRoutesSetup from './src/routes/complaintRoutes.js';
import agencyRoutesSetup from './src/routes/agencyRoutes.js';

// Import the refactored controllers (now functions)
import userController from './src/controllers/userController.js';
import complaintController from './src/controllers/complaintController.js';
import agencyController from './src/controllers/agencyController.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const db = new sqlite3.Database(join(__dirname, 'database.sqlite'), (err) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize database tables
function initializeDatabase() {
  db.serialize(() => {
    // Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      agency_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (agency_id) REFERENCES agencies (id)
    )`);

    // Complaints table
    db.run(`CREATE TABLE IF NOT EXISTS complaints (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      location TEXT NOT NULL,
      priority TEXT DEFAULT 'medium',
      status TEXT DEFAULT 'new',
      assigned_to INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id),
      FOREIGN KEY (assigned_to) REFERENCES agencies (id)
    )`);

    // Responses table
    db.run(`CREATE TABLE IF NOT EXISTS responses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      complaint_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (complaint_id) REFERENCES complaints (id),
      FOREIGN KEY (user_id) REFERENCES users (id)
    )`);

    // Agencies table
    db.run(`CREATE TABLE IF NOT EXISTS agencies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      department TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
  });
}

// Initialize controllers with the db instance
const userCtrl = userController(db);
const complaintCtrl = complaintController(db);
const agencyCtrl = agencyController(db);

// Routes - Pass controllers to route setup functions
app.use('/api/users', userRoutesSetup(userCtrl));
app.use('/api/complaints', complaintRoutesSetup(complaintCtrl));
app.use('/api/agencies', agencyRoutesSetup(agencyCtrl));

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Citizen Engagement System API' });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 