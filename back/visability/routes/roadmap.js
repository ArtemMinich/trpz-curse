const express = require('express');
const router = express.Router();
const Roadmap = require('../../models/Roadmap');

// GET user's roadmap
router.get('/:userId', async (req, res) => {
  try {
    const roadmap = await Roadmap.findOne({ userId: req.params.userId });
    if (!roadmap) {
      return res.status(404).json({ message: 'Roadmap not found' });
    }
    res.json(roadmap);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create or update roadmap
router.post('/:userId', async (req, res) => {
  try {
    let roadmap = await Roadmap.findOne({ userId: req.params.userId });
    
    if (roadmap) {
      // Update existing roadmap
      roadmap.steps = req.body.steps;
      await roadmap.save();
    } else {
      // Create new roadmap
      roadmap = new Roadmap({
        userId: req.params.userId,
        steps: req.body.steps
      });
      await roadmap.save();
    }
    
    res.json(roadmap);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
