# trpz-curse

## Запуск проекту

### Використовуючи Docker (рекомендовано)

1. Перейдіть до папки backend:
```bash
cd back
```

2. Скопіюйте файл конфігурації:
```bash
cp .env.example .env
```

3. Запустіть всі сервіси:
```bash
docker-compose up -d
```

### Доступ до сервісів

- Frontend: `http://localhost:8080` (через nginx)
- User Auth API: `http://localhost:3001`
- Opportunities API: `http://localhost:3002`
- Roadmap API: `http://localhost:3003`
- MongoDB: `localhost:27017`

### Зупинка проекту

```bash
docker-compose down
```