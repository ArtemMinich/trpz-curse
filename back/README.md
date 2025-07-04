# TRPZ Backend Services

Єдиний Docker Compose для запуску всіх бекенд сервісів.

## Запуск

```bash
cd back
docker-compose up -d
```

## Сервіси

- **User Auth**: http://localhost:3001 (внутрішній порт 5000)
- **Opportunities**: http://localhost:3002 (внутрішній порт 3000)
- **Roadmap**: http://localhost:3003 (внутрішній порт 4000)
- **API Gateway**: http://localhost:3000 (Nginx)
- **MongoDB**: localhost:27017

## API Endpoints

Через Nginx (порт 3000):
- `GET/POST /auth/*` → user-auth сервіс
- `GET/POST /opportunities/*` → opportunities сервіс
- `GET/POST /roadmap/*` → roadmap сервіс

## Команди

```bash
# Запуск
docker-compose up -d

# Перегляд логів
docker-compose logs -f

# Зупинка
docker-compose down

# Перебудова
docker-compose up --build
```