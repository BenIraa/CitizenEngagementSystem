export default (db) => ({
  getAgencies: (req, res) => {
    const sql = 'SELECT id, name, department, created_at FROM agencies';

    db.all(sql, [], (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    });
  },

  createAgency: (req, res) => {
    const { name, department, userId } = req.body;

    if (!name || !department) {
      return res.status(400).json({ error: 'Name and department are required' });
    }

    // Start a transaction
    db.serialize(() => {
      db.run('BEGIN TRANSACTION');

      // First, create the agency
      const createAgencySql = 'INSERT INTO agencies (name, department) VALUES (?, ?)';
      db.run(createAgencySql, [name, department], function(err) {
        if (err) {
          db.run('ROLLBACK');
          if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ error: 'Agency with this name already exists' });
          } else {
            return res.status(500).json({ error: 'Error creating agency' });
          }
        }

        const agencyId = this.lastID;

        // If a userId was provided, link the user to this agency
        if (userId) {
          // First check if the user exists and is an agency user
          db.get('SELECT id, role FROM users WHERE id = ?', [userId], (err, user) => {
            if (err) {
              db.run('ROLLBACK');
              return res.status(500).json({ error: 'Error checking user' });
            }

            if (!user) {
              db.run('ROLLBACK');
              return res.status(400).json({ error: 'User not found' });
            }

            if (user.role !== 'agency') {
              db.run('ROLLBACK');
              return res.status(400).json({ error: 'User must have agency role' });
            }

            // Update the user's agency_id
            db.run('UPDATE users SET agency_id = ? WHERE id = ?', [agencyId, userId], function(err) {
              if (err) {
                db.run('ROLLBACK');
                return res.status(500).json({ error: 'Error linking user to agency' });
              }

              // Commit the transaction
              db.run('COMMIT', (err) => {
                if (err) {
                  db.run('ROLLBACK');
                  return res.status(500).json({ error: 'Error committing transaction' });
                }
                res.status(201).json({ 
                  message: 'Agency created successfully', 
                  agencyId,
                  linkedUserId: userId
                });
              });
            });
          });
        } else {
          // No user to link, just commit the transaction
          db.run('COMMIT', (err) => {
            if (err) {
              db.run('ROLLBACK');
              return res.status(500).json({ error: 'Error committing transaction' });
            }
            res.status(201).json({ 
              message: 'Agency created successfully', 
              agencyId 
            });
          });
        }
      });
    });
  },
}); 