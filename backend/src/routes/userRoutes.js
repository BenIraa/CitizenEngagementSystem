import express from 'express';
import { auth, adminAuth } from '../middleware/auth.js';

const router = express.Router();

// This function will be called from server.js with the user controller instance
const userRoutes = (userController) => {
  router.post('/register', userController.register);
  router.post('/login', userController.login);
  router.get('/profile', auth, userController.getProfile);
  router.get('/', adminAuth, userController.getUsers); // Use getUsers instead of getAllUsers

  return router;
};

export default userRoutes; 