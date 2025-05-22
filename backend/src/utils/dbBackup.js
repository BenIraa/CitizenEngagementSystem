import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DB_PATH = path.join(__dirname, '../../database.sqlite');
const BACKUP_DIR = path.join(__dirname, '../../backups');

// Create backups directory if it doesn't exist
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR);
}

export const backupDatabase = () => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(BACKUP_DIR, `database-${timestamp}.sqlite`);
  
  try {
    fs.copyFileSync(DB_PATH, backupPath);
    console.log(`Database backed up to: ${backupPath}`);
    return backupPath;
  } catch (error) {
    console.error('Error backing up database:', error);
    throw error;
  }
};

export const restoreDatabase = (backupPath) => {
  try {
    fs.copyFileSync(backupPath, DB_PATH);
    console.log(`Database restored from: ${backupPath}`);
  } catch (error) {
    console.error('Error restoring database:', error);
    throw error;
  }
};

export const listBackups = () => {
  try {
    const files = fs.readdirSync(BACKUP_DIR);
    return files
      .filter(file => file.startsWith('database-') && file.endsWith('.sqlite'))
      .map(file => ({
        name: file,
        path: path.join(BACKUP_DIR, file),
        date: fs.statSync(path.join(BACKUP_DIR, file)).mtime
      }))
      .sort((a, b) => b.date - a.date);
  } catch (error) {
    console.error('Error listing backups:', error);
    throw error;
  }
}; 