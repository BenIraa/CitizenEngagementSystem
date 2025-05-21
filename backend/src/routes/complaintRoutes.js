import express from 'express';
import {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaintStatus,
  addResponse,
  getResponses
} from '../controllers/complaintController.js';
import { auth, adminAuth } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getComplaints);
router.get('/:id', getComplaintById);
router.get('/:complaint_id/responses', getResponses);

// Protected routes
router.post('/', auth, createComplaint);
router.post('/:complaint_id/responses', auth, addResponse);

// Admin routes
router.patch('/:id/status', adminAuth, updateComplaintStatus);

export default router; 