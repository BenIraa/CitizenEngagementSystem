# Citizen Engagement System

A full-stack application for managing citizen complaints and feedback.

## Project Structure

The project is divided into two main directories:

- `frontend/`: React + Vite frontend application
- `backend/`: Express + SQLite backend API

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with the following content:
```
PORT=3000
JWT_SECRET=your-super-secret-key-change-this-in-production
NODE_ENV=development
```

4. Start the development server:
```bash
npm run dev
```

The backend will run on http://localhost:3000

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on http://localhost:5173

## Features

- User authentication (register/login)
- Submit and track complaints
- Categorize complaints
- Admin dashboard for managing complaints
- Real-time status updates
- Response system for complaints

## API Endpoints

### Authentication
- POST `/api/users/register` - Register a new user
- POST `/api/users/login` - Login user
- GET `/api/users/profile` - Get user profile (protected)

### Complaints
- GET `/api/complaints` - Get all complaints
- GET `/api/complaints/:id` - Get a specific complaint
- POST `/api/complaints` - Create a new complaint (protected)
- PATCH `/api/complaints/:id/status` - Update complaint status (admin only)
- GET `/api/complaints/:complaint_id/responses` - Get responses for a complaint
- POST `/api/complaints/:complaint_id/responses` - Add a response (protected)
