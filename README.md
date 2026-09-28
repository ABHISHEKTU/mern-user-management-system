# User Management System

MERN app: users register, log in and manage their profile. Admins manage all users.

## Stack

- Backend: Node.js, Express 5, MongoDB (Mongoose), JWT, bcryptjs, zod, helmet, express-rate-limit
- Frontend: React (Vite), React Router, Context API, axios

## Setup

Needs Node 20.6+ and a MongoDB connection (Atlas or local).

Backend:

    cd server
    npm install
    copy .env.example .env
    npm run dev

Frontend:

    cd client
    npm install
    copy .env.example .env
    npm run dev

App: http://localhost:5173. API: http://localhost:5000.
Fill in `server/.env` before starting the backend.

## Environment variables

| File | Variable | Purpose |
| --- | --- | --- |
| server/.env | PORT | API port |
| server/.env | MONGO_URI | MongoDB connection string |
| server/.env | JWT_SECRET | Long random string for signing tokens |
| server/.env | JWT_EXPIRES_IN | Token lifetime, e.g. 1d |
| server/.env | CLIENT_URL | Allowed CORS origin |
| client/.env | VITE_API_URL | API base URL |

## API

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | /api/auth/signup | Public | Register, returns token |
| POST | /api/auth/login | Public | Login, returns token |
| GET | /api/users/profile | Logged in | Get own profile |
| PUT | /api/users/profile | Logged in | Update name, email |
| GET | /api/users | Admin | List all users |
| DELETE | /api/users/:id | Admin or self | Delete a user |

## Creating an admin

Signup always creates role `user`. To make an admin, change `role` to `admin` on the user document in the database.

## Security notes

- Passwords hashed with bcryptjs (cost 12) and never returned.
- Input validated with zod. Unknown fields are stripped, so role cannot be set at signup.
- helmet, CORS limited to CLIENT_URL, rate limiting, 10kb body limit.
- JWT expires after 1 day. Role is read from the database on every request.
- JWT is stored in localStorage (allowed by the task). An httpOnly cookie is safer against XSS.
