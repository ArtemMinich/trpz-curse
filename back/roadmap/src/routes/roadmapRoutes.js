const express = require('express');
const router = express.Router();
const roadmapController = require('../controllers/roadmapController');

// Get roadmap for user
router.get('/:userId', roadmapController.getRoadmap);

// Create or update roadmap
router.post('/:userId', roadmapController.updateRoadmap);

module.exports = router;
