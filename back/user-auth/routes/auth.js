const express = require('express');
const { register, login, getProfile, updateProfile, uploadAvatar, getAvatar } = require('../controllers/authController');
const { registerValidation, loginValidation, updateProfileValidation } = require('../middleware/validation');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// POST /register - Реєстрація користувача
router.post('/auth/register', registerValidation, register);

// POST /login - Вхід користувача
router.post('/auth/login', loginValidation, login);

// GET /profile - Отримання профілю (захищений маршрут)
router.get('/auth/profile', auth, getProfile);

// PUT /profile - Оновлення профілю (захищений маршрут)
router.put('/auth/profile', auth, updateProfileValidation, updateProfile);

// POST /upload-avatar - Завантаження аватара (захищений маршрут)
router.post('/auth/upload-avatar', auth, upload.single('avatar'), uploadAvatar);

// GET /avatar/:userId - Отримання аватара
router.get('/auth/avatar/:userId', getAvatar);

module.exports = router;