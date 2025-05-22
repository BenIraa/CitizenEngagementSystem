import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import sqlite3 from 'sqlite3';
import bcrypt from 'bcrypt';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new sqlite3.Database(path.join(__dirname, '../../database.sqlite'));
const userSeedData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/seedUsers.json'), 'utf8'));
const complaintSeedData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/seedComplaints.json'), 'utf8'));

async function seedUsers() {
  console.log('Starting to seed users...');
  
  for (const user of userSeedData.users) {
    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(user.password, 10);
      
      // Insert user
      db.run(
        `INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)`,
        [user.email, hashedPassword, user.name, user.role],
        function(err) {
          if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
              console.log(`User ${user.email} already exists, skipping...`);
            } else {
              console.error(`Error inserting user ${user.email}:`, err);
            }
          } else {
            console.log(`Successfully added user: ${user.email}`);
          }
        }
      );
    } catch (error) {
      console.error(`Error processing user ${user.email}:`, error);
    }
  }
}

function seedComplaints() {
  console.log('Starting to seed complaints...');
  
  for (const complaint of complaintSeedData.complaints) {
    try {
      db.run(
        `INSERT INTO complaints (
          user_id, title, description, category, location, 
          priority, status, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
        [
          complaint.user_id,
          complaint.title,
          complaint.description,
          complaint.category,
          complaint.location,
          complaint.priority,
          complaint.status
        ],
        function(err) {
          if (err) {
            console.error(`Error inserting complaint "${complaint.title}":`, err);
          } else {
            console.log(`Successfully added complaint: ${complaint.title}`);
          }
        }
      );
    } catch (error) {
      console.error(`Error processing complaint "${complaint.title}":`, error);
    }
  }
}

// Run the seeding
async function runSeeding() {
  try {
    await seedUsers();
    seedComplaints();
    console.log('Seeding completed!');
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    db.close();
  }
}

runSeeding(); 