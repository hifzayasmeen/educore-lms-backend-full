const pool = require('../config/db');

// 1) Student ka progress dikhao
const getStudentProgress = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Submissions ka breakdown
    const submissionsResult = await pool.query(
      `SELECT status, COUNT(*) AS count
       FROM submissions
       WHERE student_id = $1
       GROUP BY status`,
      [studentId]
    );

    // Certificates count
    const certificatesResult = await pool.query(
      `SELECT COUNT(*) AS total_certificates
       FROM certificates
       WHERE student_id = $1`,
      [studentId]
    );

    // Total submissions
    const totalResult = await pool.query(
      `SELECT COUNT(*) AS total_submissions
       FROM submissions
       WHERE student_id = $1`,
      [studentId]
    );

    // Breakdown ko clean object me convert karo
    const breakdown = { pending: 0, approved: 0, rejected: 0 };
    submissionsResult.rows.forEach(row => {
      breakdown[row.status] = parseInt(row.count);
    });

    res.json({
      student_id: parseInt(studentId),
      total_submissions: parseInt(totalResult.rows[0].total_submissions),
      submissions_breakdown: breakdown,
      total_certificates: parseInt(certificatesResult.rows[0].total_certificates),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

// 2) Course completion rate dikhao
const getCourseCompletionRate = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Kitne unique students ne is course ke assignments submit kiye
    const enrolledResult = await pool.query(
      `SELECT COUNT(DISTINCT s.student_id) AS enrolled_students
       FROM submissions s
       JOIN assignments a ON s.assignment_id = a.id
       WHERE a.course_id = $1`,
      [courseId]
    );

    // Kitne students ne certificate le liya (completed)
    const completedResult = await pool.query(
      `SELECT COUNT(DISTINCT student_id) AS completed_students
       FROM certificates
       WHERE course_id = $1`,
      [courseId]
    );

    const enrolled = parseInt(enrolledResult.rows[0].enrolled_students);
    const completed = parseInt(completedResult.rows[0].completed_students);
    const completionRate = enrolled > 0 ? ((completed / enrolled) * 100).toFixed(2) : 0;

    res.json({
      course_id: parseInt(courseId),
      enrolled_students: enrolled,
      completed_students: completed,
      completion_rate: `${completionRate}%`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

module.exports = { getStudentProgress, getCourseCompletionRate };