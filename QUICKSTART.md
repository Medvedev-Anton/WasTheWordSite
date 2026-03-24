# Быстрый старт Наследие

## Шаг 1: Установка зависимостей

```bash
npm run install:all
```

## Шаг 2.1: Настройка backend

```bash
cd backend
echo "PORT=3001" > .env
echo "JWT_SECRET=your-secret-key-change-in-production" >> .env
echo "UPLOAD_DIR=./uploads" >> .env

# Создайте папку для загрузок
mkdir uploads/messages
cd ..
```

## Шаг 2.2: Настройка backend

```bash
cd frontend
echo "VITE_API_URL=http://localhost:3001" > .env
echo "REACT_APP_YMAP_KEY=<Сюда вставьте ключ API от яндекс>" >> .env
cd ..
```

## Шаг 3: Запуск

```bash
npm run dev
```

Это запустит:
- Backend на http://localhost:3001
- Frontend на http://localhost:3000

## Шаг 4: Регистрация

1. Откройте http://localhost:3000
2. Зарегистрируйте новый аккаунт
3. Войдите в систему своим аккаунтом

## Готово!

Теперь вы можете:
- Публиковать посты на главной странице
- Создавать организации
- Общаться в чатах
- Настраивать свой профиль

## Примечания

- База данных SQLite создаётся автоматически при первом запуске, файл `backend/database/database.db` не нужно хранить в Git
- Все загруженные файлы сохраняются в `backend/uploads/`, содержимое этой папки не должно попадать в репозиторий
- Для остановки сервера нажмите `Ctrl+C`






