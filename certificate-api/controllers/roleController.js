const pool = require('../config/db');

// Saari roles ki list
const getRoles = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM roles');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Kuch masla hua', error: error.message });
  }
};

// Users, saath unka role bhi
const getUsersWithRoles = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT users.id, users.full_name, users.email, roles.name AS role_name
      FROM users
      JOIN roles ON users.role_id = roles.id
    `);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Kuch masla hua', error: error.message });
  }
};

// Kisi user ko naya role assign karna
const assignRole = async (req, res) => {
  try {
    const { user_id, role_id } = req.body;

    if (!user_id || !role_id) {
      return res.status(400).json({ message: 'user_id aur role_id zaroori hain' });
    }

    const result = await pool.query(
      'UPDATE users SET role_id = $1 WHERE id = $2 RETURNING id, full_name, role_id',
      [role_id, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User nahi mila' });
    }

    res.status(200).json({ message: 'Role assign ho gaya', user: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Kuch masla hua', error: error.message });
  }
};

module.exports = { getRoles, getUsersWithRoles, assignRole };