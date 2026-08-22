# Certificate API — Day 1 Task

Ye poora working project hai. Neeche diye steps follow karo, ek-ek karke.

## Step 1: Node.js install karo (agar pehle se nahi hai)
Check karo terminal mein:
```
node -v
```
Agar error aaye to https://nodejs.org se LTS version download karo.

## Step 2: PostgreSQL install karo (agar pehle se nahi hai)
- Windows/Mac: https://www.postgresql.org/download/ se download karo
- Install ke waqt ek password set karoge — wahi `.env` file mein daalna hai

## Step 3: Project folder mein jao aur dependencies install karo
Terminal mein project folder ke andar:
```
npm install
```
Ye `package.json` mein likhi saari libraries (express, pg, pdfkit, dotenv, uuid) install kar dega.

## Step 4: Database banao
pgAdmin ya terminal (psql) khol ke ek naya database banao:
```
CREATE DATABASE lms_db;
```

## Step 5: .env file update karo
`.env` file kholo aur apna real password aur database ka naam daalo:
```
DB_USER=postgres
DB_PASSWORD=yaha_apna_password_dalo
DB_HOST=localhost
DB_PORT=5432
DB_NAME=lms_db
```

## Step 6: Tables banao
`migration.sql` file ko apne database mein run karo. Do tarike hain:
- pgAdmin: Query tool kholo, migration.sql ka content paste karo, Run dabao
- Terminal: `psql -U postgres -d lms_db -f migration.sql`

## Step 7: Server chalao
```
npm start
```
Agar sab sahi hai to terminal mein dikhega:
```
✅ Database connected successfully
✅ Server chal raha hai: http://localhost:5000
```

## Step 8: Postman se test karo

### A) Certificate generate karo
- Method: POST
- URL: `http://localhost:5000/api/certificates/generate`
- Body (JSON):
```json
{
  "student_id": 1,
  "course_id": 1
}
```
(Ye student_id=1 aur course_id=1 migration.sql ke dummy data se hain)

### B) Student ke saare certificates dekho
- Method: GET
- URL: `http://localhost:5000/api/certificates/1`

### C) Certificate verify karo
- Response se `certificate_code` copy karo, fir:
- Method: GET
- URL: `http://localhost:5000/api/certificates/verify/CODE_YAHA_PASTE_KARO`

## Agar koi error aaye
- "Database connection failed" → .env file check karo, PostgreSQL chal raha hai ya nahi check karo
- "relation does not exist" → migration.sql run nahi hui, Step 6 dobara karo
- "Cannot find module" → `npm install` dobara chalao

## Ye kaise kaam karta hai (summary)
1. `server.js` — app start karta hai
2. `routes/certificateRoutes.js` — decide karta hai konsa URL kis function ko call karega
3. `controllers/certificateController.js` — asli logic (PDF banana, DB mein save karna)
4. `config/db.js` — PostgreSQL se connection
5. `migration.sql` — database tables ka structure
