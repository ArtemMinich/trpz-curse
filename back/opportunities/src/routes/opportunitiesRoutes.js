const express = require('express');
const router = express.Router();
const opportunitiesController = require('../controllers/opportunitiesController');

router.get('/opportunities', opportunitiesController.getOpportunities);

router.get('/opportunities/:id', opportunitiesController.getOpportunityById);

router.post('/opportunities/parse', opportunitiesController.triggerParsing);

module.exports = router;
