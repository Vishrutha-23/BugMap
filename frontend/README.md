# 🗺️ BugMap — AI-Powered Civic Issue Reporting Platform

BugMap is a full-stack web application that empowers citizens to report civic issues like potholes, garbage overflow, broken streetlights, and water leakage. It uses AI to generate formal complaint letters addressed to the correct municipal authorities.

## 🚀 Live Features

- 📍 **Report civic issues** with GPS auto-detection and photo upload
- 🗺️ **Interactive map** showing all reported issues across the city (OpenStreetMap + Leaflet.js)
- 🤖 **AI Complaint Letter Generator** — generates formal letters to BBMP/BWSSB using Groq LLaMA API
- ⬆️ **Community upvoting** — citizens upvote issues to increase priority
- 🔄 **Status tracking** — Open → In Progress → Resolved
- 🔐 **JWT Authentication** — secure register/login system

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, Leaflet.js, React Router |
| Backend | Node.js, Express.js |
| Database | PostgreSQL |
| Authentication | JWT, bcryptjs |
| AI | Groq API (LLaMA 3.3) |
| Image Storage | Cloudinary |
| Maps | OpenStreetMap + Leaflet.js |

## 📁 Project Structure
bugmap/

├── backend/

│   ├── config/        # DB and Cloudinary config

│   ├── controllers/   # Business logic

│   ├── middleware/    # JWT auth middleware

│   ├── routes/        # API routes

│   └── index.js       # Express server

└── frontend/

└── src/

├── components/ # Navbar

├── context/    # Auth context

├── pages/      # Login, Register, Home, ReportIssue, IssueDetail

└── api.js      # API calls


## ⚙️ Setup Instructions

### Backend
```bash
cd backend
npm install
# Create .env file with your credentials
node index.js
```

### Frontend
```bash
cd frontend
npm install
npm start
```

### Environment Variables (backend/.env)
PORT=5000

DB_HOST=localhost

DB_PORT=5432

DB_NAME=bugmap

DB_USER=postgres

DB_PASSWORD=your_password

JWT_SECRET=your_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name

CLOUDINARY_API_KEY=your_key

CLOUDINARY_API_SECRET=your_secret

GROQ_API_KEY=your_groq_key

EMAIL_USER=your_email

EMAIL_PASS=your_app_password

## 🎯 Impact

India loses billions annually to unaddressed civic infrastructure issues. BugMap gives citizens a voice and creates public accountability — showing exactly which areas have the most unresolved issues and for how long.

## 👩‍💻 Developer

Built by **Vishrutha M R** — 3rd year ISE student at Bangalore Institute of Technology