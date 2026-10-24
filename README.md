# AICTE Complaint Monitoring & Redressal System

A full-stack complaint management and monitoring platform designed for AICTE institutions, students, faculty, and administrative authorities.

## 📁 Repository Structure

```
SIH/
├── client/          # Frontend (React + TypeScript + Vite)
├── server/          # Backend (Node.js + Express + Prisma ORM + PostgreSQL)
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn** / **pnpm**
- **PostgreSQL** database instance

---

### 1. Backend Setup (`server`)

1. Navigate to the server folder:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Update `DATABASE_URL` with your PostgreSQL credentials.

4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

5. (Optional) Seed initial data:
   ```bash
   npx prisma db seed
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```
   The API server will run at `http://localhost:3001`.

---

### 2. Frontend Setup (`client`)

1. Open a new terminal and navigate to the client folder:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite dev server:
   ```bash
   npm run dev
   ```
   The client application will run at `http://localhost:5173`.

---

## 🔒 Security & Environment Variables

- **Never commit `.env` files** containing sensitive secrets or production database credentials to Git.
- Refer to `server/.env.example` for required configuration keys.

---

## 👥 Fictional Demonstration Accounts

All seed accounts are **fictional** development demonstration accounts with default password: `Password@123`.

| Role | Email | Assignment / Scope | Default Landing |
| :--- | :--- | :--- | :--- |
| **System Administrator** | `admin.demo@fictional-aicte.example` | System-wide admin & user management | `/dashboard` |
| **Regulation Bureau Officer** | `regulation.demo@fictional-aicte.example` | Regulation Bureau (`RB`) | `/complaints` |
| **PGRC Officer** | `pgrc.demo@fictional-aicte.example` | Public Grievance Redressal Cell (`PGRC`) | `/complaints` |
| **Other Bureau Officer** | `otherbureau.demo@fictional-aicte.example` | Other Bureau / Cell (`OTHER`) | `/complaints` |
| **Regional Officer** | `regional.demo@fictional-aicte.example` | Western Region (`Western`) | `/institutions` |
| **Senior Management** | `senior.demo@fictional-aicte.example` | Executive supervisory read-only | `/dashboard` |
| **Read-Only Auditor** | `auditor.demo@fictional-aicte.example` | System-wide read-only audit | `/reports` |
| **Inactive Test Officer** | `inactive.demo@fictional-aicte.example` | Deactivated account (`isActive: false`) | *Blocked (403)* |

