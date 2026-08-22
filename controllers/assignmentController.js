 const pool = require('../config/db');

// POST /api/assignments - Create a new assignment
async function createAssignment(req, res) {
  const { course_id, title, description, due_date } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO assignments (course_id, title, description, due_date)
       VALUES ($1, $2, $3, $4)
       RETURNING id, course_id, title, description, due_date, created_at`,
      [course_id, title, description, due_date]
    );

    return res.status(201).json({ success: true, assignment: result.rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error while creating assignment.' });
  }
}

// GET /api/assignments/course/:courseId - List assignments for a course
async function getAssignmentsByCourse(req, res) {
  const { courseId } = req.params;

  try {
    const result = await pool.query(
      `SELECT id, course_id, title, description, due_date, created_at
       FROM assignments
       WHERE course_id = $1
       ORDER BY created_at DESC`,
      [courseId]
    );

    return res.json({ success: true, assignments: result.rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error while fetching assignments.' });
  }
}

module.exports = { createAssignment, getAssignmentsByCourse };