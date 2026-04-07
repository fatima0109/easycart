import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: 'User already exists' });
  const user = await User.create({ name, email, password });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
  res.status(201).json({ _id: user._id, name, email, role: user.role, token });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.json({ _id: user._id, name: user.name, email, role: user.role, token });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
});

export default router;