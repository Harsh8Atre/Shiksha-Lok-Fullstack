# ShikshaLok 🎓

**ShikshaLok** is a full-stack digital education and virtual classroom platform designed for colleges where access to quality teaching infrastructure is limited. It supports live WebRTC-powered classes, real-time chat, attendance tracking, course management, and role-based dashboards for students, teachers, and admins.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [Test Credentials](#test-credentials)
- [API Overview](#api-overview)
- [Socket.IO Events](#socketio-events)
- [WebRTC Architecture](#webrtc-architecture)
- [Running Tests](#running-tests)
- [Build for Production](#build-for-production)

---

## Features

| Feature | Details |
|---|---|
| 🔐 Authentication | JWT-based login/register, role-based access (student / teacher / admin) |
| 📚 Courses | Create, enroll, browse, manage courses with resources |
| 🏫 Live Classes | WebRTC mesh video with mic/camera toggles, screen share ready |
| 💬 Real-time Chat | In-class chat via Socket.IO |
| 📋 Attendance | Auto-tracked on join/leave, per-session and per-student views |
| 🔔 Alerts | Broadcast alerts by role/course, real-time Socket.IO delivery |
| 📁 Resources | File upload/download per course (multer, served statically) |
| 📊 Dashboards | Rich dashboards for all three roles |
| 🛡️ Admin Panel | User/course/class/session/alert management |

---

## Tech Stack

**Frontend**
- React 18 + Vite
- React Router v6
- Socket.IO Client
- WebRTC (native browser APIs, mesh topology)
- Tailwind CSS (utility-first styling)

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- Socket.IO v4
- JWT (jsonwebtoken)
- Multer (file uploads)
- bcryptjs (password hashing)

---

## Project Structure

```
ShikshaLok/
├── client/                  # React + Vite frontend
│   ├── src/
│   │   ├── components/      # Shared UI components
│   │   ├── context/         # AuthContext (JWT + user state)
│   │   ├── hooks/           # useWebRTC, useChat, useSocket
│   │   ├── pages/           # Role-based page components
│   │   │   ├── admin/
│   │   │   ├── student/
│   │   │   └── teacher/
│   │   └── services/        # Axios API service modules
│   └── .env
├── server/                  # Express backend
│   ├── controllers/         # Route handlers
│   ├── middleware/          # Auth, error handling
│   ├── models/              # Mongoose schemas
│   ├── routes/              # Express routers
│   ├── sockets/             # Socket.IO handlers (session, chat, webrtc, alert)
│   ├── utils/               # AppError, sendResponse helpers
│   ├── uploads/             # Multer upload destination (gitignored)
│   ├── seed.js              # Database seeder
│   └── .env
├── package.json             # Root — concurrently dev script
└── README.md
```

---

## Prerequisites

- **Node.js** ≥ 18
- **MongoDB** running locally on port 27017 (or update `MONGO_URI` in `server/.env`)
- **npm** ≥ 9

---

## Quick Start

### 1. Clone & Install

```bash
git clone <repo-url>
cd ShikshaLok

# Install all dependencies (root + server + client)
npm run install:all
```

### 2. Configure Environment

Create `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ShikshaLok
JWT_SECRET=your_jwt_secret_here
NODE_ENV=development
```

Create `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

> **Note:** The MongoDB database name is case-sensitive. Use `ShikshaLok` (capital S and L) to avoid conflicts with an existing lowercase database.

### 3. Seed the Database

```bash
npm run seed
```

This creates sample users, courses, classes, and alerts.

### 4. Run in Development Mode

```bash
npm run dev
```

This starts both the Express server (port 5000) and Vite dev server (port 5173) concurrently.

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api
- **Uploaded files:** http://localhost:5000/uploads

---

## Environment Variables

### `server/.env`

| Variable | Required | Default | Description |
|---|---|---|---|
| `PORT` | No | `5000` | Express server port |
| `MONGO_URI` | Yes | — | MongoDB connection string |
| `JWT_SECRET` | Yes | — | Secret for signing JWTs |
| `NODE_ENV` | No | `development` | Controls error detail level |

### `client/.env`

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | Yes | Backend REST API base URL |
| `VITE_SOCKET_URL` | Yes | Socket.IO server URL |

---

## Test Credentials

These accounts are created by `npm run seed`:

| Role | Email | Password |
|---|---|---|
| **Admin** | admin@shikshalok.com | admin123 |
| **Teacher** | teacher@shikshalok.com | teacher123 |
| **Teacher 2** | teacher2@shikshalok.com | teacher123 |
| **Student 1** | student1@shikshalok.com | student123 |
| **Student 2** | student2@shikshalok.com | student123 |
| **Student 3** | student3@shikshalok.com | student123 |
| **Student 4** | student4@shikshalok.com | student123 |
| **Student 5** | student5@shikshalok.com | student123 |

---

## API Overview

All API routes are prefixed with `/api`.

### Auth
| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/auth/login` | Public | Login, returns JWT |
| POST | `/auth/register` | Public | Register new user |
| GET | `/auth/me` | Authenticated | Get current user |

### Users
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/users` | Admin | List all users |
| GET | `/users/:id` | Authenticated | Get user profile |
| PUT | `/users/:id` | Owner / Admin | Update profile |
| DELETE | `/users/:id` | Admin | Delete user |
| PATCH | `/users/:id/role` | Admin | Change user role |

### Courses
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/courses` | Authenticated | List courses (own or all for admin) |
| POST | `/courses` | Teacher | Create course |
| GET | `/courses/:id` | Authenticated | Get course details |
| PUT | `/courses/:id` | Teacher (owner) | Update course |
| DELETE | `/courses/:id` | Teacher / Admin | Delete course |
| POST | `/courses/:id/enroll` | Student | Enroll in course |
| POST | `/courses/:id/unenroll` | Student | Unenroll from course |

### Classes
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/classes` | Authenticated | List classes |
| POST | `/classes` | Teacher | Create class |
| GET | `/classes/:id` | Authenticated | Get class details |
| PUT | `/classes/:id` | Teacher | Update class |
| DELETE | `/classes/:id` | Teacher / Admin | Delete class |

### Live Sessions
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/sessions` | Authenticated | List sessions |
| POST | `/sessions` | Teacher | Start a session |
| GET | `/sessions/:id` | Authenticated | Get session |
| GET | `/sessions/room/:roomId` | Authenticated | Get session by room |
| PUT | `/sessions/:id/start` | Teacher | Mark session started |
| PUT | `/sessions/:id/end` | Teacher | End session |

### Attendance
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/attendance/session/:sessionId` | Authenticated | Session attendance |
| GET | `/attendance/student/:studentId` | Student (own) / Teacher / Admin | Student attendance |

### Alerts
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/alerts` | Authenticated | Get alerts (role-filtered) |
| POST | `/alerts` | Teacher / Admin | Create alert |
| PUT | `/alerts/:id/read` | Authenticated | Mark alert as read |

### Resources
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/resources` | Authenticated | List resources |
| POST | `/resources` | Teacher | Upload resource (multipart) |
| DELETE | `/resources/:id` | Teacher / Admin | Delete resource |

---

## Socket.IO Events

### Session Events (client → server)
| Event | Payload | Description |
|---|---|---|
| `join-session` | `{ roomId, userId, userName, role }` | Join a live class room |
| `leave-session` | `{ roomId }` | Leave a live class room |
| `end-session` | `{ roomId }` | Teacher ends session (broadcasts `session-ended`) |

### Session Events (server → client)
| Event | Payload | Description |
|---|---|---|
| `session-participants` | `[...participants]` | Current participants on join |
| `user-joined` | `{ socketId, userId, userName, role }` | New participant |
| `user-left` | `{ socketId, userId, userName }` | Participant left |
| `session-ended` | — | Teacher ended the session |

### WebRTC Signaling (client ↔ server ↔ client)
| Event | Payload | Description |
|---|---|---|
| `webrtc-offer` | `{ targetSocketId, sdp, senderSocketId, ... }` | Relay SDP offer |
| `webrtc-answer` | `{ targetSocketId, sdp, senderSocketId, ... }` | Relay SDP answer |
| `webrtc-ice-candidate` | `{ targetSocketId, candidate, senderSocketId }` | Relay ICE candidate |

### Chat Events
| Event | Payload | Description |
|---|---|---|
| `send-message` | `{ roomId, message }` | Send a chat message |
| `receive-message` | `{ _id, sender, content, createdAt }` | Broadcast to room |

### Alert Events
| Event | Payload | Description |
|---|---|---|
| `send-alert` | `{ alertId }` | Trigger alert broadcast |
| `receive-alert` | `{ ...alertDoc }` | Delivered to all connected clients |

---

## WebRTC Architecture

ShikshaLok uses a **mesh topology** — each participant establishes a direct peer-to-peer connection with every other participant. This is suitable for small classrooms (up to ~8 participants).

**Connection flow:**
1. Teacher joins room → server broadcasts existing participants
2. New student joins → server emits `user-joined` to all others
3. Each existing participant (including teacher) creates an `RTCPeerConnection` to the new joiner
4. Offer/answer exchange via Socket.IO signaling server
5. ICE candidates are relayed through the server and buffered client-side until `setRemoteDescription` completes

**STUN:** Uses Google's public STUN servers (`stun.l.google.com:19302`) — suitable for development. For production, add a TURN server (e.g., Coturn).

---

## Running Tests

### API Integration Tests (server)
```bash
cd server
npm run test
# or: node test-api.js
```
Runs 15 tests covering auth, courses, classes, sessions, attendance, alerts.

### Socket.IO / WebRTC Tests (client)
```bash
cd client
node test-socket.js
```
Runs 7 tests covering Socket.IO connection, session join, chat, WebRTC signaling, and alert events.

---

## Build for Production

```bash
# Build frontend
npm run build

# The built files will be in client/dist/
# Serve them via Express (or any static host like Nginx / Vercel)
```

For a combined production deployment, configure Express to serve `client/dist` as static files when `NODE_ENV=production`.

---

## License

MIT
