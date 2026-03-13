# Meeting Scheduler — Climatiq Style

A full-stack meeting scheduling web application replicating the Climatiq x Tese booking flow.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js + TypeScript + Tailwind CSS |
| Backend | Node.js + Express + TypeScript |
| Database | MongoDB + Mongoose |
| Email | Nodemailer (Ethereal test mode by default) |

## Features

- ✅ Interactive calendar with date selection (weekends & past dates disabled)
- ✅ 15-minute time slot generation (16:30–18:00)
- ✅ Timezone selector with automatic time conversion (UTC+05:00 to UTC+07:00)
- ✅ Multi-step booking form with validation
- ✅ Booking confirmation screen with celebration animation
- ✅ Email notification - Resend.com(built Real email sending System)
- ✅ Responsive design (mobile + desktop)
- ✅ Admin bookings view at `/admin`
- ✅ Rate limiting & duplicate booking prevention
- ✅ Cancel functionality from email
- ✅ Month navigation on calendar
- ✅ Loading skeletons & error states

## Prerequisites

- Node.js 18+
- MongoDB running locally **or** a MongoDB Atlas connection string
- npm

## Setup & Run

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd meeting-scheduler

# 2. Install all dependencies
npm run install:all

# 3. Set up server environment variables
cp server/.env.example server/.env
# Edit server/.env — at minimum set MONGODB_URI

# 4. Start both client and server
npm run dev
```

The app will be available at:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **Admin Panel:** http://localhost:5173/admin

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `MONGODB_URI` | `mongodb://localhost:27017/meeting-scheduler` | MongoDB connection string |
| `PORT` | `5000` | Express server port |
| `FRONTEND_URL` | `http://localhost:5173` | Frontend URL (for CORS) |
| `EMAIL_USER` | _(blank)_ | Gmail address (leave blank for Ethereal) |
| `EMAIL_PASS` | _(blank)_ | Gmail app password |
| `AVAILABILITY_START` | `16` | Start hour for time slots |
| `AVAILABILITY_END` | `18` | End hour for time slots |
| `SLOT_DURATION_MINUTES` | `15` | Duration of each slot in minutes |

## Email Testing

Email notification - Resend.com(built Real email sending System) 

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/config` | Availability configuration |
| `GET` | `/api/availability/:date` | Get available slots for a date (YYYY-MM-DD) |
| `POST` | `/api/bookings` | Create a new booking |
| `GET` | `/api/bookings` | List all bookings (admin) |
| `GET` | `/api/bookings/:id` | Get single booking |
| `PATCH` | `/api/bookings/:id/cancel` | Cancel a booking |

## Troubleshooting

**MongoDB connection error:** Make sure MongoDB is running locally (`mongod`) or update `MONGODB_URI` in `server/.env` with your Atlas connection string.

**CORS error:** Ensure `FRONTEND_URL` in `server/.env` matches the URL where the frontend is running.

**Port already in use:** Change `PORT` in `server/.env` and update the proxy in `client/vite.config.ts`.

## Live Demo

_(Add your deployed URL here)_

## Screen Recording
https://drive.google.com/file/d/191buyQLvdc9_vNT00HvZR23o4HwzQCrw/view?usp=sharing
