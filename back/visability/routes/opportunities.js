const express = require('express');
const router = express.Router();
const Opportunity = require('../../models/Opportunity');

// GET all opportunities
router.get('/', async (req, res) => {
  try {
    const opportunities = await Opportunity.find();
    res.json(opportunities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET opportunities by region
router.get('/region/:region', async (req, res) => {
  try {
    const opportunities = await Opportunity.find({ region: req.params.region });
    res.json(opportunities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
