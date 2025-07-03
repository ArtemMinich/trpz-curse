const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['job', 'course', 'news', 'project']
  },
  tags: {
    type: [String],
    default: []
  },
  region: {
    type: String,
    required: true,
    trim: true
  },
  link: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

opportunitySchema.index({ type: 1 });
opportunitySchema.index({ region: 1 });
opportunitySchema.index({ tags: 1 });

const Opportunity = mongoose.model('Opportunity', opportunitySchema);

module.exports = Opportunity;
