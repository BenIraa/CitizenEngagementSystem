import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./database.sqlite');

export const createComplaint = async (req, res) => {
  const { title, description, category } = req.body;
  const userId = req.user.id;

  try {
    db.run(
      'INSERT INTO complaints (user_id, title, description, category) VALUES (?, ?, ?, ?)',
      [userId, title, description, category],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Error creating complaint' });
        }
        res.status(201).json({
          message: 'Complaint created successfully',
          complaintId: this.lastID
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getComplaints = async (req, res) => {
  const { status, category } = req.query;
  let query = 'SELECT c.*, u.name as user_name FROM complaints c JOIN users u ON c.user_id = u.id';
  const params = [];

  if (status || category) {
    query += ' WHERE';
    if (status) {
      query += ' c.status = ?';
      params.push(status);
    }
    if (category) {
      query += status ? ' AND' : '';
      query += ' c.category = ?';
      params.push(category);
    }
  }

  query += ' ORDER BY c.created_at DESC';

  try {
    db.all(query, params, (err, complaints) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(complaints);
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getComplaintById = async (req, res) => {
  const { id } = req.params;

  try {
    db.get(
      `SELECT c.*, u.name as user_name 
       FROM complaints c 
       JOIN users u ON c.user_id = u.id 
       WHERE c.id = ?`,
      [id],
      (err, complaint) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        if (!complaint) {
          return res.status(404).json({ error: 'Complaint not found' });
        }
        res.json(complaint);
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateComplaintStatus = async (req, res) => {
  const { id } = req.params;
  const { status, assigned_to } = req.body;

  try {
    db.run(
      'UPDATE complaints SET status = ?, assigned_to = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, assigned_to, id],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Error updating complaint' });
        }
        if (this.changes === 0) {
          return res.status(404).json({ error: 'Complaint not found' });
        }
        res.json({ message: 'Complaint updated successfully' });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const addResponse = async (req, res) => {
  const { complaint_id } = req.params;
  const { message } = req.body;
  const userId = req.user.id;

  try {
    db.run(
      'INSERT INTO responses (complaint_id, user_id, message) VALUES (?, ?, ?)',
      [complaint_id, userId, message],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Error adding response' });
        }
        res.status(201).json({
          message: 'Response added successfully',
          responseId: this.lastID
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getResponses = async (req, res) => {
  const { complaint_id } = req.params;

  try {
    db.all(
      `SELECT r.*, u.name as user_name 
       FROM responses r 
       JOIN users u ON r.user_id = u.id 
       WHERE r.complaint_id = ? 
       ORDER BY r.created_at ASC`,
      [complaint_id],
      (err, responses) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        res.json(responses);
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}; 