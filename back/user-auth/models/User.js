const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Ім\'я є обов\'язковим'],
    trim: true,
    minlength: [2, 'Ім\'я повинно містити мінімум 2 символи']
  },
  email: {
    type: String,
    required: [true, 'Email є обов\'язковим'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Невірний формат email']
  },
  password: {
    type: String,
    required: [true, 'Пароль є обов\'язковим'],
    minlength: [6, 'Пароль повинен містити мінімум 6 символів']
  },
  region: {
    type: String,
    required: [true, 'Регіон є обов\'язковим'],
    enum: ['Київ', 'Львів', 'Харків', 'Одеса', 'Дніпро', 'Інший']
  },
  interests: [{
    type: String,
    enum: ['Технології', 'Спорт', 'Мистецтво', 'Наука', 'Подорожі', 'Музика', 'Кіно', 'Книги']
  }],
  educationLevel: {
    type: String,
    required: [true, 'Рівень освіти є обов\'язковим'],
    enum: ['Середня', 'Бакалавр', 'Магістр', 'Доктор наук']
  },
  avatar: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Хешування паролю перед збереженням
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Метод для перевірки паролю
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);