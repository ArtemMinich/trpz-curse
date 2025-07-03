const opportunitiesService = require('../services/opportunitiesService');

const getOpportunities = async (req, res) => {
  try {
    const filters = {
      region: req.query.region,
      type: req.query.type,
      tags: req.query.tags
    };

    const opportunities = await opportunitiesService.getOpportunities(filters);

    res.status(200).json({
      success: true,
      count: opportunities.length,
      data: opportunities
    });
  } catch (error) {
    console.error('Error in getOpportunities controller:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

const getOpportunityById = async (req, res) => {
  try {
    const opportunity = await opportunitiesService.getOpportunityById(req.params.id);

    if (!opportunity) {
      return res.status(404).json({
        success: false,
        error: 'Opportunity not found'
      });
    }

    res.status(200).json({
      success: true,
      data: opportunity
    });
  } catch (error) {
    console.error('Error in getOpportunityById controller:', error);

    if (error.kind === 'ObjectId' || error.message === 'Invalid ObjectId format') {
      return res.status(400).json({
        success: false,
        error: 'Invalid ID format'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

const triggerParsing = async (req, res) => {
  try {
    const result = await opportunitiesService.parseOpportunities();

    res.status(200).json({
      success: true,
      message: 'Parsing process completed successfully',
      result
    });
  } catch (error) {
    console.error('Error in triggerParsing controller:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

module.exports = {
  getOpportunities,
  getOpportunityById,
  triggerParsing
};
