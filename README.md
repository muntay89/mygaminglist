# MyGamingList

MyGamingList is a full-stack game tracking application for discovering games, building a personal library, rating completed titles, writing reviews, managing favorites, and viewing public user profiles and game lists.

The project began as a semester application and evolved into a portfolio project focused on full-stack development, session-based authentication, third-party API integration, responsive UI design, data visualization, authorization, and backend data integrity.

> **Live Demo:** Add the current Vercel production URL here before sharing the repository on a resume.

## Features

- Search IGDB's game catalog with pagination and Xbox, PlayStation, Nintendo, and PC filters.
- Filter out DLC/add-on clutter while retaining main games, remakes, remasters, and standalone expansions.
- View game descriptions, release information, developers/publishers, cover art, and screenshots.
- View available PC store deals through CheapShark.
- Create accounts and sign in using session-based authentication.
- Confirm passwords during signup to reduce accidental password-entry mistakes.
- Maintain a personal game list with:
  - `playing`
  - `completed`
  - `plan to play`
  - `dropped`
- Rate completed games from 0.5 to 5 stars in half-star increments.
- Favorite games and display them on public profiles.
- Create, edit, and delete reviews.
- Enforce ownership checks for list and review mutations on the backend.
- View public user profiles with:
  - total game count
  - status distribution
  - rating distribution
  - favorite games
- Browse another user's game list by status through a read-only public list.
- Navigate from profile status charts directly to the corresponding personal or public list category.
- Browse popular free-to-play PC games.
- Responsive layouts with mobile/tablet media queries, visible focus states, and reduced-motion support.

## Tech Stack

### Frontend

- React 18
- Vite
- React Router
- Axios
- Recharts
- Swiper
- React Icons
- CSS media queries and accessibility states

### Backend

- Node.js
- Express
- MongoDB native driver
- `express-session`
- Mongo-backed session storage
- bcrypt password hashing
- Server-side validation and authorization

### External APIs

- **IGDB / Twitch Authentication** — game search, metadata, covers, platforms, and screenshots
- **CheapShark** — PC store and deal information
- **FreeToGame** — free-to-play PC game discovery

## Architecture

```text
React / Vite
      |
      | Axios + credentialed requests
      v
Express REST API
      |
      |--------------------------|
      |                          |
      v                          v
   MongoDB                  External APIs
   users                    IGDB
   list                     CheapShark
   reviews                  FreeToGame
   sessions
```

The frontend communicates with the Express API instead of directly handling sensitive third-party credentials. IGDB authentication credentials, database credentials, and session secrets remain on the backend.

## Authentication

MyGamingList uses server-side sessions rather than storing authentication tokens in browser storage.

The authentication flow includes:

- username and password signup
- password confirmation during signup
- bcrypt password hashing
- login and logout
- MongoDB-backed session persistence
- `httpOnly` session cookies
- authenticated `/me` requests for restoring login state
- protected frontend routes for account-specific pages

In production, session cookies use `Secure` and `SameSite=None` to support communication between separately hosted frontend and backend deployments.

## Security and Data Integrity

The current implementation includes:

- bcrypt password hashing
- Mongo-backed server sessions
- `httpOnly` session cookies
- `Secure` + `SameSite=None` cookies in production
- credentialed CORS configuration
- session-derived ownership checks for list mutations
- session-derived ownership checks for review edits and deletes
- server-side validation for usernames, passwords, statuses, ratings, titles, and reviews
- completed-game rating validation
- prevention of ratings being retained on non-completed list statuses
- a 1 MB JSON request-body limit
- backend environment variables for secrets and API credentials

The backend does not trust a user ID supplied by the browser when modifying protected user data. Ownership is derived from the authenticated session.

## Personal and Public Lists

MyGamingList separates editable personal-list functionality from public read-only list functionality.

### Personal List

The authenticated user's personal list is available through:

```text
/mygaminglist/list
```

It allows the owner to:

- switch between list categories
- update a game's status
- update completed-game ratings
- remove entries
- manage list-specific data

Backend mutation routes remain protected by authentication and ownership checks.

### Public Lists

Public profiles expose read-only versions of another user's list.

A public list is available through routes such as:

```text
/mygaminglist/profile/:username/list?status=completed
```

Public list views allow visitors to:

- switch between the user's list categories
- view game covers and titles
- view completed-game ratings
- open a game's information page

They do **not** expose edit or delete controls.

This keeps the frontend behavior consistent with the backend authorization model:

```text
                     Read      Update      Delete
Own list              Yes        Yes         Yes
Another user's list   Yes        No          No
```

## Public Profiles

Public profiles display aggregated information about each user's gaming activity.

Profile data includes:

- username
- account creation date
- total list entries
- number of games currently playing
- number of completed games
- number of dropped games
- number of planned games
- favorite games
- list-status distribution
- rating distribution

The profile visualizations are powered by real user list data using Recharts.

### Status Chart Navigation

The list-status pie chart changes behavior depending on whose profile is being viewed.

When viewing your own profile:

```text
Profile status
      ↓
Editable personal list
```

For example:

```text
/mygaminglist/list?status=completed
```

When viewing another user's profile:

```text
Profile status
      ↓
Read-only public list
```

For example:

```text
/mygaminglist/profile/username/list?status=completed
```

Public profile analytics are calculated server-side rather than giving the frontend access to another user's authenticated list endpoint.

## Game Data

### IGDB

IGDB is the primary game-data provider.

The backend handles Twitch client-credential authentication and exposes frontend-friendly endpoints for:

- game search
- game details
- cover images
- screenshots
- release dates
- developers and publishers
- platform information

Platform-specific filtering is handled by backend-owned IGDB platform groups so provider-specific IDs do not need to be spread throughout the React application.

### CheapShark

CheapShark provides PC pricing and deal information for game information pages.

The backend acts as an intermediary between the frontend and CheapShark and returns relevant store/deal information.

### FreeToGame

FreeToGame powers the application's free-to-play discovery page and provides popular free PC game information.

## Data Visualizations

Public profiles include two Recharts visualizations backed by actual user data.

### List Status Distribution

A pie chart displays the number of games in:

- Playing
- Completed
- Plan to Play
- Dropped

Pie-chart selections also act as navigation to the corresponding list category.

### Rating Distribution

A bar chart displays how many completed games the user has assigned each rating from:

```text
0.5 → 5.0
```

This data is aggregated by the backend before being returned to the profile page.

## Reviews

Users can create reviews associated with individual games.

Review functionality includes:

- half-star ratings
- review text
- viewing reviews from other users
- editing your own reviews
- deleting your own reviews

The backend determines review ownership from the authenticated session before allowing mutations.

## Local Setup

### 1. Clone the Repository

```bash
git clone https://github.com/muntay89/MyGamingList.git
cd MyGamingList
```

### 2. Configure the Backend

```bash
cd BackendPract
cp .env.example .env
npm install
```

Configure:

```env
MONGO_URI=
FRONTEND_ORIGIN=http://localhost:5173
NODE_ENV=development
PORT=8000
SESSION_SECRET=
IGDB_CLIENT_ID=
IGDB_CLIENT_SECRET=
```

Start the backend:

```bash
npm run dev
```

### 3. Configure the Frontend

Open another terminal:

```bash
cd React
cp .env.example .env
npm install
```

Configure:

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

Start Vite:

```bash
npm run dev
```

For a production build:

```bash
npm run build
```

## API Overview

### Authentication

```text
/api/v1/auth

POST /signup
POST /login
POST /logout
GET  /me
```

### IGDB

```text
/api/v1/igdb

GET /games
GET /games/:id
GET /games/:id/screenshots
```

### Personal Lists

```text
/api/v1/list

POST   /new
GET    /status/:status
GET    /favorites
GET    /:gameId
PUT    /:listEntryId
DELETE /:listEntryId
```

These routes are used for authenticated personal-list functionality.

### Reviews

```text
/api/v1/reviews

GET    /game/:gameId
GET    /my/game
GET    /my/game/:gameId
POST   /new
PUT    /:reviewId
DELETE /:reviewId
```

### Profiles

```text
/api/v1/profiles

GET /:username/profile
GET /:username/list/:status
```

The profile list endpoint is read-only and is used to display another user's public list.

### Deals

```text
/api/v1/deals

GET /cheapshark/search
GET /free-games
```

## Notable Engineering Work

### RAWG to IGDB Migration

The original version of MyGamingList used RAWG as its primary game-data provider.

The application was later migrated to IGDB without requiring a full rewrite of the React frontend. The Express backend acts as an adapter between IGDB and the application's existing frontend data model.

This allowed the application to retain its existing UI while changing the underlying game-data provider.

### Public vs. Private Data

Personal and public list access are deliberately separated.

Authenticated list mutations use:

```text
/api/v1/list
```

while another user's read-only list is retrieved through:

```text
/api/v1/profiles/:username/list/:status
```

This allows profiles to expose useful social functionality without weakening ownership protections on personal list mutations.

### Session-Derived Ownership

List and review mutations do not rely on a browser-supplied user ID to determine ownership.

Instead, the backend derives the authenticated user's identity from the server session and combines it with the requested resource ID when performing updates or deletes.

Conceptually:

```text
Requested entry ID
        +
Authenticated session user
        ↓
Matching owned resource
```

A request cannot modify another user's entry simply by supplying that entry's identifier.

### Data Consistency

Completed games require a valid rating in half-star increments.

Valid ratings are:

```text
0.5
1.0
1.5
2.0
2.5
3.0
3.5
4.0
4.5
5.0
```

Non-completed statuses do not retain a rating.

These rules are enforced by the backend on both list creation and list updates rather than relying exclusively on frontend validation.

### Responsive Design

The interface uses custom CSS and responsive media queries rather than a component styling framework.

Responsive work includes adjustments for:

- navigation
- game search results
- game-information pages
- personal lists
- public lists
- reviews
- profile statistics
- Recharts visualizations
- authentication forms
- smaller mobile viewports

Reduced-motion rules and focus states are also included for accessibility.

## Project Structure

```text
MyGamingList/
|
|-- BackendPract/
|   |-- api/
|   |-- dao/
|   |-- middleware/
|   |-- routes/
|   |-- .env.example
|   |-- server.js
|   `-- index.js
|
|-- React/
|   |-- src/
|   |   |-- api/
|   |   |-- components/
|   |   |-- context/
|   |   |-- pages/
|   |   |-- App.jsx
|   |   `-- App.css
|   |
|   |-- public/
|   `-- .env.example
|
`-- README.md
```

## Deployment

The frontend is designed for deployment on Vercel and the Express backend on a Node hosting platform such as Render.

Production environment variables should be configured through the hosting providers rather than committed to Git.

Before publishing the project on a resume:

1. Add the current Vercel production URL to the Live Demo section.
2. Verify the latest GitHub commit is deployed by both Vercel and Render.
3. Verify frontend and backend production environment variables.
4. Verify signup, login, and logout.
5. Verify adding, editing, and deleting personal-list entries.
6. Verify completed-game ratings.
7. Verify favorites.
8. Verify review creation, editing, and deletion.
9. Verify your own profile chart navigation.
10. Verify another user's read-only public list.
11. Verify responsive layouts on desktop and mobile.
12. Revoke any legacy RAWG API key that may remain exposed in old Git history.

## Future Work

Potential future improvements include:

- automated integration tests for authenticated API routes
- database-level unique indexes for usernames and per-user game-list entries
- shared/distributed rate limiting if the backend is scaled horizontally
- caching third-party API responses if traffic increases
- expanded profile and list filtering
- personalized game recommendations using accumulated rating and list data

## Background

MyGamingList was developed as a solo project and expanded beyond its original course requirements into a deployable full-stack portfolio application.

The project demonstrates practical experience with:

- React application architecture
- REST API development
- MongoDB persistence
- authentication and sessions
- authorization and ownership
- third-party APIs
- data visualization
- responsive CSS
- public/private data modeling
- deployment-oriented configuration
