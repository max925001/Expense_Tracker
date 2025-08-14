import express from 'express';
import upload from '../middlewares/multer.middleware.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import {
  register,
  login,
  getUserDetail,
  logout,
  editProfile,
} from '../controllers/userController.js';

const router = express.Router();

router.post('/register', upload.single('profilePic'), register);
router.post('/login', login);
router.get('/me', authMiddleware, getUserDetail);
router.post('/logout', authMiddleware, logout);
router.put('/edit', authMiddleware, upload.single('profilePic'), editProfile);

export default router;