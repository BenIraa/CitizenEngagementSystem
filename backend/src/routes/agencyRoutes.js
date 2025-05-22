import express from 'express';
import { adminAuth } from '../middleware/auth.js';

const router = express.Router();

// This function will be called from server.js with the db instance
const agencyRoutes = (agencyController) => {
  // Admin route to get all agencies
  router.get('/', adminAuth, agencyController.getAgencies);
  // Admin route to create a new agency
  router.post('/', adminAuth, agencyController.createAgency);

  return router;
};

export default agencyRoutes; 