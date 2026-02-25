# Backend Setup

## Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```
PORT=3001
JWT_SECRET=your-secret-key-change-in-production
UPLOAD_DIR=./uploads
```

**Important**: Change `JWT_SECRET` to a strong random string in production!

## Database

The SQLite database will be created automatically on first run in `database/database.db`.

## File Uploads

Make sure the `uploads` directory exists:
```bash
mkdir uploads
```

Uploaded files will be accessible at `http://localhost:3001/uploads/filename`.






