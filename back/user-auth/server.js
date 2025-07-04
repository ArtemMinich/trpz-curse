require('dotenv').config();
const express = require('express');
const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');

const app = express();

// Підключення до бази даних
connectDB();

// Middleware
app.use(express.json());
app.use('/auth/uploads', express.static('uploads'));

// Маршрути
app.use(authRoutes);

// Базовий маршрут
app.get('/', (req, res) => {
  res.json({ message: 'User Auth API працює!' });
});

// Обробка помилок 404
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Маршрут не знайдено' });
});

// Глобальна обробка помилок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Щось пішло не так!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Сервер запущено на порті ${PORT}`);
});