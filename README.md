# Student Reward Management System

Simple MERN app for student rewards and admin approval.

## Run locally

Backend:
```bash
cd server
npm install
npm start
```

Frontend:
```bash
cd client
npm install
npm start
```

## Deployment notes

- Frontend uses `REACT_APP_API_URL` for the API base URL.
- Backend requires `MONGO_URI`, `JWT_SECRET`, and email config env vars.
- Use an SMTP app password for Gmail login instead of your normal account password.
- Example env vars:
  - `EMAIL_USER=your@gmail.com`
  - `EMAIL_APP_PASSWORD=your-app-password`
  - `EMAIL_HOST=smtp.gmail.com`
  - `EMAIL_PORT=465`
  - `EMAIL_SECURE=true`
- Vercel does not allow writing local files, so uploads should use memory storage and cloud storage instead.

## Project layout

- `client/` - React frontend
- `server/` - Express backend
- `server/routes/` - API routes
- `server/controllers/` - Route handlers
- `server/models/` - Database schemas
- `server/utils/` - Helpers like email sender

 