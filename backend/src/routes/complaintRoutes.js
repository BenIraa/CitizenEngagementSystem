import express from 'express';
import { auth, adminAuth } from '../middleware/auth.js';

const router = express.Router();

// This function will be called from server.js with the db instance
const complaintRoutes = (complaintController) => {
  // Public routes
  router.get('/', complaintController.getComplaints);
  router.get('/:id', complaintController.getComplaintById);
  router.get('/:complaint_id/responses', complaintController.getResponses);

  // Protected routes
  router.post('/', auth, complaintController.createComplaint);
  router.post('/:complaint_id/responses', auth, complaintController.addResponse);

  // Admin routes
  router.patch('/:id/status', adminAuth, complaintController.updateComplaintStatus);
  router.patch('/:id/priority', adminAuth, complaintController.updateComplaintPriority);
  router.patch('/:id/assign', adminAuth, complaintController.assignComplaint);
  router.delete('/:id', adminAuth, complaintController.deleteComplaint);
  
  return router;
};

export default complaintRoutes; 