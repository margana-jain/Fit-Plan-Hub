# FitPlanHub - Fitness Marketplace Platform

FitPlanHub is a full-stack MERN application that connects Fitness Trainers with users seeking personalized workout plans. It features a dual-role authentication system (Trainers vs. Users), a subscription model, and a personalized social feed.
Features
For Trainers (Product Management)

    Dashboard: A dedicated, protected dashboard to create, update, and delete fitness plans.

    Plan Management: Create plans with title, price, duration, and detailed descriptions.

    Ownership Security: Trainers can only edit or delete their own plans.

For Users (Discovery & Social)

    Marketplace: Browse all available fitness plans from various trainers.

    Subscriptions: "Purchase" plans to unlock full details (simulated payment).

    Social Graph: Follow favorite trainers to curate a personalized feed.

    Personalized Feed: A dynamic feed showing only plans from followed trainers.

    My Subscriptions: Centralized view of all active subscriptions.

Tech Stack

    Frontend: React (Vite), Tailwind CSS, React Router DOM, Axios, Context API.

    Backend: Node.js, Express.js.

    Database: MongoDB (Mongoose) with complex relationships (References, Population).

    Authentication: JWT (JSON Web Tokens) with custom middleware for Role-Based Access Control (RBAC).

Installation & Setup

Follow these steps to run the project locally.
1. Prerequisites

    Node.js installed.

    MongoDB installed locally or a MongoDB Atlas URI.

2. Backend Setup
Bash

cd backend
npm install

Create a .env file in the backend folder

Start the Server:
Bash

npm run dev
# Server runs on http://localhost:5000

3. Frontend Setup

Open a new terminal:
Bash

cd frontend
npm install
npm run dev
# App runs on http://localhost:5173

Project Structure
Backend Architecture (/backend)

    models/: Mongoose schemas defining relationships.

        User.js: Handles auth & roles.

        FitnessPlan.js: References the Trainer (User).

        Subscription.js: Links User and Plan (Many-to-Many).

        Follow.js: Social graph connections.

    controllers/: Business logic separated from routes.

        planController.js: Handles CRUD and the "IN" query for the Feed.

        authController.js: Generates JWTs.

    middleware/:

        authentication.js: Verifies Token & Checks req.user.role.

Frontend Architecture (/frontend)

    context/AuthContext.jsx: Global state management for User/Token.

    api/axios.js: Interceptor that automatically attaches Bearer Token to requests.

    pages/:

        TrainerDashboard.jsx: Protected route for trainers.

        UserFeed.jsx: Personalized view using parallel data fetching.

    components/PlanCard.jsx: Smart component that handles Subscribe/Follow logic and UI state.

Security Features

    Password Hashing: Passwords are hashed using bcryptjs before storage.

    RBAC: Middleware ensures Users cannot access Trainer routes.

    Data Validation: Backend checks against "Self-Subscription" and "Self-Following".

    CORS: Configured to allow secure communication between frontend and backend.

📝 API Endpoints
Method	Endpoint	Description	Access
POST	  /api/auth/register	Register new user/trainer	Public
POST	  /api/auth/login	Login and receive JWT	Public
GET	    /api/plans	Get all plans	Public
GET	    /api/plans/feed	Get plans from followed trainers	User
POST	  /api/subscriptions	Subscribe to a plan	User
POST	  /api/follow	Follow a trainer	User
POST	  /api/plans	Create a plan	Trainer


PostMan collections: https://web.postman.co/workspace/My-Workspace~675f3e7d-0e44-43f7-8c48-b3e735fdfc92/collection/36645389-4390de93-5293-47b7-8785-5d8106ca0bb1?action=share&source=copy-link&creator=36645389
