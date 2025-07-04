const roadmapService = require('../services/roadmapService');

class RoadmapController {
  async getRoadmap(req, res) {
    try {
      const { userId } = req.params;
      let roadmap = await roadmapService.getRoadmap(userId);
      
      if (!roadmap) {
        roadmap = await roadmapService.generateInitialRoadmap(userId);
      }

      res.json(roadmap);
    } catch (error) {
      console.error('Error getting roadmap:', error);
      res.status(500).json({ message: 'Error getting roadmap' });
    }
  }

  async updateRoadmap(req, res) {
    try {
      const { userId } = req.params;
      const { steps } = req.body;
      
      const roadmap = await roadmapService.createOrUpdateRoadmap(userId, steps);
      res.json(roadmap);
    } catch (error) {
      console.error('Error updating roadmap:', error);
      res.status(500).json({ message: 'Error updating roadmap' });
    }
  }
}

module.exports = new RoadmapController();
