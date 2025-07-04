require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cron = require('node-cron');
const opportunitiesRoutes = require('./src/routes/opportunitiesRoutes');
const opportunitiesService = require('./src/services/opportunitiesService');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
const seedInitialData = async () => {
  try {
    const Opportunity = require('./src/models/opportunityModel');
    const count = await Opportunity.countDocuments();

    if (count === 0) {
      console.log('No opportunities found in the database. Seeding initial data...');
      await opportunitiesService.parseOpportunities();
      console.log('Initial data seeding completed.');
    } else {
      console.log(`Database already contains ${count} opportunities. Skipping initial data seeding.`);
    }
  } catch (error) {
    console.error('Error seeding initial data:', error);
  }
};
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/opportunities';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB:', mongoURI);
    seedInitialData();
  })
  .catch(err => console.error('Could not connect to MongoDB', err));

app.use(opportunitiesRoutes);

cron.schedule(process.env.CRON_SCHEDULE || '0 */6 * * *', async () => {
  console.log('Running opportunities parsing job...');
  try {
    await opportunitiesService.parseOpportunities();
    console.log('Opportunities parsing job completed successfully');
  } catch (error) {
    console.error('Error in opportunities parsing job:', error);
  }
});

const HOST = process.env.HOST || '0.0.0.0';
app.listen(PORT, HOST, () => {
  console.log(`Server is running on ${HOST}:${PORT}`);
});
