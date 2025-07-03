const axios = require('axios');
const mongoose = require('mongoose');
const Opportunity = require('../models/opportunityModel');

const fetchOpportunitiesFromSources = async () => {
  console.log('Fetching opportunities from real sources...');

  try {
    const opportunities = [];

    const jobsResponse = await fetchJobs();
    opportunities.push(...jobsResponse);

    const coursesResponse = await fetchCourses();
    opportunities.push(...coursesResponse);

    const newsResponse = await fetchNews();
    opportunities.push(...newsResponse);

    const projectsResponse = await fetchProjects();
    opportunities.push(...projectsResponse);

    return opportunities;
  } catch (error) {
    console.error('Error fetching opportunities from sources:', error);
    console.log('No data could be fetched from any source.');
    return [];
  }
};

const fetchJobs = async () => {
  try {
    const remoteOkUrl = 'https://remoteok.io/api';
    const response = await axios.get(remoteOkUrl);

    const jobs = response.data.slice(1);

    const limit = 5;
    return jobs.map(job => ({
      title: job.position || 'Unknown Position',
      description: job.description || 'No description available',
      type: 'job',
      tags: [job.tags || 'IT'].flat(),
      region: job.location || 'Remote',
      link: job.url || `https://remoteok.io/l/${job.id}`,
      date: new Date(job.date)
    })).slice(0, limit);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }
};

const fetchCourses = async () => {
  try {
    const courseraUrl = 'https://api.coursera.org/api/courses.v1';
    const courseraParams = 'fields=name,description,photoUrl&limit=5';
    const response = await axios.get(`${courseraUrl}?${courseraParams}`);

    const courses = response.data.elements || [];

    const limit = 5;
    return courses.map(course => ({
      title: course.name || 'Unknown Course',
      description: course.description || 'No description available',
      type: 'course',
      tags: ['education', 'online learning'],
      region: 'Online',
      link: `https://www.coursera.org/learn/${course.slug}`,
      date: new Date()
    })).slice(0, limit);
  } catch (error) {
    console.error('Error fetching courses:', error);
    return [];
  }
};

const fetchNews = async () => {
  try {
    const newsApiKey = process.env.NEWS_API_KEY;

    if (!newsApiKey) {
      console.log('No NEWS_API_KEY environment variable found. Using alternative news source.');
      return await fetchAlternativeNews();
    }

    const newsApiUrl = 'https://newsapi.org/v2/top-headlines';
    const newsApiParams = 'category=technology&language=en';
    const response = await axios.get(`${newsApiUrl}?${newsApiParams}&apiKey=${newsApiKey}`);

    const news = response.data.articles || [];

    const limit = 5;
    return news.map(article => ({
      title: article.title || 'Unknown News',
      description: article.description || 'No description available',
      type: 'news',
      tags: ['technology', 'news'],
      region: article.source.name || 'Global',
      link: article.url,
      date: new Date(article.publishedAt)
    })).slice(0, limit);
  } catch (error) {
    console.error('Error fetching news:', error);
    return await fetchAlternativeNews();
  }
};

const fetchAlternativeNews = async () => {
  try {
    const hackerNewsStoriesUrl = 'https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty';
    const topStoriesResponse = await axios.get(hackerNewsStoriesUrl);

    const limit = 5;
    const topStoryIds = topStoriesResponse.data.slice(0, limit);

    const hackerNewsItemUrl = 'https://hacker-news.firebaseio.com/v0/item';
    const newsPromises = topStoryIds.map(async (id) => {
      const storyResponse = await axios.get(`${hackerNewsItemUrl}/${id}.json?print=pretty`);
      const story = storyResponse.data;

      return {
        title: story.title || 'Unknown News',
        description: story.text || `Discussion with ${story.descendants || 0} comments`,
        type: 'news',
        tags: ['technology', 'hacker news'],
        region: 'Global',
        link: story.url || `https://news.ycombinator.com/item?id=${id}`,
        date: new Date(story.time * 1000)
      };
    });

    return await Promise.all(newsPromises);
  } catch (error) {
    console.error('Error fetching alternative news:', error);
    return [];
  }
};

const fetchProjects = async () => {
  try {
    const githubApiUrl = 'https://api.github.com/search/repositories';
    const githubApiParams = 'q=stars:>1000&sort=stars&order=desc';
    const response = await axios.get(`${githubApiUrl}?${githubApiParams}`);

    const projects = response.data.items || [];

    const limit = 5;
    return projects.map(project => ({
      title: project.name || 'Unknown Project',
      description: project.description || 'No description available',
      type: 'project',
      tags: ['open source', project.language || 'IT'],
      region: 'Global',
      link: project.html_url,
      date: new Date(project.created_at)
    })).slice(0, limit);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
};

const parseOpportunities = async () => {
  try {
    const opportunities = await fetchOpportunitiesFromSources();

    for (const opportunity of opportunities) {
      const existingOpportunity = await Opportunity.findOne({
        title: opportunity.title,
        link: opportunity.link
      });

      if (!existingOpportunity) {
        const newOpportunity = new Opportunity(opportunity);
        await newOpportunity.save();
        console.log(`Added new opportunity: ${opportunity.title}`);
      } else {
        console.log(`Opportunity already exists: ${opportunity.title}`);
      }
    }

    console.log('Parsing completed successfully');
    return { success: true, count: opportunities.length };
  } catch (error) {
    console.error('Error parsing opportunities:', error);
    throw error;
  }
};

const getOpportunities = async (filters = {}) => {
  try {
    const query = {};

    if (filters.region) {
      query.region = filters.region;
    }

    if (filters.type) {
      query.type = filters.type;
    }

    if (filters.tags && filters.tags.length > 0) {
      const tagsArray = typeof filters.tags === 'string' 
        ? [filters.tags] 
        : filters.tags;

      query.tags = { $in: tagsArray };
    }

    const opportunities = await Opportunity.find(query)
      .sort({ date: -1 })
      .exec();

    return opportunities;
  } catch (error) {
    console.error('Error getting opportunities:', error);
    throw error;
  }
};

const getOpportunityById = async (id) => {
  try {
    // Validate if the id is a valid MongoDB ObjectId
    if (!mongoose.isValidObjectId(id)) {
      throw new Error('Invalid ObjectId format');
    }

    const opportunity = await Opportunity.findById(id);
    return opportunity;
  } catch (error) {
    console.error(`Error getting opportunity with ID ${id}:`, error);
    throw error;
  }
};

module.exports = {
  parseOpportunities,
  getOpportunities,
  getOpportunityById
};
