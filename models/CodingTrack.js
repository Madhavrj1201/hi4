const mongoose = require('mongoose');

const codingTrackSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  category: {
    type: String,
    enum: ['DSA', 'Web Dev', 'Python', 'Java'],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  modules: [{
    title: String,
    description: String,
    content: String,
    problems: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Problem'
    }]
  }],
  enrolledStudents: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    progress: {
      completedModules: [Number],
      completedProblems: [mongoose.Schema.Types.ObjectId],
      skillScore: Number
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CodingTrack', codingTrackSchema);