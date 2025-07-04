const mongoose = require('mongoose');

const roadmapSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  steps: [{
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['not_started', 'in_progress', 'completed'],
      default: 'not_started'
    }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Roadmap', roadmapSchema);
