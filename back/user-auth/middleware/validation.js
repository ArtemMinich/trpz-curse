const { body } = require('express-validator');

const registerValidation = [
  body('name')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Ім\'я повинно містити мінімум 2 символи'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Невірний формат email'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Пароль повинен містити мінімум 6 символів'),
  
  body('region')
    .isIn(['Київ', 'Львів', 'Харків', 'Одеса', 'Дніпро', 'Інший'])
    .withMessage('Невірний регіон'),
  
  body('interests')
    .isArray({ min: 1 })
    .withMessage('Оберіть хоча б один інтерес')
    .custom((interests) => {
      const validInterests = ['Технології', 'Спорт', 'Мистецтво', 'Наука', 'Подорожі', 'Музика', 'Кіно', 'Книги'];
      return interests.every(interest => validInterests.includes(interest));
    })
    .withMessage('Невірні інтереси'),
  
  body('educationLevel')
    .isIn(['Середня', 'Бакалавр', 'Магістр', 'Доктор наук'])
    .withMessage('Невірний рівень освіти')
];

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Невірний формат email'),
  
  body('password')
    .notEmpty()
    .withMessage('Пароль є обов\'язковим')
];

const updateProfileValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Ім\'\u044f повинно містити мінімум 2 символи'),
  
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Невірний формат email'),
  
  body('region')
    .optional()
    .isIn(['Київ', 'Львів', 'Харків', 'Одеса', 'Дніпро', 'Інший'])
    .withMessage('Невірний регіон'),
  
  body('interests')
    .optional()
    .isArray({ min: 1 })
    .withMessage('Оберіть хоча б один інтерес')
    .custom((interests) => {
      const validInterests = ['Технології', 'Спорт', 'Мистецтво', 'Наука', 'Подорожі', 'Музика', 'Кіно', 'Книги'];
      return interests.every(interest => validInterests.includes(interest));
    })
    .withMessage('Невірні інтереси'),
  
  body('educationLevel')
    .optional()
    .isIn(['Середня', 'Бакалавр', 'Магістр', 'Доктор наук'])
    .withMessage('Невірний рівень освіти')
];

module.exports = {
  registerValidation,
  loginValidation,
  updateProfileValidation
};