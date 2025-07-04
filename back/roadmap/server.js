const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const roadmapRoutes = require('./src/routes/roadmapRoutes');
app.use('/api/roadmap', roadmapRoutes);

// Connect to MongoDB
mongoose.connect('mongodb://mongodb:27017/trpz', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Visibility service running on port ${PORT}`);
});
