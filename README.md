# 🚀 JobPortal.ai — Next-Gen AI-Powered Career Platform

A full-stack, enterprise-grade job portal engineered with **MERN Stack** (MongoDB, Express, React, Node.js) and enhanced with intelligent career tools: **AI SkillMatch™ Engine**, **Built-in ATS Resume Compatibility Scanner**, **Role-Tailored Interview Prep Rooms**, and an **Interactive Kanban Application Pipeline**.

---

## 🌟 What Makes This Job Portal Unique?

Unlike conventional job boards that function as passive listings, **JobPortal.ai** empowers candidates and recruiters with transparent, real-time intelligence:

### 1. 🤖 SkillMatch™ AI Compatibility Engine
* **Real-Time Match Score (0–100%)**: Dynamically analyzes the candidate's verified skill stack against job requirements before applying.
* **Skill Gap Analysis**: Identifies missing competencies and recommends targeted learning paths to reach a 100% match.
* **Match Badges**: Immediate visual indicators on job cards (*"90% Match • Top Candidate"*).

### 2. 📄 Built-in ATS Resume Scanner & Scorer
* **Screening Simulator**: Candidates can test their resume text against any job posting in one click.
* **Actionable Scorecard**: Evaluates keyword density, impact action verbs, and structural readability.
* **Personalized Recommendations**: Suggests exact industry keywords and quantifiable metrics to help candidates bypass automated ATS filters.

### 3. 🎯 Role-Tailored Interview Prep Rooms
* **Embedded Practice Simulator**: Every single job opening includes interactive mock interview questions tailored to that specific role and tech stack (Frontend, Backend, Fullstack, System Design, Behavioral).
* **Revealable Answer Keys**: Candidates can reveal architectural solutions, STAR-method behavioral guides, and technical trade-offs.

### 4. 📊 Dual Intelligent Dashboards
* **Candidate Command Center**:
  * **Kanban Pipeline**: Track applications across 6 stages (`Applied`, `Reviewing`, `Shortlisted`, `Interviewing`, `Offered`, `Archived`).
  * **Saved Bookmarks**: 1-click job bookmarking drawer.
  * **Profile Readiness Meter**: Gauge profile completeness and ATS readiness.
* **Recruiter Talent CRM & ATS**:
  * View all applicants per opening, automatically pre-ranked by **SkillMatch Score**.
  * View candidate portfolios, GitHub, LinkedIn, and cover pitches.
  * 1-Click candidate pipeline stage progression.
  * Private recruiter evaluation notes.

### 5. 🔍 Multi-Dimensional Filtering & Search
* Real-time search across job titles, tech stack, and company names.
* Quick filters for **Job Type** (Full Time, Remote, Internship, Part Time, Contract).
* Filtering by **Experience Level** (Fresher, Mid-Level, Senior, Lead).
* One-click technology tag filters (React, Node.js, Python, AWS, Docker, MongoDB).

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, React Router v6, Tailwind CSS, Context API, Axios |
| **Backend** | Node.js, Express.js, MongoDB Atlas, Mongoose, JWT, bcryptjs, CORS |
| **Intelligence** | SkillMatch™ Engine, ATS Keyword Scanner, Mock Interview Generator |
| **Deployment** | Vercel (Frontend), Render (Backend), MongoDB Atlas (Database) |

---

## 📂 Project Architecture

```
job-portal-fullstack/
├── backend/
│   ├── auth/
│   │   ├── authController.js     # Register, Login, Profile updates, Saved jobs
│   │   └── authRoutes.js         # Auth routing endpoints
│   ├── jobs/
│   │   ├── jobController.js      # Jobs CRUD, Search, Apply, Recruiter CRM, ATS scanner
│   │   └── jobRoutes.js          # Job routes & pipeline management
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT Bearer token protection
│   ├── models/
│   │   ├── User.js               # Candidate/Recruiter schema with skills & bookmarks
│   │   ├── Job.js                # Job schema with skillsRequired, benefits & interview Q&As
│   │   └── Application.js        # Multi-stage application pipeline & match scores
│   ├── utils/
│   │   └── aiMatcher.js          # SkillMatch, ATS scanning & Interview questions engine
│   ├── server.js                 # Express server & MongoDB Atlas connector
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── index.html            # Google Fonts (Poppins, Satisfy)
    ├── src/
    │   ├── auth-pages/
    │   │   ├── LoginPage.jsx     # Modern auth with role redirection
    │   │   ├── RegisterPage.jsx  # Student & recruiter account creation
    │   │   └── ProfilePage.jsx   # Interactive profile & SkillMatch competency manager
    │   ├── components/
    │   │   ├── Navbar.jsx        # Glassmorphism header with live context & mobile menu
    │   │   └── Icons.jsx         # Zero-dependency, ultra-crisp SVG icon system
    │   ├── context/
    │   │   └── AuthContext.js    # Persistent authentication & user profile state
    │   ├── job-pages/
    │   │   ├── JobListingPage.jsx        # Multi-filter job search & match scores
    │   │   ├── JobDetailsPage.jsx        # SkillMatch widget, ATS scanner & Interview Prep
    │   │   ├── DashboardPage.jsx         # Candidate Kanban pipeline & saved jobs
    │   │   ├── RecruiterDashboardPage.jsx# Recruiter Talent CRM & candidate manager
    │   │   └── PostJobPage.jsx           # Job creator with skill tag picker & benefits
    │   ├── pages/
    │   │   └── LandingPage.jsx   # High-converting modern landing page
    │   ├── services/
    │   │   └── api.js            # Centralized API service with local & cloud switching
    │   ├── App.js                # Route definitions & AuthProvider wrapper
    │   └── index.css             # Tailwind CSS & custom utilities
    └── package.json
```

---

## ⚡ Getting Started Locally

### 1. Backend Setup
```bash
cd backend
npm install
node server.js
```
The server will run on `http://localhost:5000` and automatically connect to MongoDB Atlas.

### 2. Frontend Setup
```bash
cd frontend
npm install
npm start
```
The client will launch on `http://localhost:3000`.

---

## 🔐 API Reference

### Authentication (`/api/auth`)
* `POST /api/auth/register` — Create candidate or recruiter account
* `POST /api/auth/login` — Sign in and receive JWT token
* `GET /api/auth/profile` — Fetch authenticated profile
* `PUT /api/auth/profile` — Update skills, headline, bio, resume text & links
* `POST /api/auth/save-job` — Toggle save/bookmark job
* `GET /api/auth/saved-jobs` — Retrieve bookmarked jobs

### Jobs & Applications (`/api/jobs`)
* `GET /api/jobs` — Retrieve openings with search & filter params (`?search=`, `?jobType=`, `?experienceLevel=`, `?location=`)
* `GET /api/jobs/:id` — Retrieve job details + user match score
* `POST /api/jobs/create` — Recruiter publishes new opening with required skills
* `POST /api/jobs/apply` — Candidate submits 1-click application with cover pitch
* `GET /api/jobs/applications` — Candidate retrieves their applications
* `GET /api/jobs/myjobs` — Recruiter retrieves their posted jobs & applicant counts
* `GET /api/jobs/applicants/:jobId` — Recruiter views candidates ranked by match score
* `PUT /api/jobs/applications/:id` — Recruiter moves candidate across pipeline stages
* `POST /api/jobs/ats-scan` — Runs ATS resume analysis against job requirements
* `DELETE /api/jobs/:id` — Recruiter deletes job posting and associated applications