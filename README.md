# TaskFlow — Plan. Track. Complete.

**TaskFlow** is a full-stack Task Management Application built for **Thiranex Internship Task 2**. It provides a clean, modern productivity workspace for creating, updating, tracking, filtering, and completing tasks with JWT authentication, bcrypt password hashing, RESTful CRUD APIs, and MongoDB/Mongoose persistence.

---

## 1. Project Description

TaskFlow helps individuals plan, track, and complete their daily work in a distraction-free workspace. The application demonstrates a complete full-stack web architecture:
- **Frontend**: Responsive React + Vite single-page application designed for desktop, tablet, and mobile devices.
- **Backend**: Modular Node.js + Express REST API following the MVC pattern (`controllers`, `models`, `routes`, `middleware`, `config`).
- **Database**: MongoDB with Mongoose schemas and user-to-task relational ownership.
- **Security**: Stateless JWT authentication, bcrypt password hashing, protected API routes, and strict user-level authorization.

---

## 2. Features

- **User Authentication & Authorization**:
  - Account registration (`Full Name`, `Email`, `Password`, `Confirm Password`) with client and server validation.
  - Secure login with `bcryptjs` password verification and signed `JSON Web Tokens (JWT)`.
  - Protected routes on both frontend (`ProtectedRoute`) and backend (`protect` middleware).
  - Strict multi-tenant isolation: users can only view, edit, or delete their own tasks.
- **Dynamic Dashboard Summary**:
  - Real-time counts for **Total Tasks**, **Pending**, **In Progress**, and **Completed** tasks.
  - Overall completion rate progress bar.
- **Complete Task CRUD Operations**:
  - **Create**: Add tasks with `Title`, `Description`, `Priority` (`Low`, `Medium`, `High`), `Status` (`Pending`, `In Progress`, `Completed`), and `Due Date`.
  - **Read**: View all tasks, single task details, or filtered task views (`My Tasks`, `Pending`, `Completed`).
  - **Update**: Full task editing via modal form (`PUT /api/tasks/:id`) and one-click status updates (`PATCH /api/tasks/:id/status`).
  - **Delete**: Confirmation dialog (`"Are you sure you want to delete this task?"`) before permanent removal (`DELETE /api/tasks/:id`).
- **Search, Filtering & Sorting**:
  - Live search by task title.
  - Filter by status (`All`, `Pending`, `In Progress`, `Completed`).
  - Filter by priority (`All`, `Low`, `Medium`, `High`).
  - Sort by `Newest`, `Oldest`, or `Due Date`.
- **Responsive Productivity UI**:
  - Desktop sidebar navigation + mobile collapsible drawer navigation.
  - Loading skeletons, empty states, error banners, and toast notifications.

---

## 3. Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 19, Vite, React Router v7, Tailwind CSS, Lucide Icons |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas, Mongoose ODM |
| **Authentication** | JSON Web Token (`jsonwebtoken`), `bcryptjs` |

---

## 4. Screenshots

> Replace the placeholders below with screenshots of your running application before submitting to Thiranex:

- `docs/screenshots/1-login-register.png` — *Login & Registration Views*
- `docs/screenshots/2-dashboard.png` — *Main Dashboard & Task Statistics*
- `docs/screenshots/3-task-crud.png` — *Create / Edit Task Modal & Filtering*
- `docs/screenshots/4-mobile-view.png` — *Responsive Mobile Navigation & Task Cards*

---

## 5. Project Structure

```text
TaskFlow/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── TaskCard.jsx
│   │   ├── TaskForm.jsx
│   │   ├── TaskList.jsx
│   │   ├── TaskStats.jsx
│   │   ├── SearchBar.jsx
│   │   └── ProtectedRoute.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Tasks.jsx
│   │   ├── Completed.jsx
│   │   ├── Pending.jsx
│   │   └── Profile.jsx
│   ├── services/
│   │   ├── api.js
│   │   └── authService.js
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── server/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── taskController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── taskRoutes.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── server.ts
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

---

## 6. Environment Variables

Create a `.env` file in the root directory (and/or inside `server/.env` if running the backend separately):

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/taskflow?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_signing_key_minimum_32_chars
PORT=5000
CLIENT_URL=http://localhost:3000
VITE_API_URL=/api
```

---

## 7. Installation & Running Locally

### Option A: Unified Full-Stack Development Server (Recommended)

```bash
# 1. Install dependencies
npm install

# 2. Copy environment variables and add your MongoDB Atlas URI & JWT_SECRET
cp .env.example .env

# 3. Start full-stack server (Express API + Vite frontend on http://localhost:3000)
npm run dev
```

### Option B: Running Backend & Frontend Separately

#### Backend (`server/`)
```bash
cd server
npm install
cp .env.example .env
npm run dev
```

#### Frontend
```bash
npm install
npm run dev
```

---

## 8. REST API Endpoints

### Authentication Endpoints

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register a new user account and return JWT |
| `POST` | `/api/auth/login` | Public | Authenticate user credentials and return JWT |
| `GET` | `/api/auth/me` | Private | Get currently authenticated user's profile |

### Task Endpoints (All require `Authorization: Bearer <token>`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/tasks` | Private | Get all tasks belonging to the authenticated user |
| `GET` | `/api/tasks/:id` | Private | Get a single task by ID (verifies ownership) |
| `POST` | `/api/tasks` | Private | Create a new task |
| `PUT` | `/api/tasks/:id` | Private | Update task title, description, priority, status, due date |
| `PATCH` | `/api/tasks/:id/status` | Private | Update only the task status (`Pending`, `In Progress`, `Completed`) |
| `DELETE` | `/api/tasks/:id` | Private | Delete a task permanently |

---

## 9. Deployment Guide

### Step 1: MongoDB Atlas Setup
1. Sign in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free **M0 Cluster**.
2. Go to **Database Access** and create a database user with Read/Write permissions.
3. Go to **Network Access** and allow access from anywhere (`0.0.0.0/0`) so Render can connect.
4. Click **Connect > Drivers** and copy your connection string (`MONGODB_URI`).

### Step 2: Deploy Backend to Render
1. Push your repository to GitHub.
2. In [Render](https://render.com/), create a **New Web Service** connected to your repository.
3. Set **Root Directory** to `server` (or `.` if deploying unified).
4. Set **Build Command**: `npm install`
5. Set **Start Command**: `npm start`
6. Add Environment Variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A strong random secret string
   - `CLIENT_URL`: Your deployed Vercel frontend URL (e.g., `https://taskflow-app.vercel.app`)
   - `PORT`: `5000`

### Step 3: Deploy Frontend to Vercel
1. In [Vercel](https://vercel.com/), import your GitHub repository.
2. Framework Preset: **Vite**.
3. Build Command: `npm run build` | Output Directory: `dist`.
4. Add Environment Variable:
   - `VITE_API_URL`: `https://<your-render-backend>.onrender.com/api`
5. Click **Deploy**.

---

## 10. Future Improvements

- Recurring task schedules and calendar view integration
- Subtasks and checklist items within tasks
- CSV / JSON task export for personal backups
- Keyboard shortcuts for rapid task creation (`C`) and search (`/`)
