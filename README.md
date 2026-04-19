# 🗓️ Are We Meeting?

## A smart timezone-aware meeting scheduler that finds overlapping availability across distributed teams.

---

## ⚡ The Problem

Scheduling meetings across timezones is a **nightmare**.

You send around 10 time options.
Get back 5 different answers.
Someone's always upset.

**Are We Meeting?** solves this by:
- ✨ Automatically calculating overlapping free time
- 🌍 Converting across timezones instantly
- 🗳️ Letting participants vote on what works best
- 📅 Adding confirmed meetings directly to Google Calendar

---

## ✨ Key Features

### Smart Overlap Algorithm
Finds the actual times when everyone is free, not just guesses.

### 🌍 Timezone Magic
Automatically detects and converts across timezones. No more 3 AM surprises.

### 🗳️ Clean Voting
Participants see 3-5 real options and pick the best one. Not 47 poll reactions.

### 📅 Google Calendar Integration
Confirmed meetings auto-sync to Google Calendar with reminders.

### ⏰ Email Reminders
Automatic notifications 30 minutes before each meeting.

### 🔐 Auth & Privacy
Secure JWT authentication, passwords hashed with bcrypt.

---

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express.js** — Server & routing
- **PostgreSQL** — Timezone-aware database
- **Luxon** — Timezone calculations
- **Google Calendar API** — Calendar sync
- **Nodemailer** — Email delivery
- **node-cron** — Background jobs

### Frontend
- **React 18** + **Vite** — Fast, modern UI
- **React Router** — Navigation
- **Tailwind CSS** — Beautiful styling
- **Fetch API** — Backend communication

---

## 📁 Project Structure

```
are-we-meeting/
│
├── backend/
│   ├── controllers/          # Business logic
│   ├── routes/               # API endpoints
│   ├── middleware/           # Auth, error handling
│   ├── services/             # Email, reminders, calendar
│   ├── utils/                # Overlap algorithm
│   ├── db.js                 # PostgreSQL connection
│   ├── index.js              # Server entry point
│   └── schema.sql            # Database schema
│
└── are-we-meeting/           # Frontend (Vite)
    ├── src/
    │   ├── pages/            # Auth, Home, CreateMeeting, Meeting, Invite
    │   ├── components/       # AppShell, SlotGrid
    │   ├── services/         # API calls
    │   ├── index.css         # Global styles
    │   └── App.jsx           # Router setup
    └── vite.config.js
```

---

## 🔄 How It Works

### Step 1: Setup & Authentication
```
User registers
    ↓
Email + Password + Timezone (auto-detected)
    ↓
JWT token generated → Stored locally
```

### Step 2: Availability Creation
```
User sets weekly availability
(Mon-Fri, 6PM-9PM in their timezone)
    ↓
Stored in database with day_of_week + time
```

### Step 3: Meeting Creation
```
Organizer creates meeting
    ↓
Invites 3-5 people
    ↓
Sets search window (7 days)
    ↓
Backend runs overlap algorithm:
  • Gets all participants' availability
  • Converts to UTC
  • Finds overlapping windows
  • Creates proposed_slots (3-5 viable times)
```

### Step 4: Participant Voting
```
Invitees get shareable link
    ↓
See proposed slots in their timezone
    ↓
Vote for the time that works best
    ↓
Vote count visible in real-time
```

### Step 5: Confirmation & Calendar Sync
```
Organizer picks winner slot
    ↓
Meeting status → "confirmed"
    ↓
✅ Google Calendar event created
✅ Email reminders scheduled (30 min before)
✅ Reminders sent automatically
```

---

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register        Create account
POST   /api/auth/login           Get JWT token
```

### Availability
```
GET    /api/availability         Get user's availability
POST   /api/availability         Add availability slot
DELETE /api/availability/:id     Remove slot
```

### Meetings
```
POST   /api/meetings             Create meeting + generate overlaps
GET    /api/meetings/:id         Get meeting details & proposed slots
POST   /api/meetings/:id/confirm Confirm winning slot
```

### Voting
```
POST   /api/votes                Cast vote
DELETE /api/votes                Remove vote
GET    /api/votes/meeting/:id    Get vote counts per slot
```

### Google Calendar
```
GET    /api/calendar/auth-url    Get Google OAuth URL
GET    /api/calendar/callback    Handle OAuth redirect
POST   /api/calendar/add-event   Add event to calendar
```

---

## 🗄️ Database Schema

| Table | Purpose |
|-------|---------|
| **users** | Email, password, timezone, Google token |
| **availability_slots** | User's weekly availability |
| **meetings** | Meeting metadata, status, search window |
| **meeting_participants** | Attendee list |
| **proposed_slots** | Generated viable times (UTC) |
| **votes** | Participant votes on slots |
| **reminders** | Scheduled email reminders |

---

## 🚀 Setup & Deployment

### Local Development

#### Backend Setup
```bash
cd backend
npm install
```

Create `.env` file:
```
PORT=8000
DATABASE_URL=postgresql://localhost:5432/are_we_meeting
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=your@gmail.com
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=http://localhost:8000/api/calendar/callback
```

Run server:
```bash
npm run dev
```

#### Frontend Setup
```bash
cd are-we-meeting
npm install
npm run dev
```

Visit: `http://localhost:5173`

### Deployment

**Backend:** Deploy to Railway, Render, or Heroku
- Set environment variables
- PostgreSQL database required

**Frontend:** Deploy to Vercel, Netlify
- Update `VITE_API_URL` to backend URL

---

## 🧮 The Algorithm (Overlap Finder)

The core logic that makes this work:

```javascript
// For a given date, find overlapping availability
1. Get all participants' availability for that day
2. Convert each person's slots to UTC
3. Find the intersection:
   - Start time = MAX of all start times
   - End time = MIN of all end times
4. Check if overlap duration >= required meeting length
5. If yes, add to proposed_slots table
```

### Why UTC?
Because timezone math is hard. 

UTC is the single source of truth. 

Everything gets converted here, then converted back to each person's local timezone for display.

---

## ✅ Features Built

- ✅ User authentication with JWT
- ✅ Availability scheduling
- ✅ Smart overlap algorithm
- ✅ Timezone conversion (Luxon)
- ✅ Meeting creation with participant invites
- ✅ Vote casting & removal
- ✅ Vote counting & leaderboard
- ✅ Email reminders (cron jobs)
- ✅ Google Calendar integration
- ✅ React frontend with clean UI
- ✅ CORS & security headers

---

## 📚 Learning Outcomes

This project covers:

**Backend:**
- Node.js & Express.js
- PostgreSQL & SQL
- JWT authentication
- Timezone math & conversion
- Google OAuth2 flow
- Email services
- Background jobs (cron)

**Frontend:**
- React 18 & Vite
- React Router
- State management
- API integration
- Responsive design
- Tailwind CSS

**DevOps:**
- CORS configuration
- Environment variables
- Git workflow
- Deployment pipelines

---

## 🛠️ Challenges Overcome

### 🔧 Timezone Math
Converting between timezones while maintaining data accuracy. UTC is king.

### 🔧 Overlap Algorithm
Finding intersection of multiple time windows correctly.

### 🔧 OAuth Flow
Implementing Google Calendar authentication without getting lost in the docs.

### 🔧 CORS Issues
Frontend-backend communication across different domains.

### 🔧 Email Delivery
Reliable reminders via Gmail + nodemailer.

---

## 📝 License

MIT — Feel free to fork and modify!

---

## 💙 Built with ❤️

A full-stack learning project demonstrating real-world web development.

**GitHub:** https://github.com/saket0392/Are-we-Meeting

**Live Link:** https://are-we-meeting.vercel.app/
