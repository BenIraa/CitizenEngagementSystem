import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./database.sqlite');

export default (db) => ({
  createComplaint: async (req, res) => {
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
  },

  getComplaints: async (req, res) => {
    const { status, category, user_id, assignedAgencyId } = req.query;
    console.log('Backend getComplaints received query params:', req.query);
    let query = `
      SELECT
        c.*,
        u.name as citizen_name,
        u.email as citizen_email,
        a.name as assigned_agency_name
      FROM complaints c
      JOIN users u ON c.user_id = u.id
      LEFT JOIN agencies a ON c.assigned_to = a.id
    `;
    const params = [];

    const conditions = [];
    if (status) {
      conditions.push('c.status IN (' + status.split(',').map(s => '?').join(',') + ')');
      params.push(...status.split(','));
    }
    if (category) {
      conditions.push('c.category IN (' + category.split(',').map(c => '?').join(',') + ')');
      params.push(...category.split(','));
    }
    const { priority } = req.query;
    if (priority) {
      conditions.push('c.priority IN (' + priority.split(',').map(p => '?').join(',') + ')');
      params.push(...priority.split(','));
    }
    if (user_id !== undefined) {
      conditions.push('c.user_id = ?');
      params.push(user_id);
    }
    if (assignedAgencyId !== undefined && assignedAgencyId !== null) {
      conditions.push('c.assigned_to = ?');
      params.push(assignedAgencyId);
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

        console.log('Backend sending', complaints.length, 'complaints.');
        try {
          const formattedComplaints = complaints.map(complaint => {
            return {
              ...complaint,
              createdAt: complaint.created_at ? new Date(complaint.created_at).toISOString() : null,
              updatedAt: complaint.updated_at ? new Date(complaint.updated_at).toISOString() : null,
              citizenId: complaint.user_id,
              citizenName: complaint.citizen_name,
              citizenEmail: complaint.citizen_email,
              assignedTo: complaint.assigned_to,
              assignedAgencyName: complaint.assigned_agency_name
            };
          });
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
  },

  getComplaintById: async (req, res) => {
    const { id } = req.params;

    try {
      db.get(
        `SELECT 
          c.*,
          u.name as citizen_name,
          u.email as citizen_email,
          a.name as assigned_agency_name
         FROM complaints c 
         JOIN users u ON c.user_id = u.id
         LEFT JOIN agencies a ON c.assigned_to = a.id
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
          const formattedComplaint = {
            ...complaint,
            createdAt: complaint.created_at ? new Date(complaint.created_at).toISOString() : null,
            updatedAt: complaint.updated_at ? new Date(complaint.updated_at).toISOString() : null,
            citizenId: complaint.user_id,
            citizenName: complaint.citizen_name,
            citizenEmail: complaint.citizen_email,
            assignedTo: complaint.assigned_to,
            assignedAgencyName: complaint.assigned_agency_name
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
  },

  updateComplaintStatus: async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
      db.run(
        'UPDATE complaints SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [status, id],
        function(err) {
          if (err) {
            return res.status(500).json({ error: 'Error updating complaint status' });
          }
          if (this.changes === 0) {
            return res.status(404).json({ error: 'Complaint not found' });
          }
          res.json({ message: 'Complaint status updated successfully' });
        }
      );
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  },

  updateComplaintPriority: async (req, res) => {
    const { id } = req.params;
    const { priority } = req.body;

    if (!priority) {
      return res.status(400).json({ error: 'Priority is required' });
    }

    try {
      db.run(
        'UPDATE complaints SET priority = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [priority, id],
        function(err) {
          if (err) {
            return res.status(500).json({ error: 'Error updating complaint priority' });
          }
          if (this.changes === 0) {
            return res.status(404).json({ error: 'Complaint not found' });
          }
          res.json({ message: 'Complaint priority updated successfully' });
        }
      );
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  },

  assignComplaint: async (req, res) => {
    const { id } = req.params;
    const { agency_id } = req.body;

    try {
      db.run(
        'UPDATE complaints SET assigned_to = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [agency_id, id],
        function(err) {
          if (err) {
            return res.status(500).json({ error: 'Error assigning complaint' });
          }
          if (this.changes === 0) {
            return res.status(404).json({ error: 'Complaint not found' });
          }
          res.json({ message: 'Complaint assigned successfully' });
        }
      );
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  },

  deleteComplaint: async (req, res) => {
    const { id } = req.params;

    try {
      db.run(
        'DELETE FROM complaints WHERE id = ?',
        [id],
        function(err) {
          if (err) {
            return res.status(500).json({ error: 'Error deleting complaint' });
          }
          if (this.changes === 0) {
            return res.status(404).json({ error: 'Complaint not found' });
          }
          res.json({ message: 'Complaint deleted successfully' });
        }
      );
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  },

  addResponse: async (req, res) => {
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
  },

  getResponses: async (req, res) => {
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
  },
}); 