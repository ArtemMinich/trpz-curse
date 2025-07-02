# User Auth Backend

Backend для модуля реєстрації та входу користувача з використанням Node.js, Express.js, MongoDB та JWT.

## Технології

- **Backend**: Node.js + Express.js
- **База даних**: MongoDB + Mongoose
- **Захист паролів**: bcrypt
- **Авторизація**: JWT
- **Валідація**: express-validator

## Структура проекту

```
user-auth/
├── config/
│   └── database.js          # Конфігурація MongoDB
├── controllers/
│   └── authController.js    # Контролери для авторизації
├── middleware/
│   ├── auth.js             # Middleware для JWT авторизації
│   └── validation.js       # Валідація даних
├── models/
│   └── User.js             # Модель користувача
├── routes/
│   └── auth.js             # API маршрути
├── .env                    # Змінні середовища
├── package.json
├── server.js               # Головний файл сервера
└── README.md
```

## Встановлення та запуск

### Локальний запуск

1. Встановіть залежності:
```bash
npm install
```

2. Налаштуйте змінні середовища у файлі `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/user-auth
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d
```

3. Запустіть MongoDB

4. Запустіть сервер:
```bash
# Для розробки
npm run dev

# Для продакшену
npm start
```

### Docker запуск

1. Запустіть з Docker Compose:
```bash
docker-compose up -d
```

2. Зупинити:
```bash
docker-compose down
```

3. Переглянути логи:
```bash
docker-compose logs -f app
```

## API Endpoints

### POST /api/auth/register
Реєстрація нового користувача

**Тіло запиту:**
```json
{
  "name": "Іван Петренко",
  "email": "ivan@example.com",
  "password": "password123",
  "region": "Київ",
  "interests": ["Технології", "Спорт"],
  "educationLevel": "Бакалавр"
}
```

### POST /api/auth/login
Вхід користувача

**Тіло запиту:**
```json
{
  "email": "ivan@example.com",
  "password": "password123"
}
```

### GET /api/auth/profile
Отримання профілю користувача (потрібен токен)

**Заголовки:**
```
Authorization: Bearer <jwt_token>
```

### PUT /api/auth/profile
Оновлення профілю користувача (потрібен токен)

**Заголовки:**
```
Authorization: Bearer <jwt_token>
```

**Тіло запиту (всі поля опціональні):**
```json
{
  "name": "Нове ім'я",
  "email": "new@example.com",
  "region": "Львів",
  "interests": ["Технології", "Мистецтво"],
  "educationLevel": "Магістр"
}
```

### POST /api/auth/upload-avatar
Завантаження аватара (потрібен токен)

**Заголовки:**
```
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
```

**Тіло запиту:**
- Поле `avatar` з файлом зображення
- Максимальний розмір: 5MB
- Формати: JPG, PNG, GIF, WebP

### GET /api/auth/avatar/:userId
Отримання аватара користувача

**Параметри:**
- `userId` - ID користувача

## Валідація

- **Ім'я**: мінімум 2 символи
- **Email**: валідний формат email
- **Пароль**: мінімум 6 символів
- **Регіон**: один з: Київ, Львів, Харків, Одеса, Дніпро, Інший
- **Інтереси**: масив з валідних інтересів
- **Рівень освіти**: один з: Середня, Бакалавр, Магістр, Доктор наук