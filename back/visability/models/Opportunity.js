const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['job', 'course', 'news', 'project'],
    required: true
  },
  tags: [{
    type: String
  }],
  region: {
    type: String,
    required: true
  },
  link: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Opportunity', opportunitySchema);
