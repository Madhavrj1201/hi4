const express = require('express');
const passport = require('passport');
const User = require('../models/User');
const router = express.Router();

// Login page
router.get('/login', (req, res) => {
  res.render('auth/login', { 
    title: 'Login - Campus Bridge',
    user: req.user 
  });
});

// Register page
router.get('/register', (req, res) => {
  res.render('auth/register', { 
    title: 'Register - Campus Bridge',
    user: req.user 
  });
});

// Handle login
router.post('/login', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/auth/login',
  failureFlash: true
}));

// Handle register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.redirect('/auth/register');
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
      role
    });

    await user.save();
    res.redirect('/auth/login');
  } catch (err) {
    console.error(err);
    res.redirect('/auth/register');
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error(err);
    }
    res.redirect('/');
  });
});

module.exports = router;