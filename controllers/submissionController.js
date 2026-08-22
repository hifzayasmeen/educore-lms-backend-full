 const pool = require('../config/db');

// POST /api/submissions - Student submits an assignment
async function createSubmission(req, res) {
  const { assignment_id, submission_text } = req.body;
  const student_id = req.user.id;
  const file_path = req.file ? req.file.path : null;

  try {
    const result = await pool.query(
      `INSERT INTO submissions (assignment_id, student_id, submission_text, file_path)
       VALUES ($1, $2, $3, $4)
       RETURNING id, assignment_id, student_id, submission_text, file_path, grade, feedback, submitted_at`,
      [assignment_id, student_id, submission_text, file_path]
    );

    return res.status(201).json({ success: true, submission: result.rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error while creating submission.' });
  }
}

// GET /api/submissions/assignment/:assignmentId - List submissions for an assignment
async function getSubmissionsByAssignment(req, res) {
  const { assignmentId } = req.params;

  try {
    const result = await pool.query(
      `SELECT s.id, s.assignment_id, s.student_id, u.full_name AS student_name,
              s.submission_text, s.grade, s.feedback, s.submitted_at
       FROM submissions s
       JOIN users u ON s.student_id = u.id
       WHERE s.assignment_id = $1
       ORDER BY s.submitted_at DESC`,
      [assignmentId]
    );

    return res.json({ success: true, submissions: result.rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error while fetching submissions.' });
  }
}

// PUT /api/submissions/:id/grade - Instructor/Admin grades a submission
async function gradeSubmission(req, res) {
  const { id } = req.params;
  const { grade, feedback } = req.body;

  try {
    const existing = await pool.query('SELECT id FROM submissions WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Submission not found.' });
    }

const result = await pool.query(
  `SELECT s.id, s.assignment_id, s.student_id, u.full_name AS student_name,
          s.submission_text, s.file_path, s.grade, s.feedback, s.submitted_at
   FROM submissions s
   JOIN users u ON s.student_id = u.id
   WHERE s.assignment_id = $1
   ORDER BY s.submitted_at DESC`,
  [assignmentId]
);

    return res.json({ success: true, submission: result.rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error while grading submission.' });
  }
}

module.exports = { createSubmission, getSubmissionsByAssignment, gradeSubmission };