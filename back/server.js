const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Temporary in-memory storage
const opportunities = [
  {
    title: "IT курси у Києві",
    description: "Безкоштовні курси програмування",
    type: "course",
    tags: ["IT", "education"],
    region: "Київ",
    link: "https://example.com/courses"
  },
  {
    title: "Робота у Львові",
    description: "Позиція Junior розробника",
    type: "job",
    tags: ["IT", "junior"],
    region: "Львів",
    link: "https://example.com/job"
  }
];

const roadmaps = {};

// Routes
app.get('/api/opportunities', (req, res) => {
  res.json(opportunities);
});

app.get('/api/opportunities/region/:region', (req, res) => {
  const regionOpps = opportunities.filter(opp => opp.region === req.params.region);
  res.json(regionOpps);
});

app.get('/api/roadmap/:userId', (req, res) => {
  const userId = req.params.userId;
  if (!roadmaps[userId]) {
    roadmaps[userId] = {
      steps: [
        {
          title: "Вивчення основ програмування",
          description: "HTML, CSS, JavaScript",
          status: "not_started"
        },
        {
          title: "Фреймворки",
          description: "React або Vue.js",
          status: "not_started"
        },
        {
          title: "Практичний проект",
          description: "Створення власного портфоліо",
          status: "not_started"
        }
      ]
    };
  }
  res.json(roadmaps[userId]);
});

app.post('/api/roadmap/:userId', (req, res) => {
  const userId = req.params.userId;
  roadmaps[userId] = req.body;
  res.json(roadmaps[userId]);
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
