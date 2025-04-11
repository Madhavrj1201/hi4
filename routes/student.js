const express = require('express');
const router = express.Router();
const Course = require('../models/Course');

// Middleware to check if user is a student
const isStudent = (req, res, next) => {
  if (req.user && req.user.role === 'student') {
    return next();
  }
  res.redirect('/auth/login');
};

// Student dashboard
router.get('/dashboard', isStudent, async (req, res) => {
  try {
    const enrolledCourses = await Course.find({
      students: req.user._id
    }).populate('instructor', 'profile.firstName profile.lastName');

    res.render('student/dashboard', {
      title: 'Student Dashboard - Campus Bridge',
      user: req.user,
      courses: enrolledCourses
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// View available courses
router.get('/courses', isStudent, async (req, res) => {
  try {
    const courses = await Course.find({
      students: { $ne: req.user._id }
    }).populate('instructor', 'profile.firstName profile.lastName');

    res.render('student/courses', {
      title: 'Available Courses - Campus Bridge',
      user: req.user,
      courses: courses
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Enroll in a course
router.post('/courses/:id/enroll', isStudent, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).send('Course not found');
    }

    // Check if already enrolled
    if (course.students.includes(req.user._id)) {
      return res.status(400).send('Already enrolled');
    }

    course.students.push(req.user._id);
    await course.save();

    res.redirect('/student/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// View course content
router.get('/courses/:id', isStudent, async (req, res) => {
  try {
    const course = await Course.findOne({
      _id: req.params.id,
      students: req.user._id
    }).populate('instructor', 'profile.firstName profile.lastName');

    if (!course) {
      return res.status(404).send('Course not found');
    }

    res.render('student/course-details', {
      title: `${course.title} - Campus Bridge`,
      user: req.user,
      course: course
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;