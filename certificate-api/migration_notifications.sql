 CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES students(id),
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'general',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Testing ke liye dummy data
INSERT INTO notifications (student_id, title, message, type)
VALUES (1, 'New Assignment', 'Aapko ek naya assignment mila hai: JavaScript Basics', 'assignment');