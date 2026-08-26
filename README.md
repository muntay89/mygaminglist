# MyGamingList

**A full-stack game discovery, tracking, rating, and review platform built with React, Express, and MongoDB.**

MyGamingList lets users discover games, organize a personal library, rate completed titles, write reviews, favorite games, and explore public player profiles backed by real activity data.

Originally developed as a semester project, MyGamingList was expanded into a production-style portfolio application with session-based authentication, third-party API integration, protected REST endpoints, responsive design, accessibility-focused UI behavior, and server-side data validation.

### [Live Demo](https://my-gaming-list-seven.vercel.app/mygaminglist/)

---

## Highlights

- Search thousands of games using **IGDB** with platform filtering and pagination.
- Browse game metadata, covers, screenshots, release information, developers, publishers, and ratings.
- Discover **popular/trending games** directly from the homepage.
- Track games as **Playing**, **Completed**, **Plan to Play**, or **Dropped**.
- Rate completed games from **0.5–5 stars** in half-star increments.
- Write, edit, and delete reviews with authenticated ownership checks.
- Automatically synchronize reviewed games with the user's completed list and rating.
- Favorite games and display them on public profiles.
- View public user profiles with real list statistics and data visualizations.
- Browse another user's game list by status in a read-only public view.
- Compare current PC game deals through **CheapShark**.
- Discover free-to-play PC games through **FreeToGame**.
- Responsive layouts across desktop, laptop, tablet, and mobile viewports.
- Keyboard focus states, reduced-motion support, touch-friendly controls, and other accessibility-focused responsive behavior.

---

## Tech Stack

### Frontend

- **React 18**
- **Vite**
- **React Router**
- **Axios**
- **Recharts**
- **React Icons**
- **CSS3** with responsive media queries and accessibility states

### Backend

- **Node.js**
- **Express**
- **MongoDB** / MongoDB Atlas
- **express-session**
- **connect-mongo**
- **bcrypt**

### External APIs

- **IGDB + Twitch OAuth** — game search, metadata, covers, screenshots, ratings, and platform information
- **CheapShark** — PC store pricing and deals
- **FreeToGame** — free-to-play PC game discovery

### Deployment

- **Vercel** — React frontend
- **Render** — Express API
- **MongoDB Atlas** — application data and persisted sessions

---

## Core Features

### Game Discovery

Users can search IGDB's catalog and filter results by major platform families including:

- PC
- PlayStation
- Xbox
- Nintendo

The backend owns the IGDB integration and Twitch client-credentials flow, keeping API credentials out of the browser. Provider responses are normalized before being returned to the React frontend.

Game pages include information such as:

- cover artwork
- description
- release date
- genres
- platforms
- developers and publishers
- community rating
- screenshots

The backend also filters unwanted DLC/add-on results from search to keep discovery focused on useful standalone titles.

### Personal Game Library

Authenticated users can maintain a personal library with four statuses:

```text
Playing
Completed
Plan to Play
Dropped
```

Users can:

- add games to their library
- move games between statuses
- rate completed games
- favorite titles
- update existing entries
- remove games from their list

Ratings are validated server-side and only accepted in **0.5-star increments from 0.5 to 5**. Moving a game away from `completed` removes its rating to keep stored data consistent.

### Reviews

Users can create, edit, and delete reviews for games.

The review workflow includes:

- authenticated write operations
- one review per user per game
- 0.5–5 star rating validation
- review-length validation
- server-side ownership checks for edits and deletes
- automatic synchronization between reviews and the user's completed-game list

When a review is created or its rating is updated, the corresponding game is added to or updated in the user's **Completed** list. This keeps profile statistics, list ratings, and reviews consistent without requiring duplicate user actions.

### Public Profiles & Analytics

Each user has a public profile built from server-side aggregated list data.

Profiles display:

- account join date
- total tracked games
- games by status
- favorite games
- rating distribution

Two **Recharts** visualizations turn real user activity into profile analytics:

- **List Status Distribution** — pie chart of Playing, Completed, Planned, and Dropped games
- **Rating Distribution** — bar chart showing the user's ratings from 0.5 to 5 stars

Profile status navigation can lead to either the authenticated user's editable list or another user's read-only public list.

### Deals & Free Games

MyGamingList supplements game discovery with additional external data:

- **CheapShark** provides available PC store deals and savings information.
- **FreeToGame** powers a dedicated free-to-play discovery page.

These requests are routed through the Express backend rather than coupling the frontend directly to third-party services.

---

## Authentication & Authorization

MyGamingList uses **server-side sessions** rather than storing authentication tokens in browser storage.

Authentication includes:

- account creation
- bcrypt password hashing
- login and logout
- persisted MongoDB-backed sessions
- `httpOnly` session cookies
- session restoration through an authenticated `/me` endpoint
- protected React routes
- protected Express routes

For protected mutations, the backend derives the user ID from the authenticated session rather than trusting a user ID sent by the client.

This is used to enforce ownership when users modify:

- list entries
- ratings
- favorites
- reviews

Production session configuration also accounts for HTTPS/proxy deployment on Render.

---

## Validation & Data Integrity

Validation is performed on the server for security and consistency, including:

- username format and length
- password requirements
- valid game IDs
- valid list statuses
- game-title limits
- valid half-star ratings
- completed-game rating requirements
- review content and maximum length
- duplicate reviews
- authenticated ownership of protected resources

The backend also normalizes state transitions—for example, ratings are cleared when an entry is moved out of `completed`.

---

## Responsive Design & Accessibility

The interface was tested and refined across phone, tablet, laptop, and desktop layouts while preserving the desktop visual design as closely as possible.

Responsive behavior includes:

- layouts that reflow instead of relying on clipped horizontal overflow
- mobile-friendly navigation
- responsive game cards, forms, lists, profiles, charts, and modals
- touch-friendly interactive targets
- visible keyboard focus indicators
- `prefers-reduced-motion` support
- hover-independent behavior for touch devices
- forced-colors support
- responsive chart and rating controls

Homepage presentation also includes animated feature cards, a popular-games carousel, and decorative visual effects while respecting reduced-motion preferences.

---

## Architecture

```text
                         ┌──────────────────────┐
                         │    React + Vite      │
                         │       Frontend       │
                         └──────────┬───────────┘
                                    │
                              Axios / REST
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │   Express REST API   │
                         │  Sessions + Auth     │
                         └───────┬──────┬───────┘
                                 │      │
                  ┌──────────────┘      └───────────────┐
                  ▼                                     ▼
        ┌───────────────────┐                ┌─────────────────────┐
        │   MongoDB Atlas   │                │    External APIs    │
        │                   │                │                     │
        │ • Users           │                │ • IGDB / Twitch    │
        │ • Game lists      │                │ • CheapShark       │
        │ • Reviews         │                │ • FreeToGame       │
        │ • Sessions        │                │                     │
        └───────────────────┘                └─────────────────────┘
```

The frontend never receives IGDB/Twitch secrets or database credentials. Sensitive integrations remain server-side behind the Express API.

---

## Application Routes

Some of the primary frontend routes include:

```text
/mygaminglist/                         Homepage
/mygaminglist/games/page/:number       Game search results
/mygaminglist/game/:gameID              Game details
/mygaminglist/game/:gameID/images       Screenshot viewer
/mygaminglist/reviews/:gameID           Public game reviews
/mygaminglist/newreview/:gameID         Create review
/mygaminglist/myreviews                 Manage personal reviews
/mygaminglist/list                      Personal game library
/mygaminglist/profile/:username         Public profile
/mygaminglist/profile/:username/list    Public user list
/mygaminglist/free                      Free-to-play games
```

---

## Local Development

### Prerequisites

- Node.js
- npm
- MongoDB Atlas database or compatible MongoDB instance
- IGDB/Twitch API credentials

### 1. Clone the repository

```bash
git clone <repository-url>
cd MyGamingList
```

### 2. Configure the backend

```bash
cd BackendPract
npm install
cp .env.example .env
```

Populate `.env`:

```env
MONGO_URI=your_mongodb_connection_string
FRONTEND_ORIGIN=http://localhost:5173
NODE_ENV=development
PORT=8000
SESSION_SECRET=your_session_secret
IGDB_CLIENT_ID=your_twitch_client_id
IGDB_CLIENT_SECRET=your_twitch_client_secret
```

Start the API:

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:8000
```

### 3. Start the frontend

In a second terminal:

```bash
cd React
npm install
npm run dev
```

Vite will provide the local frontend URL, typically:

```text
http://localhost:5173
```

---

## Production Flow

In production, the Vercel frontend sends API requests through `/api/v1`. Vercel rewrites those requests to the deployed Express service on Render.

```text
Browser
   ↓
Vercel / React
   ↓  /api/v1/*
Vercel Rewrite
   ↓
Render / Express
   ↓
MongoDB Atlas + External APIs
```

This keeps the browser-facing application clean while preserving server-side authentication and API credentials.

---

## Engineering Takeaways

Building MyGamingList required solving problems beyond basic CRUD functionality, including:

- migrating game data from an earlier provider to IGDB
- implementing and caching Twitch OAuth credentials server-side
- adapting third-party API responses into a stable frontend data model
- designing authenticated session persistence across production hosting
- enforcing authorization at the API layer instead of relying on the UI
- synchronizing reviews, ratings, and list state
- building public analytics from aggregated MongoDB data
- handling responsive layouts across substantially different viewports
- improving keyboard, touch, focus, and reduced-motion accessibility
- debugging frontend/backend deployment behavior across Vercel, Render, and MongoDB Atlas

The result is a full-stack application that demonstrates both user-facing product development and backend engineering concerns such as authentication, authorization, validation, API integration, persistence, and deployment.

---

## Future Improvements

Potential next steps include:

- automated frontend and API test coverage
- account management features
- richer social/profile functionality
- caching frequently requested third-party game data
- expanded search and discovery filters
- additional profile statistics and recommendation features

---

## Author

**Monte Bradford**  
Computer Science — California State University, Fullerton

