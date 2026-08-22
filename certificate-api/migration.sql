CREATE TABLE IF NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL
);

CREATE TABLE IF NOT EXISTS certificates (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES students(id),
    course_id INTEGER NOT NULL REFERENCES courses(id),
    certificate_code VARCHAR(50) UNIQUE NOT NULL,
    certificate_url TEXT NOT NULL,
    issued_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO students (name, email) VALUES ('Ali Khan', 'ali@example.com') ON CONFLICT DO NOTHING;
INSERT INTO courses (title) VALUES ('Node.js Basics') ON CONFLICT DO NOTHING;