const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');  // Assuming this is where your User model is located

const router = express.Router();

// Registration Route
router.post('/register', async (req, res) => {
    const { firstName, lastName, email, phone, dob, address, gender, password, confirmPassword, role, specialization } = req.body;
  
    // Validate that passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }
  
    try {
      // Check if the email already exists in the database
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // If the user is a doctor, make sure specialization is provided
      if (role === 'Doctor' && !specialization) {
        return res.status(400).json({ message: 'Specialization is required for Doctor' });
      }
  
      // Create a new user instance
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
        specialization: role === 'Doctor' ? specialization : undefined,  // Set specialization only for Doctor
      });
  
      // Save the new user to the database
      await newUser.save();
  
      res.status(201).json({ message: 'Registration successful!' });
    } catch (err) {
      console.error('Error during registration:', err);  // Log the actual error
      res.status(500).json({ message: 'Server error' });
    }
  });
  

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

try {
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare the passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send token and user info
    res.json({ message: 'Login successful', token, user: { id: user._id, email: user.email } });
} catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
}
});

module.exports = router;
