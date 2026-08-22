 CREATE TABLE IF NOT EXISTS submissions (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES students(id),
    course_id INTEGER NOT NULL REFERENCES courses(id),
    submission_content TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    feedback TEXT,
    reviewed_at TIMESTAMP,
    submitted_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO submissions (student_id, course_id, submission_content)
VALUES (1, 2, 'Yahan mera JavaScript Basics ka assignment link hai: github.com/alikhan/js-basics');