import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// 1. Register User
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user (password is hashed automatically by our User model hook)
    const user = await User.create({ name, email, password });

    // Return user info without password
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email
    });
  } catch (error) {
    console.error("Register Error:", error.message);
    res.status(400).json({ message: error.message });
  }
};

// 2. Login User
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    // Check if user exists and password matches
    if (user && (await bcrypt.compare(password, user.password))) {
      // Create JWT Token
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
      );

      res.json({ token });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};