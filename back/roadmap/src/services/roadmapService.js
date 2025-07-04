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
      // Get user profile from auth service
      const userResponse = await axios.get(`http://user-auth:3001/api/users/${userId}`);
      const user = userResponse.data;

      // Get opportunities from opportunities service
      const opportunitiesResponse = await axios.get('http://opportunities:3002/api/opportunities');
      const opportunities = opportunitiesResponse.data;

      // Generate roadmap steps based on user interests and available opportunities
      const steps = await this._generateSteps(user, opportunities);

      return await this.createOrUpdateRoadmap(userId, steps);
    } catch (error) {
      console.error('Error generating roadmap:', error);
      throw error;
    }
  }

  async _generateSteps(user, opportunities) {
    try {
      // Prepare the prompt based on user and opportunities
      const prompt = `Generate a career development roadmap for a user with the following interests: ${user.interests}. 
      Consider these available opportunities: ${JSON.stringify(opportunities)}. 
      Generate 5 specific steps for career development.`;

      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: 'deepseek/deepseek-r1-0528',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ]
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': process.env.SITE_URL || 'http://localhost:3003',
            'X-Title': process.env.SITE_NAME || 'Career Roadmap'
          }
        }
      );

      // Parse the AI response and format it into steps
      const aiResponse = response.data.choices[0].message.content;
      const parsedSteps = this._parseAIResponseToSteps(aiResponse);

      return parsedSteps;
    } catch (error) {
      console.error('Error generating steps with AI:', error);
      // Fallback to default steps if AI generation fails
      return [
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
    }
  }

  _parseAIResponseToSteps(aiResponse) {
    try {
      // Attempt to parse if response is JSON
      const parsed = JSON.parse(aiResponse);
      if (Array.isArray(parsed)) {
        return parsed.map(step => ({
          ...step,
          status: 'not_started'
        }));
      }
    } catch (e) {
      // If response is not JSON, try to parse text format
      const steps = aiResponse
        .split('\n')
        .filter(line => line.trim())
        .slice(0, 5)
        .map(step => ({
          title: step.split(':')[0]?.trim() || 'Step',
          description: step.split(':')[1]?.trim() || step,
          status: 'not_started'
        }));

      return steps;
    }
  }
}

module.exports = new RoadmapService();
