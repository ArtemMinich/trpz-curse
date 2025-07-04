const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');

const app = express();

// Middleware
app.use(express.json());

// Routes
const roadmapRoutes = require('./src/routes/roadmapRoutes');
app.use('/roadmap', roadmapRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Visibility service running on port ${PORT}`);
});
