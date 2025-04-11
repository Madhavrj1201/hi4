const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  description: String,
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['academic', 'coding'],
    required: true
  },
  content: [{
    title: String,
    type: String,
    content: String,
    attachments: [String],
    dueDate: Date,
    videoUrl: String,
    quizzes: [{
      question: String,
      options: [String],
      correctAnswer: Number,
      points: Number
    }]
  }],
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  attendance: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Attendance'
  }],
  assignments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment'
  }],
  schedule: [{
    day: String,
    startTime: String,
    endTime: String,
    room: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Course', courseSchema);