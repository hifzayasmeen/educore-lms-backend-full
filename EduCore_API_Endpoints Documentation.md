# EduCore LMS API — Auth & Roles Endpoints

Base URL: `http://localhost:5000`

Ye document Day 7 Cross-Team Integration ke liye frontend team ke saath share karne ke liye hai. Neeche diye gaye saare endpoints backend team ne test kar liye hain aur ye ready hain.

---

## 1. Register User

- **Method:** POST
- **URL:** `/api/auth/register`
- **Body (JSON):**
```json
{
  "name": "Ali Test",
  "email": "alitest@example.com",
  "password": "123456",
  "role_id": 1
}
```
- **Success Response (201):**
```json
{
  "message": "User register ho gaya",
  "user": {
    "id": 17,
    "full_name": "Ali Test",
    "email": "alitest@example.com"
  }
}
```
- **Notes:** `role_id` zaroori hai. Roles list `Get Roles` endpoint se milegi. Email unique honi chahiye.

---

## 2. Login

- **Method:** POST
- **URL:** `/api/auth/login`
- **Body (JSON):**
```json
{
  "email": "alitest@example.com",
  "password": "123456"
}
```
- **Success Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": 17,
    "name": "Ali Test",
    "email": "alitest@example.com"
  }
}
```

---

## 3. Get Roles

- **Method:** GET
- **URL:** `/api/roles`
- **Body:** None
- **Success Response (200):**
```json
[
  { "id": 1, "name": "Student" },
  { "id": 2, "name": "Instructor" },
  { "id": 3, "name": "Team Lead" },
  { "id": 4, "name": "Admin" }
]
```

---

## 4. Get Users with Roles

- **Method:** GET
- **URL:** `/api/users-with-roles`
- **Body:** None
- **Success Response (200):**
```json
[
  {
    "id": 17,
    "full_name": "Ali Test",
    "email": "alitest@example.com",
    "role_name": "Student"
  }
]
```

---

## 5. Assign Role

- **Method:** PUT
- **URL:** `/api/assign-role`
- **Body (JSON):**
```json
{
  "user_id": 17,
  "role_id": 2
}
```
- **Success Response (200):**
```json
{
  "message": "Role assign ho gaya",
  "user": {
    "id": 17,
    "full_name": "Ali Test",
    "role_id": 2
  }
}
```

---

## Available Role IDs (Reference)

| id | name |
|----|------|
| 1  | Student |
| 2  | Instructor |
| 3  | Team Lead |
| 4  | Admin |

---

## Status: All 5 endpoints tested and working ✅

## Running with Docker

Start the backend and database together:
docker-compose up --build

Stop everything:
docker-compose down

App will be available at http://localhost:5000
## Live Deployment

Backend API: https://your-railway-url.up.railway.app
Database: Hosted on Supabase (PostgreSQL)

## Local Development
docker-compose up --
## 🚀 Live Deployment

**Backend API:** https://certificate-api-production-a340.up.railway.app  
**Database:** PostgreSQL hosted on Supabase (Southeast Asia - Singapore)  
**Hosting:** Railway (Docker-based deployment)

## 🧪 Local Development (Docker)

```bash
docker-compose up --build
```
App will run at http://localhost:5000

## 📋 Demo Flow (Core Endpoints)

1. **Register User** — `POST /api/auth/register`  
   Creates a new user with hashed password (bcrypt)

2. **Login** — `POST /api/auth/login`  
   Authenticates user and returns success response

3. **Get Roles** — `GET /api/roles`  
   Returns list of available roles (student, admin, instructor)

4. **Get Users with Roles** — `GET /api/users-with-roles`  
   Returns all users joined with their role names

5. **Assign Role** — `PUT /api/assign-role`  
   Updates a user's role assignment

All endpoints tested and verified working on the live deployment via Postman.

## 🛠️ Tech Stack

- Node.js + Express
- PostgreSQL (Supabase)
- Docker + Docker Compose
- Deployed on Railway