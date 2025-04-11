const express = require('express');
const router = express.Router();

// Faculty dashboard
router.get('/dashboard', (req, res) => {
  res.render('faculty/dashboard');
});

// Course management
router.get('/course-management', (req, res) => {
  res.render('faculty/course-management');
});

module.exports = router;