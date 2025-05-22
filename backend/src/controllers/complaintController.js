import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./database.sqlite');

export const createComplaint = async (req, res) => {
  const { title, description, category, location, priority } = req.body;
  const userId = req.user.id;

  try {
    db.run(
      'INSERT INTO complaints (user_id, title, description, category, location, priority) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, title, description, category, location, priority],
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
  const { status, category, user_id } = req.query;
  let query = `
    SELECT 
      c.*,
      u.name as citizen_name,
      u.email as citizen_email
    FROM complaints c 
    JOIN users u ON c.user_id = u.id
  `;
  const params = [];

  const conditions = [];
  if (status) {
    conditions.push('c.status = ?');
    params.push(status);
  }
  if (category) {
    conditions.push('c.category = ?');
    params.push(category);
  }
  if (user_id !== undefined) {
    conditions.push('c.user_id = ?');
    params.push(user_id);
  }
  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }
  query += ' ORDER BY c.created_at DESC';

  console.log('Executing query:', query);
  console.log('With params:', params);

  try {
    db.all(query, params, (err, complaints) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ 
          error: 'Database error',
          details: err.message 
        });
      }

      if (!complaints || complaints.length === 0) {
        console.log('No complaints found');
        return res.json([]);
      }

      try {
        // Format the dates in ISO format
        const formattedComplaints = complaints.map(complaint => {
          console.log('Processing complaint:', complaint);
          return {
            ...complaint,
            createdAt: complaint.created_at ? new Date(complaint.created_at).toISOString() : null,
            updatedAt: complaint.updated_at ? new Date(complaint.updated_at).toISOString() : null,
            citizenId: complaint.user_id,
            citizenName: complaint.citizen_name,
            citizenEmail: complaint.citizen_email,
            assignedAgencyName: null // We'll add this back when we have the agencies table
          };
        });
        console.log('Sending response with', formattedComplaints.length, 'complaints');
        res.json(formattedComplaints);
      } catch (formatError) {
        console.error('Error formatting complaints:', formatError);
        res.status(500).json({ 
          error: 'Error formatting complaints',
          details: formatError.message 
        });
      }
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ 
      error: 'Server error',
      details: error.message 
    });
  }
};

export const getComplaintById = async (req, res) => {
  const { id } = req.params;

  try {
    db.get(
      `SELECT 
        c.*,
        u.name as citizen_name,
        u.email as citizen_email
       FROM complaints c 
       JOIN users u ON c.user_id = u.id
       WHERE c.id = ?`,
      [id],
      (err, complaint) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ 
            error: 'Database error',
            details: err.message 
          });
        }
        if (!complaint) {
          return res.status(404).json({ error: 'Complaint not found' });
        }
        // Format the dates in ISO format
        const formattedComplaint = {
          ...complaint,
          createdAt: complaint.created_at ? new Date(complaint.created_at).toISOString() : null,
          updatedAt: complaint.updated_at ? new Date(complaint.updated_at).toISOString() : null,
          citizenId: complaint.user_id,
          citizenName: complaint.citizen_name,
          citizenEmail: complaint.citizen_email,
          assignedAgencyName: null // We'll add this back when we have the agencies table
        };
        res.json(formattedComplaint);
      }
    );
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ 
      error: 'Server error',
      details: error.message 
    });
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
      `SELECT r.*, u.name as user_name, u.role as user_role
       FROM responses r 
       JOIN users u ON r.user_id = u.id 
       WHERE r.complaint_id = ? 
       ORDER BY r.created_at ASC`,
      [complaint_id],
      (err, responses) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        // Format the dates in ISO format
        const formattedResponses = responses.map(response => ({
          ...response,
          timestamp: new Date(response.created_at).toISOString(),
          userName: response.user_name,
          userRole: response.user_role
        }));
        res.json(formattedResponses);
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}; 