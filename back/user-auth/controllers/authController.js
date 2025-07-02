const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

// Генерація JWT токену
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Реєстрація користувача
const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, region, interests, educationLevel } = req.body;

    // Перевірка чи користувач вже існує
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Користувач з таким email вже існує' });
    }

    // Створення нового користувача
    const user = await User.create({
      name,
      email,
      password,
      region,
      interests,
      educationLevel
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        region: user.region,
        interests: user.interests,
        educationLevel: user.educationLevel
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера', error: error.message });
  }
};

// Вхід користувача
const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Пошук користувача
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Невірний email або пароль' });
    }

    // Перевірка паролю
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Невірний email або пароль' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        region: user.region,
        interests: user.interests,
        educationLevel: user.educationLevel
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера', error: error.message });
  }
};

// Отримання профілю користувача
const getProfile = async (req, res) => {
  try {
    res.json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        region: req.user.region,
        interests: req.user.interests,
        educationLevel: req.user.educationLevel,
        avatar: req.user.avatar,
        createdAt: req.user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера', error: error.message });
  }
};

// Оновлення профілю користувача
const updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, region, interests, educationLevel } = req.body;
    const userId = req.user._id;

    // Перевірка чи новий email не зайнятий іншим користувачем
    if (email && email !== req.user.email) {
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email вже використовується іншим користувачем' });
      }
    }

    // Оновлення користувача
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, region, interests, educationLevel },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Профіль успішно оновлено',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        region: updatedUser.region,
        interests: updatedUser.interests,
        educationLevel: updatedUser.educationLevel,
        createdAt: updatedUser.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера', error: error.message });
  }
};

// Завантаження аватара
const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Файл не завантажено' });
    }

    const avatarPath = `/uploads/avatars/${req.file.filename}`;
    
    // Оновлення користувача з новим аватаром
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: avatarPath },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Аватар успішно завантажено',
      avatar: avatarPath,
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        region: updatedUser.region,
        interests: updatedUser.interests,
        educationLevel: updatedUser.educationLevel,
        avatar: updatedUser.avatar
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера', error: error.message });
  }
};

// Отримання аватара
const getAvatar = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select('avatar');
    
    if (!user || !user.avatar) {
      return res.status(404).json({ message: 'Аватар не знайдено' });
    }

    res.json({
      success: true,
      avatar: user.avatar
    });
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера', error: error.message });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  uploadAvatar,
  getAvatar
};