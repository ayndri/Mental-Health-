# Seribu Cerita — Backend API

REST API for the Seribu Cerita mental health web application.

## Tech Stack

- Node.js + Express
- SQLite via `better-sqlite3` (file-based, no separate DB server needed)
- JWT authentication (`jsonwebtoken`)
- Password hashing (`bcryptjs`)
- Input validation (`express-validator`)
- CORS enabled for all origins

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create your `.env` file from the example:
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` and set a strong `JWT_SECRET`.

3. Start the server:
   ```bash
   npm start
   ```
   The server starts on `http://localhost:5000` (or the `PORT` in `.env`).

4. For development with auto-reload (Node.js 18+):
   ```bash
   npm run dev
   ```

The SQLite database file is created automatically at `data/seribu_cerita.db` on first run.

---

## API Reference

All protected routes require the header:
```
Authorization: Bearer <token>
```

Error responses always have the shape `{ "error": "message" }`.

---

### Auth

#### POST `/api/auth/register`
Register a new user.

**Body:** `{ name, email, password }`
- `password` must be at least 6 characters

**Response 201:** `{ token, user }`

---

#### POST `/api/auth/login`
Log in with email and password.

**Body:** `{ email, password }`

**Response 200:** `{ token, user }`

---

#### GET `/api/auth/me` *(protected)*
Get the currently authenticated user.

**Response 200:** `{ user }`

---

### Profile *(all protected)*

#### PUT `/api/profile`
Update name and/or bio.

**Body:** `{ name?, bio? }`

**Response 200:** `{ user }`

---

#### PUT `/api/profile/avatar`
Set the user's avatar.

**Body:** `{ avatarId }` — integer 1–5

**Response 200:** `{ user }`

---

### Journal *(all protected)*

#### GET `/api/journal`
Get all journal entries for the current user, sorted newest first.

**Response 200:** `{ journals[] }`

---

#### POST `/api/journal`
Create a new journal entry.

**Body:** `{ mood, content, date? }`
- `mood`: `"happy" | "sad" | "anxious" | "angry" | "neutral"`
- `date`: optional ISO 8601 date string (`YYYY-MM-DD`); defaults to today

**Response 201:** `{ journal }`

---

#### PUT `/api/journal/:id`
Update an existing journal entry.

**Body:** `{ mood?, content? }`

**Response 200:** `{ journal }`

---

#### DELETE `/api/journal/:id`
Delete a journal entry.

**Response 200:** `{ success: true }`

---

### Chat History *(all protected)*

#### GET `/api/chat/history`
Get all chat messages for the current user.

**Response 200:** `{ chats[] }`

---

#### POST `/api/chat`
Save a chat message (used by AI model integration).

**Body:** `{ message, emotion_result?, coping_strategy? }`

**Response 201:** `{ chat }`

---

### Highlights *(all protected)*

#### GET `/api/highlights`
Get all highlights for the current user.

**Response 200:** `{ highlights[] }`

---

#### POST `/api/highlights`
Create a new highlight.

**Body:** `{ chat_id?, text, color? }`
- `color`: hex color string (default `#A78BFA`)

**Response 201:** `{ highlight }`

---

#### DELETE `/api/highlights/:id`
Delete a highlight.

**Response 200:** `{ success: true }`

---

### Health Check

#### GET `/health`
Returns server status.

**Response 200:** `{ status: "ok", app: "Seribu Cerita API", timestamp }`
