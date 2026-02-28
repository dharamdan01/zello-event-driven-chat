<div align="center">

# 💬 Zello — Event-Driven Group Chat

**A real-time, event-driven group chat application built with Socket.IO, Node.js, and React.**

[![Node.js](https://img.shields.io/badge/Node.js-ES%20Modules-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8.3-010101?style=flat&logo=socket.io&logoColor=white)](https://socket.io/)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=flat&logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)

<br/>

> Connect · Chat · Share — in real time, no login required.

<br/>

[![LinkedIn](https://img.shields.io/badge/Dharam%20Dan-LinkedIn-0A66C2?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/dharam-dan)
[![GitHub](https://img.shields.io/badge/dharamdan01-GitHub-181717?style=flat&logo=github&logoColor=white)](https://github.com/dharamdan01)

</div>

---

## 📖 Overview

**Zello** is a lightweight, event-driven real-time group chat app. Users enter their name, instantly join a shared room, and start messaging — no accounts, no database, no friction.

Every interaction (messages, join events, typing indicators) is powered by **WebSocket events** via Socket.IO, making the entire communication layer fully asynchronous and event-driven on both the server and the client.

---

## ✨ Features

- **⚡ Real-time messaging** — messages are pushed instantly to all users in the room via WebSocket events
- **🙋 Join notifications** — a system message appears whenever someone new enters the chat
- **✍️ Live typing indicator** — shows when another user is composing a message
- **🛡️ Input validation & sanitization** — alphabets-only usernames, message length limits (1–500 chars), special character ratio checks, and HTML entity escaping to prevent XSS
- **🎨 Dark mode support** — automatically follows the OS `prefers-color-scheme` setting
- **📱 Fully responsive** — adapts cleanly from desktop down to mobile (480px)
- **👤 Avatar initials** — each user gets a generated avatar from the first letter of their name
- **🔄 Smooth animations** — fade-in, slide-in, and pulse animations for a polished UX

---

## 🏗️ Architecture

```
zello-event-driven-chat/
├── backend/               # Node.js + Express + Socket.IO server
│   ├── server.js          # Main server — HTTP + WebSocket event hub
│   └── package.json
│
└── frontend/              # React 19 + Vite SPA
    ├── src/
    │   ├── main.jsx               # React entry point
    │   ├── App.jsx                # Root component — auth gate + socket lifecycle
    │   ├── ws.js                  # WebSocket connection factory
    │   ├── App.css                # All styles (layout, components, dark mode, responsive)
    │   └── components/
    │       ├── Header.jsx         # Branded top bar with animated SVG logo
    │       ├── AuthScreen.jsx     # Name entry / join flow
    │       └── ChatScreen.jsx     # Live chat UI — messages, typing, send
    ├── index.html
    ├── vite.config.js
    └── package.json
```

### How it works

```
User enters name
      │
      ▼
 AuthScreen.jsx
  validates input
      │
      ▼
 App.jsx: socket.emit('joinRoom', userName)
      │
      ▼
 server.js: socket.join('group')
  └─ socket.to('group').emit('userJoined', {userName})
      │
      ▼
 ChatScreen.jsx receives 'userJoined'
  └─ renders system message: "UserX joined the group"
      │
  User types a message
      │
      ▼
 socket.emit('typing', {userName})        ← fires on every keystroke
 socket.emit('sendChatMessage', message)  ← fires on submit
      │
      ▼
 server.js broadcasts to all other room members
      │
      ▼
 Other users' ChatScreen.jsx
  ├─ 'typing'           → shows "[name] is typing..." for 1s
  └─ 'sendChatMessage'  → appends message to allMessages state
```

### Socket.IO Event Map

| Event | Direction | Payload | Purpose |
|---|---|---|---|
| `joinRoom` | Client → Server | `userName: string` | User enters the group room |
| `userJoined` | Server → Others | `{ userName }` | Notify room that someone joined |
| `sendChatMessage` | Client → Server | `{ sender, message, timestamp }` | Send a message |
| `sendChatMessage` | Server → Others | `{ sender, message, timestamp }` | Broadcast message to room |
| `typing` | Client → Server | `{ userName }` | Signal user is typing |
| `typing` | Server → Others | `{ userName }` | Broadcast typing indicator |

---

## 🛠️ Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Runtime | Node.js (ESM) | Latest LTS |
| HTTP Server | Express | 5.x |
| WebSocket | Socket.IO | 4.8.3 |
| Frontend Framework | React | 19.x |
| Build Tool | Vite | 8.x (beta) |
| Styling | Vanilla CSS | — |
| WebSocket Client | socket.io-client | 4.8.3 |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm

### 1. Clone the repository

```bash
git clone https://github.com/dharamdan01/zello-event-driven-chat.git
cd zello-event-driven-chat
```

### 2. Start the Backend

```bash
cd backend
npm install
node server.js
```

The server will start at **http://localhost:7000**

### 3. Start the Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Vite will start the dev server, typically at **http://localhost:5173**

### 4. Open the App

Open **http://localhost:5173** in your browser (or multiple tabs to simulate multiple users). Enter any name and start chatting!

---

## 🧩 Component Breakdown

### `backend/server.js`
The entire server lives in one file. It creates an Express HTTP server and attaches a Socket.IO instance to it. A single hardcoded room `'group'` acts as the shared chat space. The server only relays events — it holds no message history or user state.

### `frontend/src/ws.js`
A thin factory function that creates and returns a Socket.IO client connection to `localhost:7000`. Kept separate so the connection logic is easy to swap (e.g., point to a production URL via an environment variable).

### `frontend/src/App.jsx`
The root component manages two pieces of state: whether the user has authenticated (entered a name) and the socket reference. It initialises the socket once on mount using `useRef` to avoid reconnections on re-renders, and conditionally renders either `AuthScreen` or `ChatScreen`.

### `frontend/src/components/AuthScreen.jsx`
A name-entry form with client-side validation: strips non-alphabetic characters in real time, blocks empty submissions, and shows inline error messages. Calls `onContinue(name)` on success, which triggers the `joinRoom` socket event in `App.jsx`.

### `frontend/src/components/ChatScreen.jsx`
The core chat UI. Subscribes to three socket events on mount (`sendChatMessage`, `typing`, `userJoined`) and cleans up listeners on unmount. Maintains a local `allMessages` array that holds both regular messages and system notifications (distinguished by `type: 'regular' | 'system'`). Message input sanitizes HTML entities and validates length/content ratio before emitting.

### `frontend/src/components/Header.jsx`
A purely presentational top bar with an animated SVG logo (gradient circle, pulse ring, floating elements) and the "Connect. Chat. Share." tagline. Scales gracefully across screen sizes.

---

## 🔒 Input Safety

| Concern | Handling |
|---|---|
| Username | Strips all non-alphabetic characters via regex on every keystroke |
| Empty/whitespace messages | Blocked before emit |
| Message length | Min 1, max 500 characters |
| Special character spam | Rejected if special chars exceed 50% of message length |
| HTML injection | `&`, `<`, `>`, `"`, `'` are escaped to HTML entities before display |
| Username display | Truncated to 10 characters in the UI |

---

## 📸 UI Screens

**Auth Screen** — Enter your name to join

```
┌─────────────────────────────────┐
│         ● Zello                 │  ← Header (animated logo)
│    Connect. Chat. Share.        │
├─────────────────────────────────┤
│                                 │
│      Enter your name            │
│  Join our real-time community   │
│                                 │
│  ┌───────────────────────────┐  │
│  │  Your name (e.g. John)    │  │
│  └───────────────────────────┘  │
│                     [Continue]  │
└─────────────────────────────────┘
```

**Chat Screen** — Live group room

```
┌─────────────────────────────────┐
│  D  Zello Group Chat            │
│     Ready to chat               │  Signed in as Dharam
├─────────────────────────────────┤
│  ── Dharam joined the group ──  │  ← system message
│                                 │
│  D  Dharam          10:05 AM    │
│     Hello everyone!             │
│                                 │
│  A  Alice           10:06 AM    │
│     Hey Dharam! 👋              │
│                                 │
│     Alice is typing...          │  ← live typing indicator
├─────────────────────────────────┤
│  ╰─── Type a message…  [Send]   │
└─────────────────────────────────┘
```

---

## 🗺️ Future Improvements

- [ ] Persist message history (Redis or a database)
- [ ] Multiple named rooms / private DMs
- [ ] User disconnect notifications
- [ ] Message reactions / emoji support
- [ ] Environment variable support for server URL (`VITE_SERVER_URL`)
- [ ] Production deployment configuration (CORS origin whitelist)
- [ ] End-to-end testing with Playwright

---

## 👤 Author

**Dharam Dan**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/dharam-dan)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-181717?style=flat&logo=github&logoColor=white)](https://github.com/dharamdan01)

---

## 📄 License

This project is open source and available under the [ISC License](./backend/package.json).
