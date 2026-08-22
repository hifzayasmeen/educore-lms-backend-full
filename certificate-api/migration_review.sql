-- Existing submissions table me review ke liye columns add karo
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'pending';
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP;

-- Testing ke liye ek dummy submission (agar pehle se koi nahi hai)
INSERT INTO submissions (assignment_id, student_id, submission_text)
VALUES (1, 1, 'Yahan mera assignment submission hai: github.com/alikhan/js-basics')
ON CONFLICT DO NOTHING;