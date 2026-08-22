const pool = require('../config/db');

// 1) Sab pending submissions list karo (Team Lead ke liye)
const listPendingSubmissions = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.id, s.assignment_id, s.student_id, s.submission_text, s.status,
              st.name AS student_name, a.title AS assignment_title
       FROM submissions s
       JOIN students st ON s.student_id = st.id
       JOIN assignments a ON s.assignment_id = a.id
       WHERE s.status = 'pending'
       ORDER BY s.id DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

// 2) Submission approve karo
const approveSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const { feedback } = req.body;

    const result = await pool.query(
      `UPDATE submissions
       SET status = 'approved', feedback = $1, reviewed_at = NOW()
       WHERE id = $2 RETURNING *`,
      [feedback || null, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Submission nahi mila' });
    }

    res.json({ message: 'Submission approve ho gaya', submission: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

// 3) Submission reject karo
const rejectSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const { feedback } = req.body;

    if (!feedback) {
      return res.status(400).json({ error: 'Reject karne ke liye feedback zaroori hai' });
    }

    const result = await pool.query(
      `UPDATE submissions
       SET status = 'rejected', feedback = $1, reviewed_at = NOW()
       WHERE id = $2 RETURNING *`,
      [feedback, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Submission nahi mila' });
    }

    res.json({ message: 'Submission reject ho gaya', submission: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

module.exports = { listPendingSubmissions, approveSubmission, rejectSubmission };