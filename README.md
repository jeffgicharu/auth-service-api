# Standalone Authentication Microservice

A robust, standalone authentication microservice built with Node.js, Express, and TypeScript. This service handles user registration, secure login using JWTs (Access and Refresh Tokens), and session management with a PostgreSQL database.

## Key Features

-   **Secure Registration:** New user creation with password hashing using **Argon2**.
-   **Advanced JWT Authentication:** Implements a secure access token (15m expiry) and refresh token (7d expiry) strategy.
-   **Secure Token Handling:** Refresh tokens are stored as hashes in the database and sent to clients via secure `httpOnly` cookies.
-   **Token Refresh Mechanism:** A dedicated `/refresh` endpoint provides seamless session renewal.
-   **Protected Routes:** Middleware to protect specific API endpoints, ensuring only authenticated users can access them.
-   **Typed Codebase:** Fully written in TypeScript for enhanced reliability and developer experience.

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