const pool = require('../config/db');

// 1) Naya notification banao
const createNotification = async (req, res) => {
  try {
    const { student_id, title, message, type } = req.body;

    if (!student_id || !title || !message) {
      return res.status(400).json({ error: 'student_id, title aur message zaroori hain' });
    }

    const result = await pool.query(
      `INSERT INTO notifications (student_id, title, message, type)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [student_id, title, message, type || 'general']
    );

    res.status(201).json({
      message: 'Notification ban gaya',
      notification: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

// 2) Student ke sab notifications list karo
const listNotifications = async (req, res) => {
  try {
    const { studentId } = req.params;

    const result = await pool.query(
      `SELECT * FROM notifications
       WHERE student_id = $1
       ORDER BY created_at DESC`,
      [studentId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

// 3) Notification ko READ mark karo
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE notifications SET is_read = TRUE WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Notification nahi mila' });
    }

    res.json({ message: 'Read mark ho gaya', notification: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

// 4) Notification ko UNREAD mark karo
const markAsUnread = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE notifications SET is_read = FALSE WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Notification nahi mila' });
    }

    res.json({ message: 'Unread mark ho gaya', notification: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

// 5) Sirf unread count + latest unread notifications do (polling ke liye)
const getUnreadSummary = async (req, res) => {
  try {
    const { studentId } = req.params;

    const countResult = await pool.query(
      `SELECT COUNT(*) AS unread_count
       FROM notifications
       WHERE student_id = $1 AND is_read = FALSE`,
      [studentId]
    );

    const latestResult = await pool.query(
      `SELECT * FROM notifications
       WHERE student_id = $1 AND is_read = FALSE
       ORDER BY created_at DESC
       LIMIT 5`,
      [studentId]
    );

    res.json({
      unread_count: parseInt(countResult.rows[0].unread_count),
      latest_unread: latestResult.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

module.exports = { createNotification, listNotifications, markAsRead, markAsUnread, getUnreadSummary };