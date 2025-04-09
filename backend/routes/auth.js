const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');  // Assuming your User model is located here
const router = express.Router();

// Registration Route
router.post('/register', async (req, res) => {
    const { firstName, lastName, email, phone, dob, address, gender, password, confirmPassword, role } = req.body;
  
    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }
  
    try {
      // Check if email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create new user object
      const newUser = new User({
        firstName,
        lastName,
        email,
        phone,
        dob,
        address,
        gender,
        password: hashedPassword,
        role,
      });
  
      // Save new user to the database
      await newUser.save();
  
      res.status(201).json({ message: 'Registration successful!' });  // Success response
    } catch (err) {
      console.error('Error during registration:', err);  // Log the error for debugging
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: 'Invalid email or password' });
  
      // Compare the password with the hashed one stored in the database
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });
  
      // Check the role if needed (optional)
      if (user.role !== 'Doctor') {
        return res.status(400).json({ message: 'You are not authorized as a Doctor' });
      }
  
      // Generate JWT token (including role in payload)
      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
  
      // Send token and user info in the response
      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          name: user.firstName + ' ' + user.lastName,
          email: user.email,
          role: user.role,
        }
      });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });
  

module.exports = router;
