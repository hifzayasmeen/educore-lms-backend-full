 const pool = require('../config/db');

// POST /api/courses - Create a new course
async function createCourse(req, res) {
  const { title, description } = req.body;
  const instructor_id = req.user.id; // logged-in user se milega (JWT se)

  try {
    const result = await pool.query(
      `INSERT INTO courses (title, description, instructor_id)
       VALUES ($1, $2, $3)
       RETURNING id, title, description, instructor_id, created_at`,
      [title, description, instructor_id]
    );

    return res.status(201).json({ success: true, course: result.rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error while creating course.' });
  }
}

// GET /api/courses - List all courses
async function getCourses(req, res) {
  try {
    const result = await pool.query(
      `SELECT c.id, c.title, c.description, c.created_at, u.full_name AS instructor_name
       FROM courses c
       JOIN users u ON c.instructor_id = u.id
       ORDER BY c.created_at DESC`
    );

    return res.json({ success: true, courses: result.rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error while fetching courses.' });
  }
}

// PUT /api/courses/:id - Update a course
async function updateCourse(req, res) {
  const { id } = req.params;
  const { title, description } = req.body;

  try {
    const existing = await pool.query('SELECT id FROM courses WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    const result = await pool.query(
      `UPDATE courses SET title = $1, description = $2 WHERE id = $3
       RETURNING id, title, description, instructor_id, created_at`,
      [title, description, id]
    );

    return res.json({ success: true, course: result.rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error while updating course.' });
  }
}

// DELETE /api/courses/:id - Delete a course
async function deleteCourse(req, res) {
  const { id } = req.params;

  try {
    const existing = await pool.query('SELECT id FROM courses WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    await pool.query('DELETE FROM courses WHERE id = $1', [id]);

    return res.json({ success: true, message: 'Course deleted successfully.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error while deleting course.' });
  }
}

module.exports = { createCourse, getCourses, updateCourse, deleteCourse };