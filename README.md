# Student Reward Management System

A MERN stack application for managing student rewards and certificates.

## Project Structure

```
student-reward-system/
├── client/             # React frontend
├── server/             # Express backend
│   ├── config/         # DB and middleware configuration
│   ├── controllers/    # Route logic
│   ├── middleware/     # Auth and error handlers
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API routes
│   └── uploads/        # Folder for uploaded certificates (JPG/PDF)
```

## Getting Started

### Backend Setup

1. Navigate to the server directory:
   ```
   cd server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

The server will run on http://localhost:5000

### Frontend Setup

1. Navigate to the client directory:
   ```
   cd client
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

The client will run on http://localhost:3000

## Email (SendGrid) configuration

Render blocks SMTP ports; this project uses an HTTP email API. Configure SendGrid (or another HTTP email provider) via environment variables in your hosting platform.

Required env vars (server):

- `SENDGRID_API_KEY` - API key for SendGrid (leave unset to log emails to server console in development).
- `EMAIL_FROM` - The email address to use as the sender (e.g. `no-reply@yourdomain.com`).
- `JWT_SECRET` - Secret used to sign JWT tokens.

Notes:
- The server uses the SendGrid v3 HTTP API at `https://api.sendgrid.com/v3/mail/send`. If `SENDGRID_API_KEY` is not set, OTP emails are printed to server logs for local development.
- You can adapt `server/utils/emailSender.js` to support other HTTP providers (Mailgun, SparkPost, SES API, etc.).
 