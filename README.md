# WatchNext

WatchNext is a modern, full-stack web application designed to help users track their watched movies and TV shows and discover what to watch next. It addresses the common problem of forgetting viewing progress and not knowing when new seasons or sequels are released. Built with a focus on a clean user experience, WatchNext leverages the TMDB API for comprehensive media data and provides a personalized dashboard for each user.

---

## Project Dashboard

**Status:** `In Development` 🟡

### Current Phase: Phase 1 - Frontend Setup & API Connection

### To-Do List & Development Log

**Phase 0: Foundation & Setup (Completed ✅)**
- [x] Chose project architecture (Decoupled MERN stack)
- [x] Set up monorepo with `/frontend` and `/backend` folders
- [x] Created GitHub repository
- [x] Acquired TMDB API Key
- [x] Set up free MongoDB Atlas cluster

**Phase 1: The "Look and Feel" (In Progress ⏳)**
- [ ] Initialize frontend project in `/frontend` with Vite and pnpm
- [ ] Install core frontend dependencies: `axios`, `react-router-dom`
- [ ] Set up Tailwind CSS for styling
- [ ] Create static UI components (`Navbar`, `SearchBar`, `ResultsGrid`, `ShowCard`)
- [ ] Implement the search functionality to call the TMDB API directly from the frontend
- [ ] Store the TMDB API Key securely in a `.env` file
- [ ] Display search results dynamically in the `ResultsGrid`

**Phase 2: The "Engine Room" (Upcoming ⏩)**
- [ ] Initialize backend project in `/backend` with pnpm
- [ ] Install backend dependencies (`express`, `mongoose`, `jsonwebtoken`, `bcryptjs`, `cors`, `dotenv`)
- [ ] Define Mongoose schemas for `User` and `WatchedItem`
- [ ] Connect server to MongoDB Atlas
- [ ] Build user registration and login API endpoints

---

## Live Demo

**[Link to your deployed application]** (e.g., watchnext.vercel.app)

---

## Features

* **Full User Authentication:** Secure user registration and login using JWT (JSON Web Tokens).
* **Comprehensive Media Search:** Instant search powered by the TMDB API.
* **Personalized Watch Lists:** Log movies and specific TV show seasons.
* **Dynamic "What's Next" Dashboard:** Automatically shows new seasons, sequels, and shows to continue.

---

## Tech Stack & Architectural Decisions

### Core Technologies
* **Frontend:** React, Vite, Axios, Tailwind CSS
* **Backend:** Node.js, Express.js, Mongoose
* **Database:** MongoDB Atlas
* **Deployment:** Vercel (Frontend), Render (Backend)
* **Package Manager:** pnpm (Chosen for speed and disk space efficiency)

### Architectural Decisions Log
* **Architecture: Decoupled (Headless)**
    * **Reason:** Chosen over an integrated framework like Next.js to explicitly demonstrate skills in building a standalone REST API and a separate frontend client, which are core competencies for full-stack roles.
* **Database: NoSQL (MongoDB)**
    * **Reason:** Selected for its flexible, JSON-like document structure which aligns well with JavaScript and the MERN stack. Mongoose provides schema validation for a more structured approach.

---

## Getting Started

To get a local copy up and running, follow these simple steps...
*(The rest of your setup instructions remain the same)*