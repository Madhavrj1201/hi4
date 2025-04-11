const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  },
  category: {
    type: String,
    required: true
  },
  testCases: [{
    input: String,
    expectedOutput: String,
    isHidden: Boolean
  }],
  solutions: [{
    language: String,
    code: String,
    isOfficial: Boolean
  }],
  hints: [String],
  submissions: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    code: String,
    language: String,
    status: String,
    runtime: Number,
    memory: Number,
    submittedAt: {
      type: Date,
      default: Date.now
    }
  }],
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Problem', problemSchema);