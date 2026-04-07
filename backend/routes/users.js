import express from 'express';
import User from '../models/User.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Get all users (admin only)
router.get('/', protect, admin, async (req, res) => {
  const users = await User.find({}).select('-password');
  res.json(users);
});

// Delete a user (admin only)
router.delete('/:id', protect, admin, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    await user.deleteOne();
    res.json({ message: 'User removed' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

export default router;