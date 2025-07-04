const axios = require('axios');
const Roadmap = require('../models/Roadmap');

class RoadmapService {
  async getRoadmap(userId) {
    return await Roadmap.findOne({ userId });
  }

  async createOrUpdateRoadmap(userId, steps) {
    const roadmap = await Roadmap.findOne({ userId });
    if (roadmap) {
      roadmap.steps = steps;
      return await roadmap.save();
    }
    return await Roadmap.create({ userId, steps });
  }

  async generateInitialRoadmap(userId) {
    try {
      const USER_AUTH_URL = process.env.USER_AUTH_URL;
      const OPPORTUNITIES_URL = process.env.OPPORTUNITIES_URL;
      // Get user profile from auth service
      const userResponse = await axios.get(`${USER_AUTH_URL}/users/${userId}`);
      const user = userResponse.data;

      // Get opportunities from opportunities service
      const opportunitiesResponse = await axios.get(`${OPPORTUNITIES_URL}/`);
      const opportunities = opportunitiesResponse.data;

      // Generate roadmap steps based on user interests and available opportunities
      const steps = this._generateSteps(user, opportunities);

      return await this.createOrUpdateRoadmap(userId, steps);
    } catch (error) {
      console.error('Error generating roadmap:', error);
      throw error;
    }
  }

  _generateSteps(user, opportunities) {
    // Example steps generation logic
    const steps = [
      {
        title: 'Визначення напрямку',
        description: 'Проаналізуйте свої інтереси та оберіть основний напрямок розвитку',
        status: 'not_started'
      },
      {
        title: 'Базові навички',
        description: 'Опануйте основні навички у обраному напрямку',
        status: 'not_started'
      },
      {
        title: 'Практичний досвід',
        description: 'Знайдіть можливості для практики (стажування, проекти)',
        status: 'not_started'
      },
      {
        title: 'Networking',
        description: 'Приєднайтесь до професійних спільнот та відвідуйте галузеві заходи',
        status: 'not_started'
      },
      {
        title: 'Портфоліо',
        description: 'Створіть портфоліо ваших проектів та досягнень',
        status: 'not_started'
      }
    ];

    return steps;
  }
}

module.exports = new RoadmapService();
