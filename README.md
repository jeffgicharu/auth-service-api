# Standalone Authentication Microservice

A robust, production-ready authentication microservice built from the ground up using Node.js, Express, and TypeScript. This service provides a complete and secure system for user registration, login, and session management with a PostgreSQL database.

## Features Explained

This service implements a full suite of modern authentication and security features.

### 1. Secure User Registration
* **What it is:** A secure endpoint for new users to create an account with an email and password.
* **Why it's important:** As the front door to any application, this feature is built with security as a priority. Passwords are never stored directly; instead, they are hashed using the modern and resilient **Argon2** algorithm, ensuring they are protected even in the event of a database breach.

### 2. Advanced Token-Based Login
* **What it is:** When a user logs in, the system generates two distinct digital keys: a short-term **Access Token** and a long-term **Refresh Token**.
* **Why it's important:** This dual-token strategy significantly enhances security. The Access Token (15-min expiry) is used for regular API requests, limiting the window of opportunity if it is ever compromised. The Refresh Token is securely stored in an `httpOnly` cookie and is used only to obtain a new Access Token, providing a robust defense against common web vulnerabilities like XSS.

### 3. Hashed Session & Refresh Token Storage
* **What it is:** The long-lived Refresh Tokens are not stored directly in the database. Instead, a secure hash of each token is stored.
* **Why it's important:** This provides a critical layer of "defense in depth." If the database were ever exposed, the stolen token hashes would be useless to an attacker, preventing them from being able to impersonate user sessions.

### 4. Protected API Routes
* **What it is:** A custom middleware acts as a "gatekeeper" for specific API endpoints, ensuring they can only be accessed by users who present a valid Access Token.
* **Why it's important:** This is the foundation of authorization. It allows the system to have "VIP sections" or protected resources (like a user's profile page) that are exclusively for authenticated users.

### 5. Seamless Session Renewal
* **What it is:** A dedicated `/refresh` endpoint that automatically and silently issues a new Access Token when the old one expires, using the secure Refresh Token.
* **Why it's important:** This provides an excellent user experience. The user remains logged in for an extended period (days) without needing to re-enter their password every 15 minutes, all while the system maintains a high level of security behind the scenes.

## Tech Stack

-   **Backend:** Node.js, Express.js
-   **Language:** TypeScript
-   **Database:** PostgreSQL (managed with Docker)
-   **ORM:** Prisma
-   **Authentication:** `jsonwebtoken` (JWTs), `argon2` (hashing)
-   **Validation:** Zod


## Getting Started

### Prerequisites

-   Node.js
-   Docker and Docker Compose
-   An instance of PostgreSQL running (or use the provided `docker-compose.yml`).

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/jeffgicharu/auth-service-api.git](https://github.com/jeffgicharu/auth-service-api.git)
    cd auth-service-api
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Setup environment variables:**
    Create a `.env` file in the root and add the following variables:
    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/auth_db?schema=public"
    ACCESS_TOKEN_SECRET="<your-strong-access-token-secret>"
    REFRESH_TOKEN_SECRET="<your-strong-refresh-token-secret>"
    ```

4.  **Start the database container:**
    ```bash
    docker-compose up -d
    ```

5.  **Run database migrations:**
    ```bash
    npx prisma migrate dev
    ```

6.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The server will be available at `http://localhost:3000`.