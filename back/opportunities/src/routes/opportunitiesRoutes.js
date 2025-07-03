const express = require('express');
const router = express.Router();
const opportunitiesController = require('../controllers/opportunitiesController');

router.get('/', opportunitiesController.getOpportunities);

router.get('/:id', opportunitiesController.getOpportunityById);

router.post('/parse', opportunitiesController.triggerParsing);

module.exports = router;
