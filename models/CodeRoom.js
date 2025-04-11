const mongoose = require('mongoose');

const codeRoomSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  problem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem'
  },
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['host', 'participant'],
      default: 'participant'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  code: {
    content: String,
    language: String,
    lastUpdated: Date
  },
  chat: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    message: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['active', 'completed'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CodeRoom', codeRoomSchema);