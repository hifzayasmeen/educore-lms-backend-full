EduCore LMS – Backend Full

This repository combines the backend services for the EduCore LMS project into a single codebase.

Structure
educore-lms-backend-full/
├── backend/           # Core backend APIs (users, courses, assignments, submissions, auth, roles)
└── certificate-api/   # Certificate generation, notifications, team lead review, and analytics APIs
Projects
1. backend/

Handles the core platform functionality:

User authentication (JWT-based login/register)
Role management (Student, Instructor, Team Lead, Admin)
Course, Assignment, and Submission CRUD APIs
Database schema and migrations
API documentation (Swagger/Postman)

See backend/README.md for setup instructions specific to this service.

2. certificate-api/

Handles the remaining platform features:

Certificate generation on course completion
Notification APIs (new assignments/grades, read/unread status)
Team Lead review APIs (approve/reject submissions with feedback)
Analytics/reporting endpoints (student progress, completion rates)
Real-time/polling-based notification updates

See certificate-api/README.md for setup instructions specific to this service.

Getting Started

Each subfolder is an independent service with its own dependencies. To run either service:

bash
cd backend
npm install
npm start
bash
cd certificate-api
npm install
npm start

Refer to each subfolder's own README and .env.example file for environment variables and further setup details.
