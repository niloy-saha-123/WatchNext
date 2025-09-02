# WatchNext

WatchNext is a modern, full-stack web application designed to help users track their watched movies and TV shows and discover what to watch next. It addresses the common problem of forgetting viewing progress and not knowing when new seasons or sequels are released. Built with a focus on a clean user experience, WatchNext leverages the TMDB API for comprehensive media data and provides a personalized dashboard for each user.

---

## Live Demo

**[Link to your deployed application]** (e.g., watchnext.vercel.app)

---

## Screenshot


*A preview of the main user dashboard, showcasing the personalized "What's Next" lists.*

---

## Features

* **Full User Authentication:** Secure user registration and login using JWT (JSON Web Tokens) for session management.
* **Comprehensive Media Search:** Instant search functionality powered by the TMDB API to find any movie or TV show.
* **Personalized Watch Lists:** Log movies and specific TV show seasons to a personal, persistent "watched" library.
* **Dynamic "What's Next" Dashboard:** The core of the application, which automatically tells users:
    * When a new season of a watched show has been released.
    * Which shows they can continue watching.
    * When a sequel to a watched movie is available.
* **"Memory Cache" (Planned):** A unique feature to add personal plot notes after finishing a season to remember key details for the future.
* **"Binge Calculator" (Planned):** A smart feature to calculate the total time required to catch up on unwatched seasons of a show.

---

## Tech Stack & Architecture

WatchNext is built on a decoupled client-server architecture. The React frontend is a Single-Page Application (SPA) that communicates with a backend REST API built with Node.js and Express.

* **Frontend:**
    * **React 18**
    * **Vite** (Build Tool)
    * **Axios** (HTTP Client)
    * **Tailwind CSS** (Styling)

* **Backend:**
    * **Node.js**
    * **Express.js** (Web Framework)
    * **Mongoose** (ODM for MongoDB)
    * **JSON Web Token (JWT)** (Authentication)
    * **bcrypt.js** (Password Hashing)

* **Database:**
    * **MongoDB Atlas** (Cloud-hosted NoSQL Database)

* **Deployment:**
    * **Vercel** (for Frontend)
    * **Render** (for Backend)

---

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Ensure you have the following installed on your local machine:
* Node.js (LTS version recommended)
* npm (comes with Node.js)
* Git

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/niloy-saha-123/WatchNext.git](https://github.com/niloy-saha-123/WatchNext.git)
    cd WatchNext
    ```

2.  **Setup the Backend Server:**
    * Navigate to the server directory and install dependencies.
        ```sh
        cd server
        npm install
        ```
    * Create a `.env` file in the `server` directory. See the Environment Variables section below for the required variables.

3.  **Setup the Frontend Client:**
    * From the root directory, navigate to the client directory and install dependencies.
        ```sh
        cd ../client
        npm install
        ```
    * Create a `.env` file in the `client` directory. See the Environment Variables section below.

4.  **Run the Application:**
    * Start the backend server (from the `server` directory):
        ```sh
        npm run dev
        ```
    * In a separate terminal, start the frontend development server (from the `client` directory):
        ```sh
        npm run dev
        ```
    * Open your browser and navigate to `http://localhost:5173` (or the port specified by Vite).

---

## Environment Variables

To run this project, you will need to add the following environment variables to your `.env` files. Create a `.env` file in both the `/client` and `/server` directories.

**Server (`/server/.env`):**