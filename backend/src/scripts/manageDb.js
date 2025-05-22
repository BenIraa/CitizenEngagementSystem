import { backupDatabase, restoreDatabase, listBackups } from '../utils/dbBackup.js';

const command = process.argv[2];
const backupPath = process.argv[3];

switch (command) {
  case 'backup':
    try {
      const backupFile = backupDatabase();
      console.log('Backup created successfully:', backupFile);
    } catch (error) {
      console.error('Backup failed:', error);
    }
    break;

  case 'restore':
    if (!backupPath) {
      console.error('Please provide a backup file path');
      process.exit(1);
    }
    try {
      restoreDatabase(backupPath);
      console.log('Database restored successfully');
    } catch (error) {
      console.error('Restore failed:', error);
    }
    break;

  case 'list':
    try {
      const backups = listBackups();
      console.log('Available backups:');
      backups.forEach(backup => {
        console.log(`- ${backup.name} (${backup.date.toLocaleString()})`);
      });
    } catch (error) {
      console.error('Failed to list backups:', error);
    }
    break;

  default:
    console.log(`
Usage:
  node manageDb.js <command> [backup-path]

Commands:
  backup    - Create a new database backup
  restore   - Restore database from a backup file
  list      - List all available backups

Example:
  node manageDb.js backup
  node manageDb.js restore ./backups/database-2024-01-15.sqlite
  node manageDb.js list
    `);
} 