# Citizen Engagement System

## Project Description

The Citizen Engagement System is a web application designed to facilitate communication and issue resolution between citizens and government agencies. Citizens can submit complaints, track their status, and view responses. Agency users can view and manage complaints assigned to their agency, while administrators have an overview of all complaints and basic management capabilities.

## Features

### Implemented Features

- **User Authentication:** Secure registration and login for different user roles (citizen, agency, admin, superadmin).
- **Complaint Submission:** Citizens can submit new complaints with details like title, description, category, location, and priority.
- **Complaint Tracking:** Users can view a list of submitted complaints and see their current status and details.
  - Citizens see only their own complaints.
  - Agency users see complaints assigned to their specific agency.
  - Admin/Superadmin users see all complaints.
- **Admin Dashboard Overview:** Provides administrators and agency users with statistics on complaints (Total, New, In Progress, Resolved, Closed) relevant to their scope, along with basic charts.
- **Admin Complaints Management:** Administrators can view a table of all complaints.
- **Admin Settings - Users:** Administrators can view a list of all users.
- **Admin Settings - Agencies:** Administrators can view a list of agencies and link agency users to agencies.
- **Basic Database Utilities:** Scripts for database backup and seeding initial data.

### Planned/Future Features

- Full CRUD operations for Users, Agencies, and Categories in Admin Settings.
- Advanced filtering and searching for complaints.
- Adding comments/responses to complaints by citizens and agency users.
- Email notifications for status updates and new assignments.
- File attachments for complaints.
- More detailed reporting and analytics on the Admin Dashboard.
- User profile management.
- Public view of complaints (optional).

## Technologies Used

- **Backend:**
  - Node.js
  - Express.js
  - SQLite (Database)
  - bcryptjs (Password Hashing)
  - jsonwebtoken (JWT for Authentication)
  - sqlite3 (SQLite Driver)
- **Frontend:**
  - React
  - TypeScript
  - Tailwind CSS
  - Shadcn UI (Component Library)
  - React Router DOM (Routing)
  - date-fns (Date Formatting)
  - sonner (Toasts/Notifications)
  - recharts (Charts - currently in Admin Dashboard)

## Setup and Installation

To get the project up and running on your local machine, follow these steps:

### Prerequisites

- Node.js (v18 or higher recommended)
- npm, yarn, or pnpm package manager

### 1. Clone the repository

```bash
git clone <repository_url>
cd CitizenEngagementSystem
```
Replace `<repository_url>` with the actual URL of the repository.

### 2. Install Dependencies

Install dependencies for both the backend and the frontend.

```bash
# Install backend dependencies
cd backend
npm install # or yarn install or pnpm install

# Install frontend dependencies
cd ../frontend
npm install # or yarn install or pnpm install
```

### 3. Database Initialization

The application uses SQLite, and the database file (`backend/database.sqlite`) is automatically created and initialized with the necessary tables when the backend server starts for the first time. If you need to reset the database, you can simply delete the `backend/database.sqlite` file.

### 4. Seeding Initial Data (Optional but Recommended)

To populate your database with some initial users, agencies, and complaints for testing, you can run the seed script:

```bash
cd backend
node src/scripts/seedData.js
```

### 5. Run the Backend Server

Navigate to the `backend` directory and start the server:

```bash
cd backend
npm start # or yarn start or pnpm start
```
The backend server will run on `http://localhost:3000` (or the port specified in your `.env` file if you create one).

### 6. Run the Frontend Application

Navigate to the `frontend` directory and start the development server:

```bash
cd frontend
npm run dev # or yarn dev or pnpm dev
```
The frontend application will typically run on `http://localhost:5173` (or another available port).

### 7. Access the Application

Open your web browser and go to the address where the frontend application is running (e.g., `http://localhost:5173`). You should now be able to use the Citizen Engagement System.

---

© 2025 CitizenEngagementSystem. All rights reserved.
