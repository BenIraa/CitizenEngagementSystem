import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default (db) => ({
  register: async (req, res) => {
    const { email, password, name, role, agency_id } = req.body;

    // Validate input
    if (!email || !password || !name || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate role
    if (!['citizen', 'agency', 'admin', 'superadmin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    // If role is agency, agency_id is required
    if (role === 'agency' && !agency_id) {
      return res.status(400).json({ error: 'Agency ID is required for agency users' });
    }

    // Check if email already exists
    db.get('SELECT id FROM users WHERE email = ?', [email], async (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (row) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      try {
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user
        const sql = 'INSERT INTO users (email, password, name, role, agency_id) VALUES (?, ?, ?, ?, ?)';
        db.run(sql, [email, hashedPassword, name, role, agency_id], function(err) {
          if (err) {
            return res.status(500).json({ error: err.message });
          }

          // Generate JWT token
          const token = jwt.sign(
            { id: this.lastID, email, role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
          );

          res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
              id: this.lastID,
              email,
              name,
              role,
              agency_id
            }
          });
        });
      } catch (error) {
        res.status(500).json({ error: 'Error registering user' });
      }
    });
  },

  login: async (req, res) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    db.get('SELECT id, email, password, name, role, agency_id FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      try {
        // Verify password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
          { id: user.id, email: user.email, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: '24h' }
        );

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;

        res.json({
          message: 'Login successful',
          token,
          user: userWithoutPassword
        });
      } catch (error) {
        res.status(500).json({ error: 'Error during login' });
      }
    });
  },

  getProfile: async (req, res) => {
    const userId = req.user.id;
    db.get('SELECT id, email, name, role, agency_id, created_at FROM users WHERE id = ?', [userId], (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!row) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(row);
    });
  },

  getUsers: (req, res) => {
    db.all('SELECT id, email, name, role, agency_id, created_at FROM users', [], (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    });
  },

  getUser: (req, res) => {
    const { id } = req.params;

    // Get user
    db.get('SELECT id, email, name, role, agency_id, created_at FROM users WHERE id = ?', [id], (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!row) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(row);
    });
  },

  updateUser: (req, res) => {
    const { id } = req.params;
    const { name, role, agency_id } = req.body;

    // Validate input
    if (!name || !role) {
      return res.status(400).json({ error: 'Name and role are required' });
    }

    // Validate role
    if (!['citizen', 'agency', 'admin', 'superadmin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    // If role is agency, agency_id is required
    if (role === 'agency' && !agency_id) {
      return res.status(400).json({ error: 'Agency ID is required for agency users' });
    }

    // Update user
    const sql = 'UPDATE users SET name = ?, role = ?, agency_id = ? WHERE id = ?';
    db.run(sql, [name, role, agency_id, id], function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ message: 'User updated successfully' });
    });
  },

  deleteUser: (req, res) => {
    const { id } = req.params;

    // Delete user
    db.run('DELETE FROM users WHERE id = ?', [id], function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ message: 'User deleted successfully' });
    });
  },
}); 