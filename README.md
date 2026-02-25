# WasTheWord - Social Network

Современная социальная сеть с функциями публикации постов, организаций, чатов и профилей пользователей.

## Технологии

### Backend
- Node.js + Express
- SQLite (better-sqlite3)
- JWT для аутентификации
- Multer для загрузки файлов

### Frontend
- React + TypeScript
- Vite
- React Router
- Axios

## Установка

1. Установите зависимости для всех частей проекта:
```bash
npm run install:all
```

Или установите вручную:
```bash
npm install
cd backend && npm install
cd ../frontend && npm install
```

2. Настройте backend:
```bash
cd backend
echo "PORT=3001" > .env
echo "JWT_SECRET=your-secret-key-change-in-production" >> .env
echo "UPLOAD_DIR=./uploads" >> .env
```

Отредактируйте `.env` файл при необходимости (по умолчанию используется порт 3001, секрет JWT обязательно замените в продакшене).

3. Создайте папку для загрузок (если её нет):
```bash
mkdir backend/uploads
mkdir backend/uploads/messages
```

## Запуск

### Разработка

Запустите backend и frontend одновременно:
```bash
npm run dev
```

Или запустите отдельно:

Backend:
```bash
cd backend
npm run dev
```

Frontend:
```bash
cd frontend
npm run dev
```

### Production

Backend:
```bash
cd backend
npm start
```

Frontend:
```bash
cd frontend
npm run build
npm run preview
```

## Функционал

### Аутентификация
- Регистрация пользователей
- Вход в систему
- JWT токены для безопасности

### Главная страница
- Лента постов от пользователей и организаций
- Создание постов с текстом и изображениями
- Лайки и комментарии к постам

### Организации
- Создание пабликов/групп
- Управление участниками (администратор, модераторы, участники)
- Публикация постов от имени организации

### Чат
- Личные чаты между пользователями
- Групповые чаты
- Отправка сообщений в реальном времени

### Профиль
- Редактирование информации (ФИО, возраст, работа, о себе)
- Загрузка аватара
- Галерея фотографий пользователя

## API Endpoints

### Аутентификация
- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Вход
- `GET /api/auth/me` - Текущий пользователь

### Пользователи
- `GET /api/users/:id` - Получить профиль
- `PUT /api/users/:id` - Обновить профиль
- `POST /api/users/:id/avatar` - Загрузить аватар
- `POST /api/users/:id/photos` - Загрузить фото
- `DELETE /api/users/:id/photos/:photoId` - Удалить фото

### Посты
- `GET /api/posts/feed` - Лента постов
- `GET /api/posts/:id` - Получить пост
- `POST /api/posts` - Создать пост
- `POST /api/posts/:id/like` - Лайк/анлайк
- `POST /api/posts/:id/comments` - Добавить комментарий
- `DELETE /api/posts/:id` - Удалить пост

### Организации
- `GET /api/organizations` - Список организаций
- `GET /api/organizations/:id` - Детали организации
- `POST /api/organizations` - Создать организацию
- `PUT /api/organizations/:id` - Обновить организацию
- `POST /api/organizations/:id/join` - Вступить
- `POST /api/organizations/:id/leave` - Покинуть
- `POST /api/organizations/:id/moderators` - Добавить модератора
- `DELETE /api/organizations/:id/moderators/:userId` - Убрать модератора

### Чаты
- `GET /api/chats` - Список чатов
- `GET /api/chats/:id` - Детали чата
- `POST /api/chats/personal` - Создать личный чат
- `POST /api/chats/group` - Создать групповой чат
- `POST /api/chats/:id/participants` - Добавить участника

### Сообщения
- `GET /api/messages/chat/:chatId` - Сообщения чата
- `POST /api/messages` - Отправить сообщение
- `DELETE /api/messages/:id` - Удалить сообщение

## Структура проекта

```
wastheword/
├── backend/
│   ├── database/
│   │   ├── init.js          # Инициализация БД
│   │   └── database.db      # SQLite база данных
│   ├── middleware/
│   │   └── auth.js          # JWT middleware
│   ├── routes/
│   │   ├── auth.js          # Аутентификация
│   │   ├── users.js         # Пользователи
│   │   ├── posts.js         # Посты
│   │   ├── organizations.js # Организации
│   │   ├── chats.js         # Чаты
│   │   └── messages.js      # Сообщения
│   ├── uploads/             # Загруженные файлы
│   └── server.js            # Главный файл сервера
├── frontend/
│   ├── src/
│   │   ├── components/      # React компоненты
│   │   ├── contexts/        # React контексты
│   │   ├── pages/           # Страницы
│   │   ├── types.ts         # TypeScript типы
│   │   └── App.tsx          # Главный компонент
│   └── package.json
└── package.json
```

## Примечания

- База данных SQLite создаётся автоматически при первом запуске, файл `backend/database/database.db` не нужно хранить в Git
- Загруженные файлы сохраняются в `backend/uploads/`, содержимое этой папки также не должно попадать в репозиторий
- JWT токены хранятся в localStorage на клиенте
- Для production рекомендуется использовать переменные окружения для секретных ключей и отдельную базу данных






