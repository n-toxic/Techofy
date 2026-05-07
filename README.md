# ☁ Techofy Cloud

Affordable Windows RDP and Linux VPS cloud hosting platform built with React, Express, and PostgreSQL.

## ✨ Features

- 🚀 Instant server provisioning (Windows RDP & Linux VPS)
- 🔐 Secure authentication with email OTP verification
- 🔑 Password reset via OTP (forgot password flow)
- 👤 User dashboard with wallet, billing, support tickets
- 🛡️ Admin panel with full user/server management
- 🔒 Protected routes — dashboard only visible after login
- 💳 Razorpay payment integration
- 📧 Beautiful HTML transactional emails
- 🎯 Full SEO optimization with structured data
- ⚡ Rate limiting on all auth endpoints
- 🔧 Vercel-ready deployment

---

## 🗂️ Project Structure

```
techofy-cloud/
├── frontend/          ← React + Vite SPA
│   ├── src/
│   │   ├── pages/     ← All pages (home, login, dashboard, admin, etc.)
│   │   ├── components/
│   │   ├── lib/auth.tsx
│   │   └── App.tsx    ← Route definitions with auth guards
│   ├── public/
│   ├── index.html     ← SEO meta tags
│   └── package.json
│
├── backend/           ← Express API Server
│   ├── src/
│   │   ├── routes/    ← auth, users, instances, admin, support
│   │   ├── lib/       ← auth helpers, mailer
│   │   └── middlewares/
│   └── package.json
│
├── shared/
│   ├── db/            ← Drizzle ORM schema + migrations
│   ├── api-client/    ← Generated React Query hooks
│   └── api-zod/       ← Zod validation schemas
│
├── .env.example       ← Copy to .env and fill values
└── README.md
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 20+
- PostgreSQL database (or [Neon](https://neon.tech) free tier)
- SMTP credentials (Gmail app password)

### 1. Clone & Install

```bash
# Install frontend dependencies
cd frontend && npm install

# Install backend dependencies
cd ../backend && npm install
```

### 2. Configure Environment

```bash
# In the root directory
cp .env.example .env
# Edit .env with your values
```

### 3. Setup Database

```bash
cd shared/db
npm install
npx drizzle-kit push  # Apply schema to your database
```

### 4. Run Development

```bash
# Terminal 1 - Backend
cd backend
npm run dev   # Runs on http://localhost:4000

# Terminal 2 - Frontend  
cd frontend
npm run dev   # Runs on http://localhost:3000
```

---

## 🌐 Deploy to Vercel

### Frontend (Vercel)

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repo
3. Set **Root Directory** to `frontend`
4. Set **Build Command**: `npm run build`
5. Set **Output Directory**: `dist`
6. Add environment variables:
   - `VITE_API_URL` = your backend URL

### Backend (Vercel Serverless / Railway / Render)

**Recommended: Railway or Render** for the backend (Vercel serverless has cold start issues with DB connections).

**Railway:**
1. New project → Deploy from GitHub
2. Set root to `backend`
3. Add all `.env` variables in Railway dashboard
4. It auto-detects and runs `npm start`

**Environment Variables needed for backend:**
```
DATABASE_URL=postgresql://...
JWT_SECRET=your-random-64-char-secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your-app-password
RAZORPAY_KEY_ID=rzp_...
RAZORPAY_KEY_SECRET=...
SITE_URL=https://cloud.techofy.com
FRONTEND_URL=https://cloud.techofy.com
PORT=4000
```

---

## 🔑 Admin Account Setup

After deployment, create your first admin user directly in the database:

```sql
-- First register normally via the website, then promote to admin:
UPDATE users SET role = 'ADMIN' WHERE email = 'your-admin@email.com';
```

Admin panel is at `/admin` — only visible to users with `role = 'ADMIN'`.

---

## 🔐 Security Features

- ✅ JWT tokens with mandatory strong secret (throws error if weak)
- ✅ bcrypt password hashing (12 rounds)
- ✅ Rate limiting on all auth endpoints
- ✅ OTP expires in 10 minutes (15 for password reset)
- ✅ Email enumeration protection on forgot password
- ✅ Helmet.js security headers
- ✅ CORS restricted to frontend URL
- ✅ SQL injection protection via Drizzle ORM
- ✅ Input validation with Zod on all endpoints
- ✅ Protected routes — redirect to login if not authenticated
- ✅ Admin routes — redirect to dashboard if not admin

---

## 🔧 Password Reset Flow

1. User clicks **"Forgot password?"** on login page
2. Enters email → POST `/api/auth/forgot-password`
3. OTP (6 digits) sent to registered email (valid 15 min)
4. User enters OTP + new password on `/reset-password` page
5. POST `/api/auth/reset-password` verifies OTP + updates password
6. User redirected to login

---

## 📧 Email Configuration (Gmail)

1. Go to Google Account → Security → 2-Step Verification (enable)
2. Go to App Passwords → Generate password for "Mail"
3. Use that 16-char password as `SMTP_PASS`

---

## 🛠️ Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, TypeScript, Vite, TailwindCSS v4 |
| State | TanStack Query (React Query) |
| Routing | Wouter |
| Forms | React Hook Form + Zod |
| UI | shadcn/ui + Radix UI + Framer Motion |
| Backend | Express 5, TypeScript |
| Database | PostgreSQL + Drizzle ORM |
| Auth | JWT + bcrypt |
| Email | Nodemailer |
| Payments | Razorpay |
| Validation | Zod |

---

## 📄 License

Private — All rights reserved. Techofy Cloud.
